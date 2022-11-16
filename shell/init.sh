#!/bin/bash
# docker build -t whatsapp .
# docker run -d --restart=always whatsapp whatsapp
npm update
while true; do
    sleep 10
    npm run start
done
