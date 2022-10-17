// const express = require('express');
// const bodyParser = require('body-parser');
// const api = require('./src/routes/api');
// // eslint-disable-next-line no-unused-vars
const store = require('./src/store');
const servicesWhatsapp = require('./src/services/whatsapp')
servicesWhatsapp(store.state)

// const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// app.get('/', (req, res) => res.send('API'));

// app.use('/api', api);
// app.listen(3010, function (err) {
//   // eslint-disable-next-line no-console
//   if (err) console.log('Error in server setup');
//   // eslint-disable-next-line no-console
//   console.log('API server listening on Port 3010');
// });
