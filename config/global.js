const settings = {
  whatsapp: {
    clientId: 'MARCO',
    puppeteer: {
      // executablePath: '/usr/bin/google-chrome-stable',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  },
};

module.exports = settings;
