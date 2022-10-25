const settings = {
  whatsapp: {
    // clientId: 'CAE',
    clientId: 'MARCO',
    puppeteer: {
      executablePath: '/usr/bin/google-chrome-stable',
      headless: false,
      args: [
        '--disable-default-apps',
        '--disable-extensions',
        '--disable-setuid-sandbox',
        '--enable-features=NetworkService',
        '--ignore-certificate-errors',
        '--ignore-certificate-errors-spki-list',
        '--no-default-browser-check',
        '--no-experiments',
        '--no-sandbox',
        // '--disable-3d-apis',
        // '--disable-accelerated-2d-canvas',
        // '--disable-accelerated-jpeg-decoding',
        // '--disable-accelerated-mjpeg-decode',
        // '--disable-accelerated-video-decode',
        // '--disable-app-list-dismiss-on-blur',
        // '--disable-canvas-aa',
        // '--disable-composited-antialiasing',
        // '--disable-gl-extensions',
        // '--disable-gpu',
        // '--disable-histogram-customizer',
        // '--disable-in-process-stack-traces',
        // '--disable-site-isolation-trials',
        // '--disable-threaded-animation',
        // '--disable-threaded-scrolling',
        // '--disable-webgl',
      ],
    },
  },
};

module.exports = settings;
