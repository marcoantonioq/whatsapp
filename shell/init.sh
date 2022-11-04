#!/bin/bash
cd /home/Arquivos/Projetos/whatsapp
npm update
sleep 60
npm run dev
# sudo systemctl status whatsapp-node
# sudo chown myuser:myuser ./ -R

# sudo crontab -u myuser -e
# @reboot /home/Arquivos/Projetos/whatsapp/shell/init.sh
