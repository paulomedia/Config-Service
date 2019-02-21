const express    = require('express'),
      router     = express.Router(),
      service    = require('../services/configService'),
      parametros = require('../modules/params'),
      validation = require('../modules/validation'),
      logger     = require('logger').getLogger('config.configController');

// CALLBACKS
const configController = (req, res) => {

    if (!req) {
        res.status(400).send('Bad Request');
    }

    const params = parametros.getParams(req);

    service.getConfiguration(params, (error, obj) => {

        if ( error ) {
            logger.error(`Error getConfiguration  ${error} `);
            res.status(500).send('Internal Server Error');
        }

        res.format({
            'application/json': () => {
                res.status(200).send(obj);
            },
            'default': () => {
                res.status(406).send('Not Acceptable');
            }
        });
    });
        
};

// ROUTING
router.get('/config/', validation.validateParams, configController);
router.get('/:type/:id/config/', validation.validateParams, configController);

module.exports = router;