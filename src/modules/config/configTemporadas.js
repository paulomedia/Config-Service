const props  = require('properties')(process.env.NODE_ENV),
      utils  = require('../../lib/utils'),
      logger = require('logger').getLogger('config.configTemporadas');

/**
* @function needsTemporadas Check if the resource needs data from API temporadas
* @param {object} resource object that contains data from API resource
*/
const isNeed = (config, resource) => {
    return resource.temporadasRef && resource.temporadasRef !== '' && utils.isVideo(resource) && !utils.isLive(config);
};

/**
* @function getUrl Get the url from temporadas config
* @param {string} url return the url from
*/
const getUrl = resource => {
    return resource.temporadasRef + '.json';
};

/**
 * @function loadData load the data from temporadas api
 * @param {string} url url from temporadas api
 * @param {function} callback return the function callback
*/
const loadData = (url, callback) => {
    utils.apiRequest(url, callback);
};

/**
 * @function setData set the values of temporadas data to metadata object
 * @param {object} data object contains temporadas data
 * @param {object} obj final object configuration 
*/
const setData = (data, obj) => {
    if ( data && data.length > 0 ){
        obj.metadata.temporadas = data;
    }   
};

module.exports = {

    /**
    * @function isNeeded Check if the resource needs subtitles
    * @param {object} config object that contains data from API config
    * @param {function} promise return an object function that contains a promise
    */
    isNeeded(config, resource, obj){
        return new Promise( (resolve, reject) => {
            
            if ( !isNeed(config, resource) ){
                logger.warn(`configTemporadas no subtitles needed  =>  ${false} `);
                resolve(obj);
                return;
            }

            const tempUrl = getUrl(resource);
            logger.debug(`configTemporadas loadData url     =>  ${tempUrl} `);

            loadData(tempUrl, (error, data) => {
                if ( error ){
                    logger.error(`configTemporadas loadData error  =>  ${error} `);
                    resolve(obj);
                    return;
                }
                setData(JSON.parse(data).page.items , obj);
                resolve(obj);
            });
        });
    }

};