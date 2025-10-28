<# -------------  Infra Labo TSSR – Provisioning (Yassine)  -------------------
   - Join domaine (si besoin)
   - Création OU / groupes AGDLP
   - GPO baseline (exemples)
   - Partages & NTFS
   Exécuter en tant qu’admin sur le contrôleur de domaine ou poste d’admin.
---------------------------------------------------------------------------- #>

param(
  [string]$Domain = "entreprise.local",
  [string]$OuRoot = "OU=LABO,DC=entreprise,DC=local",
  [switch]$CreateShares
)

function Ensure-Module { param($Name)
  if (-not (Get-Module -ListAvailable -Name $Name)) {
    Install-WindowsFeature RSAT-AD-PowerShell -ErrorAction SilentlyContinue | Out-Null
  }
  Import-Module $Name -ErrorAction Stop
}

Write-Host "Chargement modules..." -ForegroundColor Cyan
Ensure-Module ActiveDirectory

# 1) Structure OU
Write-Host "Création structure OU..." -ForegroundColor Cyan
$ous = @(
  "OU=Utilisateurs,$OuRoot",
  "OU=Groupes,$OuRoot",
  "OU=Postes,$OuRoot",
  "OU=Ressources,$OuRoot"
)
foreach($ou in $ous){
  if(-not (Get-ADOrganizationalUnit -LDAPFilter "(distinguishedName=$ou)" -ErrorAction SilentlyContinue)){
    New-ADOrganizationalUnit -Name ($ou -split '=|,')[1] -Path ($ou -replace '^OU=[^,]+,') -ProtectedFromAccidentalDeletion $false
    Write-Host "OU créé : $ou"
  }
}

# 2) Groupes AGDLP d’exemple
Write-Host "Création groupes AGDLP..." -ForegroundColor Cyan
$groups = @(
  @{Name="GG_Donnees_Compta_RW"; Path="OU=Groupes,$OuRoot"},
  @{Name="GG_Donnees_RH_RO";     Path="OU=Groupes,$OuRoot"}
)
foreach($g in $groups){
  if(-not (Get-ADGroup -Identity $g.Name -ErrorAction SilentlyContinue)){
    New-ADGroup -Name $g.Name -GroupScope Global -Path $g.Path -SamAccountName $g.Name -GroupCategory Security
    Write-Host "Groupe créé : $($g.Name)"
  }
}

# 3) Exemple utilisateur
if(-not (Get-ADUser -Filter "SamAccountName -eq 'rh.sophie'" -ErrorAction SilentlyContinue)){
  New-ADUser -Name "Sophie Martin" -SamAccountName "rh.sophie" `
    -Path "OU=Utilisateurs,$OuRoot" -Enabled $true `
    -AccountPassword (ConvertTo-SecureString "Sophie@2024" -AsPlainText -Force)
  Write-Host "Utilisateur créé : rh.sophie"
  Add-ADGroupMember -Identity "GG_Donnees_RH_RO" -Members "rh.sophie"
}

# 4) GPO baseline (exemples minimaux)
Write-Host "GPO baseline..." -ForegroundColor Cyan
Import-Module GroupPolicy -ErrorAction SilentlyContinue
$gpoName = "GPO_Baseline_Securite"
if(-not (Get-GPO -Name $gpoName -ErrorAction SilentlyContinue)){
  $gpo = New-GPO -Name $gpoName
  New-GPLink -Name $gpo.DisplayName -Target $OuRoot -Enforced $false
  # Exemple: désactiver autorun
  Set-GPRegistryValue -Name $gpoName -Key "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" `
    -ValueName "NoDriveTypeAutoRun" -Type DWord -Value 255
}

# 5) Partages (AGDLP)
if($CreateShares){
  Write-Host "Création partages & ACL..." -ForegroundColor Cyan
  $base = "D:\DONNEES"
  $paths = @(
    @{Folder="$base\Compta"; Group="GG_Donnees_Compta_RW"; Rights="Modify"},
    @{Folder="$base\RH";     Group="GG_Donnees_RH_RO";     Rights="ReadAndExecute"}
  )
  New-Item -Type Directory -Path $base -Force | Out-Null
  foreach($p in $paths){
    New-Item -Type Directory -Path $p.Folder -Force | Out-Null
    $acl = Get-Acl $p.Folder
    $rule = New-Object System.Security.AccessControl.FileSystemAccessRule($p.Group,$p.Rights,"ContainerInherit, ObjectInherit","None","Allow")
    $acl.SetAccessRule($rule); Set-Acl $p.Folder $acl
    New-SmbShare -Name (Split-Path $p.Folder -Leaf) -Path $p.Folder -FullAccess "Administrators" -ChangeAccess $p.Group -ErrorAction SilentlyContinue | Out-Null
    Write-Host "Partage prêt : $($p.Folder) → $($p.Group) : $($p.Rights)"
  }
}

Write-Host "Provisioning terminé ✅" -ForegroundColor Green
