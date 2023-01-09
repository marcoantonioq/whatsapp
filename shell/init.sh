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
        ./shell/pull_only.sh
        ./shell/reset.sh
        npm run reset
    fi
    chmod +x $0
    npm install
    npm run gdb
    npm run build
    npm run start
    sleep 5
done
