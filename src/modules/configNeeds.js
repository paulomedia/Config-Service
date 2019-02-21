/**
 * Modulo JS configNeeds
 * 
 * @module configNeeds
 */

const props = require('properties')(process.env.NODE_ENV),
      utils = require('../lib/utils');

module.exports = {

    /**
    * @function needsRelateds Check if the resource needs relateds url
    * @param {object} config object that contains data from API config
    */
    needsRelateds(config) {
        return !config.relRestricted && config.relRelateds && !utils.isLive(config);
    },

    /**
    * @function needsRelatedsByLang Check if the resource needs relateds by lang url
    * @param {object} config object that contains data from API config
    * @param {object} resource object that contains data from API resource
    */
    needsRelatedsByLang(config, resource) {
        return !utils.isLive(config) && resource.relatedByLangRef && utils.isVideo(resource);
    },

    /**
    * @function needsThumbnailers Check if the resource needs thumbnailers funcionality
    * @param {object} config object that contains data from API config
    * @param {object} resource object that contains data from API resource
    */
    needsThumbnailers(config, resource) {
        return utils.isVideo(resource) && !utils.isLive(config);
    }

};