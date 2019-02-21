const logger             = require('logger').getLogger('config.testing'),
      properties         = require('properties')(process.env.NODE_ENV),
      common             = require('common')('player-config'),
      content_middleware = require('content-negotiator').middleware,
      express            = require('express'),
      path               = require('path');

// Configuración para simular entorno de producción  (grunt pro)
var isDevMode = process.argv.slice(2)[0] === 'nobuild',
    baseFolder = isDevMode ? '.' : '../dist';

// Configuraciones iniciales
const app = express();
const playerConfig = require(path.join(__dirname, baseFolder, 'app.js'));

const serve = () => {
  logger.info(`Server testing listening http://localhost:${server.address().port}/servicios/${properties.service_path}`);
};

// MIDDLEWARE Y ROUTING
app
  .use(playerConfig)
  .use(content_middleware.expressNegocaitor)  // formatea respuestas según lo que se envía
  .use(common.middlewares.errorStatus, common.middlewares.errorRequest);   

// Lanza el servidor de testing
const server = app.listen(properties.nodePort, serve);        

module.exports = app;