const   jwt = require('jwt-simple'),
        config = require('config'),
        debug  = require('debug')('thebusao:auth'),
        moment = require('moment');

const middlewarAuth = (request, response, next) => {
    const token = request.query.token || request.headers['x-access-token'];
    if(!token){
        var err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    }

    try {
        const decoded = jwt.decode(token, config.get('tokenSecretc'));
        const isExpired = moment(decoded.exp).isBefore(new Date());
        if(isExpired){
            var err = new Error('Token expirado');
            err.status = 401;
            return next(err);
        } else if(decoded.code == undefined) {
            request.user = decoded.user;
            next();
        } else {
            var err = new Error('Forbidden');
            err.status = 403;
            return next(err);
        }
    } catch(err){
        err = new Error('Forbidden');
        err.status = 403;
        next(err);
    }
};

module.exports = middlewarAuth;
