FROM node:18.12.1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y wget git openssl gnupg ca-certificates sudo \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable postgresql postgresql-contrib \
    && wget -q https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh \
    && chmod +x /usr/sbin/wait-for-it.sh \
    && apt-get clean && apt-get autoremove \
    && rm -rf /var/lib/apt/lists/*

RUN /etc/init.d/postgresql start && \
    sudo -u postgres psql -c "CREATE USER admin WITH SUPERUSER PASSWORD 'admin';"

EXPOSE 3010
EXPOSE 5432

VOLUME  ["/etc/postgresql", "/var/log/postgresql", "/var/lib/postgresql"]

CMD ["shell/init.sh"]