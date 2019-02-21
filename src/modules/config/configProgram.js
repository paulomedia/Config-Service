const props  = require('properties')(process.env.NODE_ENV),
      utils  = require('../../lib/utils'),
      logger = require('logger').getLogger('config.configProgram');

/**
* @function getUrl Get the url from program config
* @param {string} url return the url from
*/
const getUrl = resource => {
    return resource.programRef + '.json';
};

/**
 * @function loadData load the data from program api
 * @param {string} url url from program api
 * @param {function} callback return the function callback
*/
const loadData = (url, callback) => {
    utils.apiRequest(url, callback);
};

/**
 * @function setData set the values of program data to metadata an css_config object
 * @param {object} data object contains program data
 * @param {object} obj final object configuration 
*/
const setData = (data, obj) => {
    obj.metadata.program_id = data.id;
    obj.metadata.program_name = data.name;
    obj.metadata.category_path = data.mainTopic;

    if ( data.generos && data.generos.length > 0 ){
        obj.metadata.genre = data.generos;
    }

    if ( data.kantar !== null ){
        obj.metadata.kantar = data.kantar;
    }

    if ( data.ageRangeUid !== null ){
        obj.metadata.ageRangeUid = data.ageRangeUid;
        obj.metadata.ageRangeDesc = props.ageRangeInfo.descriptions[data.ageRangeUid] || '';
        obj.css_config.ageRangeCssClass = props.ageRangeInfo.cssClasses[data.ageRangeUid] || '';
    }
};

module.exports = {

    /**
    * @function isNeeded Check if the resource needs program
    * @param {object} resource object that contains data from API config
    * @param {function} promise return an object function that contains a promise
    */
    isNeeded(resource, obj){
        return new Promise( (resolve, reject) => {

            if ( !utils.needsProgram(resource) ){
                logger.warn(`configProgram no program needed  =>  ${false} `);
                resolve(obj);
                return;
            }

            const progUrl = getUrl(resource);
            logger.debug(`configProgram loadData url  =>  ${progUrl} `);

            loadData(progUrl, (error, data) => {
                if ( error ){
                    logger.error(`configProgram loadData error  =>  ${error} `);
                    resolve(obj);
                    return;
                }
                setData(utils.getParsedObj(data) , obj);
                resolve(obj);
            });
        });
    }

};