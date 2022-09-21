function response(client, msg) {
  const commands = [
    ['^!ping reply$', () => msg.reply('pong')],
    [
      '^!info$',
      () => {
        const { info } = client;
        client.sendMessage(
          msg.from,
          `
            *Connection info*
            User name: ${info.pushname}
            My number: ${info.wid.user}
            Platform: ${info.platform}
        `
        );
        return info;
      },
    ],
    [
      '^!location$',
      () => {
        msg.reply('pong');
        return 'pong';
      },
    ],
    [
      '^!location$',
      () => {
        msg.reply('pong');
        return 'pong';
      },
    ],
  ];
  const result = commands
    .filter(([regex]) => {
      const res = msg.body.match(new RegExp(regex, 'ig'));
      console.log(res);
      return res;
    })
    .map(([, run]) => {
      return run();
    });
  console.log('Results: ', result);
}

const mockClient = {
  info: { pushname: 'Marco', wid: { user: 'ok' }, platform: 'x64' },
  sendMessage(from, msg) {
    return msg;
  },
};
const mockMsg = {
  body: '!info',
  reply(ms) {
    console.log(`Reply ${ms}`);
  },
};

response(mockClient, mockMsg);
