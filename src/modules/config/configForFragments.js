const props              = require('properties')(process.env.NODE_ENV),
      utils              = require('../../lib/utils'),
      logger             = require('logger').getLogger('config.configForFragments'),
      configForEmissions = require('./configForEmissions');

/**
* @function isNeed Check if the resource type name it's a prgram "NO Completo" and if needs program
* @param {object} resource object that contains data from API resource
*/
const isNeed = resource => {
    return !utils.isCompleto(resource) && utils.needsProgram(resource);
};

/**
 * Returns an object with values ​​to use in the program request
 * 
 * @function getObjParams Return an object with from and to values to 
 * @param {string} dateOfEmission String that represents the date of emission of a content
 * @param {number} hora Number to subtract the hour in from param
 */
const getObjParams = (dateOfEmission, hourTosubtract) => {
    const reg = /[\s-:]/gi;
    // array with 2 elements date and hour ( dd:mm:yyyy hh:mm:ss )
    dateOfEmission = dateOfEmission.split(' ');
    // dd:mm:yyyy --> ddmmyyyy
    const fechaConc = dateOfEmission[0].replace(reg, '');
    // hh:mm:ss --> hhmmss
    const horaConc = dateOfEmission[1].replace(reg, '');

    return {
        to: fechaConc + horaConc,
        from: fechaConc + utils.getFromParam(horaConc, hourTosubtract)
    };
};

/**
 * @function getUrlProgram Return a url from program of fragment
 * @param {object} resource object that contains data from API resource
 */
const getProgramUrl = resource => {
    // number of hours to subtract
    let hour = 3;
    // get the object with from and to parameters
    const obj = getObjParams(resource.dateOfEmission, hour);
    // return the url to get the dateOfEmision from program of fragment
    const url = resource.programRef + '/' + utils.typePlural(resource.assetType) + '.json?type=' + props.codCompletos + '&from=' + obj.from +  '&to=' + obj.to;

    return url;
};

/**
* @function getUrl Get the url from fragment config
* @param {string} url return the url from
*/
const getUrl = resource => {
    return getProgramUrl(resource);
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
 * @function setData set the values of dataOfEmission of metadata object
 * @param {object} program object contains fragment program father data
 * @param {object} obj final object configuration 
*/
const setData = (program, config, resource, obj) => {
    
    // we can get an array of objects or a object
    const tempdateOfEmission = program.dateOfEmission || program[0].dateOfEmission;

    if ( tempdateOfEmission ){
        obj.metadata.dateOfEmission = tempdateOfEmission;
        logger.debug(`configForFragments get dateOfEmission from fragment program => ${obj.metadata.dateOfEmission} `);

    } else {
        // if we don't have dateOfEmission from father program we search in emissiones API
        // check if we needs to get data from fragment config
        configForEmissions.isNeeded(config, resource, obj).then(data => {
            logger.debug(`configForFragments data have been set =>  ${data} `);
        }).catch(error => {
            logger.error(`configForFragments error ser data  =>  ${error} `);
        });

    }
};


module.exports = {

    /**
    * @function isNeeded Check if the resource needs fragment data
    * @param {object} resource object that contains data from API config
    * @param {function} promise return an object function that contains a promise
    */
    isNeeded(config, resource, obj){
        return new Promise( (resolve, reject) => {

            if ( !isNeed(resource) ){
                logger.warn(`configForFragments no fragments needed  =>  ${false} `);
                resolve(obj);
                return;
            }

            const fragUrl = getUrl(resource);
            logger.debug(`configForFragments loadData url     =>  ${fragUrl} `);

            loadData(fragUrl, (error, data) => {
                if ( error ){
                    logger.error(`configForFragments loadData error  =>  ${error} `);
                    resolve(obj);
                    return;
                }
                setData(utils.getParsedObj(data), config, resource, obj);
                resolve(obj);
            });
        });
    }

};