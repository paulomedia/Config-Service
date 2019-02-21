/**
 * Modulo JS configOptional
 * 
 * @module configOptional
 */

const logger             = require('logger').getLogger('config.configOptional'),
      props              = require('properties')(process.env.NODE_ENV),
      configAdvertisment = require('../modules/config/configAdvertisment'),
      configSubtitles    = require('../modules/config/configSubtitles'),
      configTemporadas   = require('../modules/config/configTemporadas'),
      configProgram      = require('../modules/config/configProgram'),
      configLiveEmission = require('../modules/config/configForLiveEmission'),
      configFragment     = require('../modules/config/configForFragments');
      
module.exports = {

    /**
     * Return the final object that contains all opcional information from
     * subtitles, advertisment, temporadas, program, ahora, fatherProgram and emission.
     * 
     * @function getOpcionalData Return an object that contain all necesary opcional data 
     * @param {object} config object that contains the config data from the API config
     * @param {object} resource object that contains the resource data from the API resource
     * @param {object} obj final object that contains all data collect
     * @param {function} promise return promise
    */
    getOpcionalData(config, resource, obj){
        // get the opcional config for all stuffs
        // create an object to collect the urls and callback function to get the opcional config from
        // subtitles, advertisment, temporadas, program, ahora, fragment.
        const advertisment = configAdvertisment.isNeeded(config, resource, obj);
        const subtitulos = configSubtitles.isNeeded(config, obj);
        const temporadas = configTemporadas.isNeeded(config, resource, obj);
        const programa = configProgram.isNeeded(resource, obj);
        const liveEmission = configLiveEmission.isNeeded(config, resource, obj);
        const frag = configFragment.isNeeded(config, resource, obj);

        return new Promise( (resolve, reject) => {
            Promise.all([advertisment, subtitulos, temporadas, programa, liveEmission, frag]).then(obj => {
                logger.debug(`configOptional data =>  ${obj[obj.length-1]} `);
                resolve(obj[obj.length-1]);
            }).catch(error => {
                logger.error(`configOptional error =>  ${error} `);
                reject(error);
            });
        });
        
    }

};