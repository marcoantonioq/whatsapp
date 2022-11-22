#!/bin/bash

# App
while true; do
    # Atualiza servidor
    git stash
    git pull --ff-only

    # Atualiza app
    npm update

    # Start...
    sleep 10
    npm run start
done
