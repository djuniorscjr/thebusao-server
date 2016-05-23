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
                'X-Api-Key': config.get('api-key'),
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

    getLines(request, response, next) {
        this.opts.headers['X-Auth-Token'] = request.user;
        let value = request.params.search;
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
        this.opts.headers['X-Auth-Token'] = request.user;
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

    getVehicles(request, response, next) {
        this.opts.headers['X-Auth-Token'] = request.user;
        let value = request.params.code;
        needle.get(this.host + '/v1/veiculosLinha?busca=' + value,
            this.opts, (err, resp) => {
                if (resp != null && [200, 404].indexOf(resp.statusCode) != -1) {
                    let result = resp.statusCode == 200 ? resp.body : [];
                    if(result != []){
                        result = this.separateResultArray(result);
                    }
                    response.status(200).json({
                        'result': result
                    });
                }else{
                    next(err);
                }
        });
    }

    getAllVehicles(request, response, next) {
        this.opts.headers['X-Auth-Token'] = request.user;
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
        let expires = moment().add(9, 'minutes').valueOf();
        let token = jwt.encode({
            user: data,
            exp: expires
        }, config.get('tokenSecretc'));
        return token;
    }

    separateResultArray(res){
        let result = res.Linha;
        let arrV = result.Veiculos;
        return arrV.map(function(a){
           a.CodigoLinha = result.CodigoLinha;
           a.Denomicao = result.Denomicao;
           return a;
        });
    }
}
module.exports = new IndexController();
