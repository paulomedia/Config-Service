const props  = require('properties')(process.env.NODE_ENV),
      utils  = require('../../lib/utils'),
      logger = require('logger').getLogger('config.configSubtitles');

/**
* @function isNeed Check if the resource needs subtitles
* @param {object} config object that contains data from API config
*/
const isNeed = config => {
    return !config.sbtRestricted && config.sbtFile && !utils.isLive(config);
};

/**
 * Return a new service url from susbtitles
 * 
 * @function transformSubtitlesUrl Transform the url for new service of subtitles
 * @param {string} srcVtt String that represents the vtt file to transform
 */
const transformSubtitlesUrl = srcVtt => {
    return props.links.subtServiceUrl + srcVtt.split('/')[7].split('.')[0] + '.vtt';
};

/**
* @function getUrl Get the url from subtitles config
* @param {string} url return the url from
*/
const getUrl = config => {
    return config.sbtFile + '.json';
};

/**
 * @function loadData load the data from subtitles config
 * @param {string} url url from subtitles api
 * @param {function} callback return the function callback
*/
const loadData = (url, callback) => {
    utils.apiRequest(url, callback);
};

/**
 * @function setSubtitlesData set the values of subtitles url to links object
 * @param {object} data object contains subtitles data
 * @param {object} obj final object configuration 
*/
const setData = (data, obj) => {
    if ( data ) {
        obj.links.subtitlesUrl = transformSubtitlesUrl(data.src);
    }
};

module.exports = {

    /**
    * @function isNeeded Check if the resource needs subtitles
    * @param {object} config object that contains data from API config
    * @param {function} promise return an object function that contains a promise
    */
    isNeeded(config, obj){
        return new Promise( (resolve, reject) => {

            if ( !isNeed(config) ){
                logger.warn(`configSubtitles no subtitles needed  =>  ${false} `);
                resolve(obj);
                return;
            }

            const subturl = getUrl(config);
            logger.debug(`configSubtitles loadData url  =>  ${subturl} `);

            loadData(subturl, (error, data) => {
                if ( error ){
                    logger.error(`configSubtitles loadData error  =>  ${error} `);
                    resolve(obj);
                    return;
                }
                setData(utils.getParsedObj(data) , obj);
                resolve(obj);
            });
        });
    }

};