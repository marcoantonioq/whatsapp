#!/bin/bash
# Atualiza servidor
git stash
git pull --ff-only

# Atualiza app
npm update

# App
while true; do
    sleep 10
    npm run start
done
