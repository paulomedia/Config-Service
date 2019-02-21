/**
 * Modulo JS buildPlayerConfig
 * 
 * @module buildPlayerConfig
 */

const props       = require('properties')(process.env.NODE_ENV),
      utils       = require('../lib/utils'),
      configNeeds = require('../modules/configNeeds');

/**
 * Create the object metadata
 * 
 * @function getMetadata Return a metadata object
 * @param {object} config Data from the config API
 * @param {object} resource Data from the resource API
 */
const getMetadata = (config, resource) => {
    
    const metadata = {};

    metadata.id = config.id;    
    metadata.live = config.live;
    metadata.title = config.title;
    metadata.autoplay = config.autostart;
    metadata.category_name = config.categoryName;
    metadata.category_uid = config.categoryUid;
    metadata.htmlUrl = resource.htmlUrl;
    metadata.htmlShortUrl = resource.htmlShortUrl;
    metadata.language = resource.language;
    metadata.assetType = resource.assetType;
    metadata.fullAssetId = resource.id + '_' + resource.language + '_' + resource.assetType + 's';
    metadata.dateOfEmission = resource.dateOfEmission;
    metadata.publicationDate = resource.publicationDate;
    metadata.episode = resource.episode;
    metadata.consumption = resource.consumption;

    if ( config.embedRestricted !== null ){
        metadata.isEmbed = !config.embedRestricted;
    }

    if ( config.duration ){
        metadata.duration = config.duration;
    }
    
    if ( config.channel ){
        metadata.channel = config.channel;
    }

    if ( resource.pubState ){
        metadata.pubstate_code = resource.pubState.code;
        metadata.pubstate_description = resource.pubState.description;
    }

    if ( resource.sgce !== null ){
        metadata.sgce = resource.sgce;
    }

    if ( resource && resource.type ){
        metadata.type_id = resource.type.id;
        metadata.type_name = resource.type.name;
    }

    return metadata;

};

/**
 * Create the object links
 * 
 * @function getLinks Return a links object
 * @param {object} config Data from the config API
 * @param {object} resource Data from the resource API
 */
const getLinks = (config, resource) => {
    const links = {};
    let mapUrlObj = { '{type}': utils.typePlural(resource.assetType), '{id}': config.id };

    links.lokiUrl = props.links.lokiUrl;
    links.whitelistUrl = props.links.whitelistUrl;

    links.ztnrUrl = utils.replaceAll(props.links.ztnrUrl, mapUrlObj);
    links.SwfUrl = props.links.SwfUrl;

    // get the url from relateds if exist
    if ( configNeeds.needsRelateds(config) ){
        links.relatedUrl = utils.replaceAll(props.links.relatedUrl, mapUrlObj);
    }

    // get the url from thumbnailers if exist
    if ( configNeeds.needsThumbnailers(config, resource) ){
        links.thumbnailerUrl = props.links.thumbnailerUrl;
    }
            
    // get the url from relateds by lang ref if exist
    if ( configNeeds.needsRelatedsByLang(config, resource) ){
        links.relatedByLanguageUrl = utils.replaceAll(props.links.relatedByLanguageUrl, mapUrlObj);
    }

    return links;
};

/**
 * Create the object cssConfig
 * 
 * @function getCssConfig Return a css config object
 * @param {object} resource Data from the resource API
 */
const getCssConfig = resource => {
    return {
        errorLayerClass: props.errorLayerClass,
        cssClass: props.mediaInfoClass,
        hasMediaTextClass: props.hasMediaTextClass,
        cssType: resource.assetType
    };
};

/**
 * Create the object plugins
 * 
 * @function getPlugins Return a plugins object
 * @param {object} resource Data from the resource API
 */
const getPlugins = resource => {
    const d360 = new RegExp(props.d360, 'i');
    return {
        advertisment: false,
        drm: false,
        d360: d360.test(resource.consumption),
    };
};

module.exports = {

    /**
     * Gets the final object
     * 
     * @function createObj Return an object
     * @param {object} config Data from the config API
     * @param {object} resource Data from the resource API
     */
    createObj(config, resource){
        return {
            // create the css-config object and asign the values for each key value
            css_config: getCssConfig(resource),
            
            // create and the metadata from the data API and asign the values for each key value
            metadata: getMetadata(config, resource),
            
            // create and and asign the values for each key value
            links: getLinks(config, resource),

            // crate the object plugin, and asign the values for each key value
            plugins: getPlugins(resource)
        };
    }

};