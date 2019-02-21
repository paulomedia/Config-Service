const props  = require('properties')(process.env.NODE_ENV),
      utils  = require('../../lib/utils'),
      logger = require('logger').getLogger('config.configForLiveEmission');

/**
* @function isNeed Check if the resource needs data from emision API
* @param {object} config object that contains data from API config
* @param {object} resource object that contains data from API resource
*/
const isNeed = (config, resource) => {
    return utils.isLive(config) && utils.isVideo(resource);
};

/**
* @function getUrl Get the url from emission config
* @param {string} url return the url from
*/
const getUrl = () => {
    return utils.getApiDomain() + props.links.emision;
};

/**
 * @function loadData load the data from emission api
 * @param {string} url url from emission api
 * @param {function} callback return the function callback
*/
const loadData = (url, callback) => {
    utils.apiRequest(url, callback);
};

/**
* @function getInfoByChannel Return the data that belongs to a specific channel
* @param {object} data object that contains data from a specific channel
* @param {string} id resource id identifier
*/
const getInfoByChannel = (data, id) => {
    for( var i = 0; i<data.length; ++i ){
        if ( data[i].canal.idAsset === id ){
            return data[i];
        }
    }
    return;
};

/**
 * @function setEmisionData set the values of emision data to metadata object
 * @param {object} data object contains emision channel data
 * @param {object} obj final object configuration 
*/
const setData = (data, obj) => {
    const dataChannel = getInfoByChannel(data, String(obj.metadata.id));
    
    if ( dataChannel ){
        obj.metadata.sgce = dataChannel.codigoSGCE;
        obj.metadata.eventDescription = dataChannel.eventDescription;

        obj.metadata.title = dataChannel.shortTitle || dataChannel.longTitle;
        obj.metadata.dateOfEmission = dataChannel.startDate;

        obj.metadata.program_id = dataChannel.idPrograma;

        obj.metadata.emission_id = dataChannel.id;

        if ( dataChannel.duracion ){
            obj.metadata.duration = dataChannel.duracion;
        }

        if ( dataChannel.canal ){
            obj.metadata.emission_channel = dataChannel.canal.id;
            obj.metadata.channel = dataChannel.canal.nombre.toLowerCase();
            obj.metadata.id = dataChannel.canal.idAsset;
            obj.metadata.livePage = dataChannel.canal.pagDirecto;
        }
    }
};

module.exports = {

    /**
    * @function isNeeded Check if the resource needs emission
    * @param {object} config object that contains data from API config
    * @param {function} promise return an object function that contains a promise
    */
    isNeeded(config, resource, obj){
        return new Promise( (resolve, reject) => {

            if ( !isNeed(config, resource) ){
                logger.warn(`configForLiveEmission no live emission needed  =>  ${false} `);
                resolve(obj);
                return;
            }

            const liveEmissionUrl = getUrl();
            logger.debug(`configForLiveEmission loadData url  =>  ${liveEmissionUrl} `);

            loadData(liveEmissionUrl, (error, data) => {
                if ( error ){
                    logger.error(`configForLiveEmission loadData error  =>  ${error} `);
                    resolve(obj);
                    return;
                }
                setData(utils.getParsedObj(data) , obj);
                resolve(obj);
            });
        });
    }

};