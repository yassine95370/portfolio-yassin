#!/usr/bin/env bash
# ---------- Menu supervision (Yassine) ----------
# sudo chmod +x menu-supervision.sh && sudo ./menu-supervision.sh

LOG="/var/log/supervision.log"

pause(){ read -rp "Appuyez sur Entrée pour continuer..."; }

updates(){
  echo "=== Mises à jour $(date) ===" | sudo tee -a "$LOG"
  sudo apt update && sudo apt -y upgrade | sudo tee -a "$LOG"
}

health(){
  {
    echo "=== Health $(date) ==="
    echo "--- Uptime ---"; uptime
    echo "--- Disques ---"; df -h
    echo "--- RAM ---"; free -h
    echo "--- Services critiques ---"
    systemctl is-active ssh && systemctl is-enabled ssh
    systemctl is-active cron && systemctl is-enabled cron
  } | sudo tee -a "$LOG"
}

user_add(){
  read -rp "Nom d'utilisateur: " U
  sudo adduser "$U"
  sudo usermod -aG sudo "$U"
  echo "[OK] Utilisateur $U créé et ajouté au groupe sudo" | sudo tee -a "$LOG"
}

backup_home(){
  TS=$(date +%Y%m%d-%H%M)
  TAR="/root/backup-home-$TS.tar.gz"
  sudo tar -czf "$TAR" /home 2>>"$LOG" && echo "Backup: $TAR" | sudo tee -a "$LOG"
}

while true; do
  clear
  echo "==== Supervision Linux – Menu ==== "
  echo "1) Mises à jour"
  echo "2) Santé système (uptime, disques, RAM, services)"
  echo "3) Créer un utilisateur (sudoer)"
  echo "4) Backup /home"
  echo "0) Quitter"
  read -rp "Choix: " c
  case "$c" in
    1) updates; pause ;;
    2) health; pause ;;
    3) user_add; pause ;;
    4) backup_home; pause ;;
    0) exit 0 ;;
    *) echo "Choix invalide"; pause ;;
  esac
done
