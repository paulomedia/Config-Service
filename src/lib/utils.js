/**
 * [Utils]
 * Commons Utils function from module 'Module-Config'.
 * 
 * @module utils.js
 */

const logger  = require('logger').getLogger('config.utils'),
      props   = require('properties')(process.env.NODE_ENV),
      request = require('request');

/**
 * Return an hour in format HH
 * 
 * @function getHHFormat Return an hour with format HH
 * @param {string} hour String that represents an hour
 */
const getHHFormat = hour => {
    // if we have a negative hour we subtract this hour to 24h
    if (hour < '00'){
        return String(24 - parseInt(Math.abs(hour)));
    }
    // if we have a hour less than ten we concatenate the '0' to the number
    if (hour < 10){
        return '0' + hour;
    }
    return hour;
};

module.exports = {

    /**
    * @function apiRequest Make a request for a specific API url and return here response
    * @param {string} url url form API request
    * @param {function} callback callback, return function.
    */
    apiRequest(url, callback){
        request(url, (error, response, body) => {
            logger.debug(`Request url=> ${url} `);
            logger.debug(`Response statusCode=> ${response && response.statusCode} `);
            return callback(error, body);
        });
    },

    /**
    * @function typePlural Return the plural of media type ( audios o videos )
    * @param {string} type string that means a type of media ( audio o video )
    */
    typePlural(type){
        return type + 's';
    },

    /**
    * @function replaceAll Return a url that are matched with specific
    * @param {string} url string that are decalerd in properties with
    * @param {object} obj object that contains caracters we gona map to the matched patron url
    */
    replaceAll(url, obj){
        const re = new RegExp(Object.keys(obj).join('|'),'gi');

        return url.replace(re, match => {
            return obj[match.toLowerCase()];
        });
    },

    /**
    * @function getParsedObj Return an simplificy object extracted from API patron
    * @param {object} data object from API patron page.items
    */
    getParsedObj(data) {
        const dataObj = JSON.parse(data).page.items;
        return dataObj.length > 1 ? dataObj : dataObj[0];
    },

    /**
     * Return a string that represents a date in especific format
     * 
     * @function getFromParam Return an hour with string type
     * @param {string} horaConc String that represents an hour
     * @param {number} num Number to subtract the hour in from param
     */
    getFromParam(horaConc, num){
        // guardamos hora a transformar
        const oldHour = horaConc.substring(0, 2);
        // hacemos operación sobre la hora y la guardamos con el correcto formato de hora
        const newHour = getHHFormat(String(parseInt(oldHour) - num));
        // sustituimos la nueva hora y guardamos la nueva cadena
        const result = horaConc.replace(oldHour, newHour);

        return result;
    },

    /**
    * @function getApiDomain get the api domain from properties
    * @param {string} apiUrl  return the domina from api
    */  
    getApiDomain(){
        return props.apiUrl;
    },

    /**
    * @function getApiUrl Return an api url
    * @param {object} params object that contain the params in
    */  
    getApiUrl(params, apiUrl) {
        const apiDomain = this.getApiDomain();
        const path = this.replaceAll(props.links[apiUrl], params).replace(/[\s{}]/gi,'');
        return apiDomain + path;
    },

    /**
    * @function isVideo Check if the resource are video
    * @param {object} resource object that contains data from API resource
    */
    isVideo(resource){
        return resource.assetType === props.mediaTypes.VIDEO;
    },

    /**
    * @function isLive Check if the resource is live
    * @param {object} config object that contains data from API config
    */
    isLive(config){
        return config.live;
    },

    /**
    * @function needsProgram Check if the resource needs data from API program
    * @param {object} resource object that contains data from API resource
    */
    needsProgram(resource) {
        return resource.programRef && resource.programRef !== '';
    },

    /**
    * @function isCompleto Check if the resource is Complete
    * @param {object} resource object that contains data from API resource
    */
    isCompleto(resource){
        return resource.type && resource.type.name === props.type.COMPLETO;
    },

    /**
    * @function isFragment Check if the resource type name it's a prgram "NO Completo" and if needs program
    * @param {object} resource object that contains data from API resource
    */
    isFragment(resource) {
        return this.isCompleto(resource) && this.needsProgram(resource);
    }

};