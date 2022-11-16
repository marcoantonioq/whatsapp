#!/bin/bash
git pull --ff-only
npm update
while true; do
    sleep 10
    npm run start
done
