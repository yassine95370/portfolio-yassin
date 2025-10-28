# Infra Labo – Notes rapides (Yassine)

## Domaine & OU
- Domaine : `entreprise.local`
- Racine Labo : `OU=LABO,DC=entreprise,DC=local`
- Sous-OU : `Utilisateurs`, `Groupes`, `Postes`, `Ressources`

## Groupes AGDLP
- `GG_Donnees_Compta_RW` : accès Modif sur `\\SRV\Compta`
- `GG_Donnees_RH_RO` : accès Lecture sur `\\SRV\RH`

## GPO baseline (exemples)
- Désactiver AutoRun (`NoDriveTypeAutoRun = 255`)
- Pare-feu activé, UAC maintenu
- Scripts de logon : mapping des lecteurs (`\\SRV\Compta`, `\\SRV\RH`)

## Réseau (exemple)
- VLAN 10 (Users) : 192.168.10.0/24 – GW 192.168.10.1
- VLAN 20 (Admin) : 192.168.20.0/24 – GW 192.168.20.1
- VLAN 30 (Invités) : 192.168.30.0/24 – GW 192.168.30.1
- ROAS : G0/0.10, .20, .30 – `encapsulation dot1q`

## Dépannage rapide
- `ping`, `tracert`, `ipconfig /all`, `show vlan`, `show ip int br`
- `gpresult /h c:\temp\gpo.html`
- `dcdiag`, `repadmin /replsummary`
- Logs Linux : `/var/log/syslog`, `journalctl -xe`

## ToDo/Améliorations
- Ajout monitoring (Zabbix/Prometheus)
- Sauvegardes planifiées (Veeam/rsync)
- Bastion SSH + MFA
