/**
 * Modulo JS params
 * 
 * @module params
 */

module.exports = {
    /**
     * @function getParams Return an object with the params collected in params or query
     * @param {object} req request object send by controller
     * @param {object} params return the params object
    */
    getParams(req){
        return { 
            id: req.query.id || req.params.id,
            type: req.query.type || req.params.type,    
            location: req.query.location || req.params.location 
        };
    }

};