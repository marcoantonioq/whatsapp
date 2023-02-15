FROM node:18.13

WORKDIR /app

ENV TZ="America/Sao_Paulo"

RUN  apt-get update \
    && apt-get install -y wget git openssl gnupg ca-certificates tzdata \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list' \
    && apt-get update && apt-get install -y google-chrome-stable \
    && ln -fs /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime && dpkg-reconfigure -f noninteractive tzdata \
    && apt-get clean && apt-get autoremove && rm -rf /var/lib/apt/lists/* 

USER node

EXPOSE 3010
