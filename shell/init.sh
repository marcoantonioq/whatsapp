#!/bin/bash
# Atualiza servidor
git reset --hard
git pull --ff-only

# Atualiza app
npm update

# App
while true; do
    sleep 10
    npm run start
done
