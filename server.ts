import nodemon from 'nodemon';

nodemon({ script: 'srv/index.ts' })
  .on('start', function () {
    console.log('Iniciado o nodemon!');
  })
  .on('crash', function () {
    console.log('Crashed nodemon!');
    nodemon.emit('restart');
  });

// force a restart
// nodemon.emit('restart');

// force a quit
// nodemon.emit('quit');
