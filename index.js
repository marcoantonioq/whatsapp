const express = require('express');
const bodyParser = require('body-parser');
const api = require('./src/routes/api');
const services = require('./src/services');
console.log('Inicializado serviços: ', services);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('API'));

app.use('/api', api);
app.listen(3010, function (err) {
  // eslint-disable-next-line no-console
  if (err) console.log('Error in server setup');
  // eslint-disable-next-line no-console
  console.log('API server listening on Port 3010');
});
