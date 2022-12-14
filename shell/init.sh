#!/bin/bash

# App
while true; do
    # Atualiza servidor
    git fetch
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse @{u})

    if [ $LOCAL = $REMOTE ]; then
        echo "Aplicação atualizada!"
    else
        echo "Atualizando instalação:"
        # git stash
        git pull --ff-only
        chmod +x $0
        # Atualiza app
        npm install
        # Build
        npm run build
    fi
    npm run start || npm run build
    sleep 5
done
