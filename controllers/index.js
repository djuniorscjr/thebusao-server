'use strict';

const   debug   = require('debug')('thebusao:controller'),
        needle  = require('needle'),
        moment  = require('moment'),
        jwt     = require('jwt-simple'),
        config  = require('config');

class IndexController {

    constructor(){
        this.opts = {
            headers: {
                'X-Api-Key': 'a167fb1cdc6e49d59ffbd1409d87e87c',
                'Accept-Language': 'en',
                'Content-Type': 'application/json',
                'Date': new Date().toGMTString()
            }
        };
        this.host = 'https://api.inthegra.strans.teresina.pi.gov.br';
    }

    getToken(request, response, next){
        const bodyJson = JSON.stringify({"email": "fogaozinhu@hotmail.com", "password": "6sma10"});
        needle.post(this.host + '/v1/signin',
            bodyJson, this.opts, (err, resp) => {
                if (resp != null && resp.statusCode === 200) {
                    let token = this.generateTokenAuth(resp.body.token);
                    response.json({
                        'token': token
                    });
                }else{
                    next(err);
                }
        });
    }

    getSingleOrAllLines(request, response, next){
        this.opts.headers['X-Auth-Token'] = request.user;
        let value = request.params.search;
        if(value){
            this.getLines(value, request, response, next);
        }else{
            this.getAllLines(request, response, next);
        }
    }

    getLines(value, request, response, next) {
        debug(value);
        needle.get(this.host + '/v1/linhas?busca=' + value,
            this.opts, (err, resp) => {
                if (resp != null && resp.statusCode === 200) {
                    response.json({
                        'result': resp.body
                    });
                }else{
                    next(err);
                }
        });
    }

    getAllLines(request, response, next) {
        needle.get(this.host + '/v1/linhas',
            this.opts, (err, resp) => {
                if (resp != null && resp.statusCode === 200) {
                    response.json({
                        'result': resp.body
                    });
                }else{
                    next(err);
                }
        });
    }

    getSingleOrAllVehicles(request, response, next){
        this.opts.headers['X-Auth-Token'] = request.user;
        let value = request.params.code;
        if(value){
            this.getVehicles(value, request, response, next);
        }else{
            this.getAllVehicles(request, response, next);
        }
    }

    getVehicles(value, request, response, next) {
        debug(value);
        needle.get(this.host + '/v1/veiculosLinha?busca=' + value,
            this.opts, (err, resp) => {
                if (resp != null && resp.statusCode === 200) {
                    response.json({
                        'result': resp.body
                    });
                }else{
                    next(err);
                }
        });
    }

    getAllVehicles(request, response, next) {
        needle.get(this.host + '/v1/veiculos',
            this.opts, (err, resp) => {
                if (resp != null && resp.statusCode === 200) {
                    response.json({
                        'result': resp.body
                    });
                }else{
                    next(err);
                }
        });
    }

    generateTokenAuth(data) {
        let expires = moment().add(9, 'seconds').valueOf();
        let token = jwt.encode({
            user: data,
            exp: expires
        }, config.get('tokenSecretc'));
        return token;
    }
}
module.exports = new IndexController();
