const properties         = require('properties')(process.env.NODE_ENV),
      express            = require('express'),
      configController   = require('./routes/configController');

let app = express();

app.use(`/servicios/${properties.service_path}`, configController);

module.exports = app;