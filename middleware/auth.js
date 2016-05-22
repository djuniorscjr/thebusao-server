'use strict';

const   jwt = require('jwt-simple'),
        config = require('config'),
        debug  = require('debug')('thebusao:auth'),
        moment = require('moment');

const middlewarAuth = (request, response, next) => {
    const token = request.query.token || request.headers['x-access-token'];
    try {
        if(!token){
            let err = new Error('Forbidden');
            err.status = 403;
            throw err;
        }
        const decoded = jwt.decode(token, config.get('tokenSecretc'));
        const isExpired = moment(decoded.exp).isBefore(new Date());

        if(isExpired){
            let err = new Error('Token expirado');
            err.status = 401;
            throw err;
        } else if(decoded.user) {
            request.user = decoded.user;
            next();
        } else {
            let err = new Error('Forbidden');
            err.status = 403;
            throw err;
        }
    } catch(err){
        next(err);
    }
};

module.exports = middlewarAuth;
