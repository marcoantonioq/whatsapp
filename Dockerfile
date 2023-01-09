FROM node:18.12.1

WORKDIR /app

ENV TZ="America/Sao_Paulo"

RUN  apt-get update \
    && apt-get install -y wget git openssl gnupg ca-certificates tzdata \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh \
    && chmod +x /usr/sbin/wait-for-it.sh \
    && apt-get clean && apt-get autoremove \
    && rm -rf /var/lib/apt/lists/*
RUN ln -fs /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime && dpkg-reconfigure -f noninteractive tzdata 

EXPOSE 3010

CMD ["shell/init.sh"]