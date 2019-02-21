/**
 * Modulo JS validation
 * 
 * @module validation
 */

/**
 * @function isValidMediaType check if the media param are valid ( are from audi or video type )
 * @param {string} type tipo param
 * @return {boolean}
*/
const isValidMediaType = type => {
    return /(audios|videos)/gi.test(type);
};

/**
 * @function isValidId check if the id param are valid ( have 7 digits and are from the type number or string )
 * @param {string} id id param
 * @return {boolean}
*/
const isValidId = id => {
    return /^[0-9]{7}$/.test(id);
};

/**
 * @function isValidLocation check if the location param are valid ( for much cases )
 * @param {string} location location param
 * @return {boolean}
*/
const isValidLocation = location => {
    return /(alacarta_audios|alacarta_videos|audio|cuerpo|embed_audios|embed_videos|mini|mmedia|noticia|podcast|portada|radio|slide|tag|totem|video|xl)/gi.test(location);
};

module.exports = {
    /**
     * @function validateParams check if the params are valid
     * @param {object} req request object send by controller
     * @param {object} res response object send by controller
     * @param {function} next request object send by controller
    */
    validateParams(req, res, next){
        let validId = isValidId(req.query.id || req.params.id);
        let validTipoMedia = isValidMediaType(req.query.type || req.params.type);
        let validLocation = isValidLocation(req.query.location || req.params.location);
        
        return validId && validTipoMedia && validLocation ? next() : res.status(400).send('Bad request');
    }

};