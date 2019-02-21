const props  = require('properties')(process.env.NODE_ENV),
      utils  = require('../../lib/utils'),
      logger = require('logger').getLogger('config.configForEmissions');

/**
* @function needsEmissions Check if the resource needs data from emissions API
* @param {object} config object that contains data from API config
* @param {object} resource object that contains data from API resource
*/
const isNeed = (config, resource) =>{
    return config.channel && utils.isFragment(resource) && utils.isVideo(resource);
};

/**
 * @function getEmissionsUrl Return a url from father program
 * @param {object} resource object that contains data from API resource
 */
const getEmissionsUrl = channel => {
    // get the idEmission correspond to channel name
    let idEmision = props.idEmissiones[channel];

    const url = utils.getApiDomain() + props.links.emisiones.replace('{idEmision}', idEmision);

    return url;
};

/**
* @function getUrl Get the url from emissions config
* @param {string} url return the url from
*/
const getUrl = channel => {
    return getEmissionsUrl(channel);
};

/**
 * @function loadData load the data from emissions api
 * @param {string} url url from emissions api
 * @param {function} callback return the function callback
*/
const loadData = (url, callback) => {
    utils.apiRequest(url, callback);
};

/**
* @function setData Check if existe dataOfEmission in emissions data
* @param {object} data object that contains data from a emissions API
* @param {object} obj final object configuration 
*/
const setData = (data, obj) => {
    
    // get the program title from the metada object
    const programName = obj.metadata.program_name,

    // get the dateOfEmission from the fragment
    dateOfEmission = obj.metadata.dateOfEmission,

    // just the date of dateOfEmission from the fragment
    justDateOfEmission = dateOfEmission.split(' ')[0],

    // just the hour of dateOfEmission from the fragment ( to parameter )
    hourOfEmissionTo = dateOfEmission.split(' ')[1],

    // get the hour from in format hourOfEmissionTo - 3 ( from parameter )
    hourOfEmissionFrom = utils.getFromParam(hourOfEmissionTo, 3);

    // we search from the same program name and from the same hour of emission 
    // if we don't get the dateOfEmission from the program we stay with the dateOfEmission form fragment
    data.forEach(emision => {

        const initHour = emision.horaInicio;

        // if the programName fecth with nombrePrograma 
        if ( programName === emision.nombrePrograma ){
            // we check if the horaInicio belongs to the interval hourOfEmissionFrom to hourOfEmissionTo 
            // if so we store the dateOfEmission form the resource in metadata data
            if ( hourOfEmissionFrom <= initHour && initHour <= hourOfEmissionTo ){
                // get the date and update the metadata for the player
                obj.metadata.dateOfEmission = justDateOfEmission + ' ' + initHour;

                logger.debug(`configForEmissions get dateOfEmission from emissiones => ${obj.metadata.dateOfEmission} `);
            }
        }

    });
};

module.exports = {

    /**
    * @function isNeeded Check if the resource needs emissions data
    * @param {object} resource object that contains data from API emissions
    * @param {function} promise return an object function that contains a promise
    */
    isNeeded(config, resource, obj){
        return new Promise( (resolve, reject) => {

            if ( !isNeed(config, resource) ){
                logger.warn(`configForEmissions no emissions needed  =>  ${false} `);
                resolve(obj);
                return;
            }

            const emissionsUrl = getUrl(config.channel);
            logger.debug(`configForEmissions loadData url  =>  ${emissionsUrl} `);

            loadData(emissionsUrl, (error, data) => {
                if ( error ){
                    logger.error(`configForEmissions loadData error  =>  ${error} `);
                    resolve(obj);
                    return;
                }
                setData(utils.getParsedObj(data), obj);
                resolve(obj);
            });
        });
    }

};