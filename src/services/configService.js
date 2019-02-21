const props           = require('properties')(process.env.NODE_ENV),
      logger          = require('logger').getLogger('config.configService'),
      async           = require('async'),
      utils           = require('../lib/utils'),
      configOptional  = require('../modules/configOptional'),
      configPlayer    = require('../modules/buildPlayerConfig');

/**
* @function getObject Return the final object to config controller
* @param {function} callback callback, return function.
* @param {object} data object that contains the data.config and the data.resource from API
*/
const setObject = (data, callback) => {
    // data from API config
    const configData = utils.getParsedObj(data.config);

    // data from API resource
    const resourceData = utils.getParsedObj(data.resource);

    // crete the final object
    const objParams = configPlayer.createObj(configData, resourceData); 

    // Make the optional requests based on the logic made by asyncConfig
    configOptional.getOpcionalData(configData, resourceData, objParams).then(data => {
        callback(null, data);
    }).catch(error =>{
        callback(error, null);
    });
};

module.exports = {
    /**
    * @function getAPIData get the info from API Config and API Resource ( Mandatory requests )
    * @param {object} params Params in { id, type, location}
    * @param {function} callback Callback, return function.
    */
    getConfiguration(params, callback){
        
        // construct the configUrl
        const configUrl = utils.getApiUrl(params, 'configUrl');
        
        // construct the resourceUrl
        const resourceUrl = utils.getApiUrl(params, 'resourceUrl');
    
        // make parallel request and return the final object to the controller
        async.parallel({
            config: callback => utils.apiRequest(configUrl, callback),
            resource: callback => utils.apiRequest(resourceUrl, callback)
        }, (error, apiInfo) => {

            if(error){
                logger.error(`Error getConfiguration  ${error} `);
                return callback(error, null);
            }

            setObject(apiInfo, (error, obj) => {
                return callback(error, obj);
            });
        });

    }
};