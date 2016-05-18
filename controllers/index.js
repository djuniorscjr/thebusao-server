const   debug   = require('debug')('thebusao:controller'),
        needle  = require('needle'),
        moment  = require('moment'),
        jwt     = require('jwt-simple'),
        config  = require('config');

const generateTokenAuth = (data) => {
    const expires = moment().add(10, 'minutes').valueOf();
    const token = jwt.encode({
        user: data,
        exp: expires
    }, config.get('tokenSecretc'));
    return token;
};

var options = {
    headers: {
        'X-Api-Key': 'a167fb1cdc6e49d59ffbd1409d87e87c',
        'Accept-Language': 'en',
        'Content-Type': 'application/json',
        'Date': new Date().toGMTString()
    }
};

const host = 'https://api.inthegra.strans.teresina.pi.gov.br';

function IndexController() {
}

IndexController.prototype.getToken = (request, response, next) => {
    const bodyJson = JSON.stringify({"email": "fogaozinhu@hotmail.com", "password": "6sma10"});
    needle.post(host + '/v1/signin',
        bodyJson, options, (err, resp) => {
            if (resp.statusCode === 200) {
                const token = generateTokenAuth(resp.body.token);
                response.json({
                    'token': token
                });
            }else{
                next(err);
            }
    });
};

IndexController.prototype.getVeiculos = (request, response, next) => {
    const value = request.body.search;
    if(value){
        var err = new Error("Search not be empty.");
        err.status = 401;
        next(err);
    }else{
        options.headers['X-Auth-Token'] = request.user;
        needle.get(host + '/v1/linhas?busca=' + value,
            options, (err, resp) => {
                if (resp.statusCode === 200) {
                    response.json({
                        'result': resp.body
                    });
                }
                next(err);
        });
    }
};
IndexController.prototype.getAllVeiculos = (request, response, next) => {
    options.headers['X-Auth-Token'] = request.user;
    needle.get(host + '/v1/veiculos',
        options, (err, resp) => {
            if (resp.statusCode === 200) {
                response.json({
                    'result': resp.body
                });
            }
            next(err);
    });
};

IndexController.prototype.getLinha = (request, response, next) => {
    const value = request.body.code;
    if(value){
        var err = new Error("Code not be empty.");
        err.status = 401;
        next(err);
    }else{
        options.headers['X-Auth-Token'] = request.user;
        needle.get(host + '/v1/veiculosLinha?busca=' + value,
            options, (err, resp) => {
                if (resp.statusCode === 200) {
                    response.json({
                        'result': resp.body
                    });
                }
                next(err);
        });
    }
};

module.exports = new IndexController();
