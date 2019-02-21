const props  = require('properties')(process.env.NODE_ENV),
      utils  = require('../../lib/utils'),
      logger = require('logger').getLogger('config.configAdvertisment');

/**
* @function checkMinDuration Check if the duration of resource permits to reproduce a advertisment video
* @param {object} config object that contains data from API config
*/
const checkMinDuration = config => {
    return config.duration > props.adsMinDuration || utils.isLive(config);
};

/**
* @function isNeed Check if the resource needs advertisment
* @param {object} config object that contains data from API config
* @param {object} resource object that contains data from API resource
* @param {boolean} bool return a flag
*/
const isNeed = (config, resource) => {
    return !config.advRestricted && config.advUrl && utils.isVideo(resource) && checkMinDuration(config);
};

/**
* @function getUrl Get the url from advertisment config
* @param {string} url return the url from
*/
const getUrl = config => {
    return config.advUrl + '.json';
};

/**
 * @function loadData load the data from advertisment config
 * @param {string} url url from advertisment api
 * @param {function} callback return the function callback
*/
const loadData = (url, callback) => {
    utils.apiRequest(url, callback);
};

/**
 * @function setAdvertismentData set the values of advertisment url to links object
 * @param {object} data object contains advertisment data
 * @param {object} obj final object configuration 
*/
const setData = (data, obj) => {
    data.forEach(item => {
        // get the preroll advertisment url
        if ( item.type === props.advTypes.PREROLL ) {
            obj.links.advertismentPrerollUrl = item.url;
        }
        // get the postroll advertisment url
        if ( item.type === props.advTypes.POSTROLL ) {
            obj.links.advertismentPostrollUrl = item.url;
        }
    });
    obj.plugins.advertisment = true;
};

module.exports = {

    /**
    * @function isNeeded Check if the resource needs advertisment
    * @param {object} config object that contains data from API config
    * @param {object} resource object that contains data from API resource
    */
    isNeeded(config, resource, obj){
        return new Promise( (resolve, reject) => {

            if ( !isNeed(config, resource) ){
                logger.warn(`configAdvertisment no Advertisment needed  =>  ${false} `);
                resolve(obj);
                return;
            }

            const advUrl = getUrl(config);
            logger.debug(`configAdvertisment loadData url  =>  ${advUrl} `);
            
            loadData(advUrl, (error, data) => {
                if ( error ){
                    logger.error(`configAdvertisment loadData error  =>  ${error} `);
                    resolve(obj);
                    return;
                }
                setData(JSON.parse(data).page.items , obj);
                resolve(obj);
            });

        });
    }

};