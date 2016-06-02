'use strict';

const   debug   = require('debug')('thebusao:controller'),
        moment  = require('moment'),
        jwt     = require('jwt-simple'),
        config  = require('config');

const  Promise = require("bluebird");
const  req = Promise.promisifyAll(require("../utils/request"));

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
        req.postAsync(this.host + "/v1/signin", bodyJson, this.opts)
            .then((res, error) => {
                if(res && res.statusCode === 200) {
                    let token = this.generateTokenAuth(res.body.token);
                    response.json({
                        token: token
                    });
                }
            })
        .catch(next);
    }

    getLines(request, response, next) {
        this.opts.headers['X-Auth-Token'] = request.user;
        let value = request.params.search;
        req.getAsync(this.host + "/v1/linhas?busca=" + value, this.opts)
            .then((res, error) => {
                if(res && res.statusCode === 200){
                    response.json({'result': res.body});
                }
            })
        .catch(next);
    }

    getAllLines(request, response, next) {
        this.opts.headers['X-Auth-Token'] = request.user;
        req.getAsync(this.host + "/v1/linhas", this.opts)
            .then((res, error) => {
                if(res && res.statusCode === 200){
                    response.json({'result': res.body});
                }
            })
        .catch(next);
    }

    getVehicles(request, response, next) {
        this.opts.headers['X-Auth-Token'] = request.user;
        let value = request.params.code;
        req.getAsync(this.host + "/v1/veiculosLinha?busca=" + value, this.opts)
            .then((res, error) => {
                if (res && [200, 404].indexOf(res.statusCode) != -1) {
                    let result = res.statusCode == 200 ? this.separateResultArray(res.body) : [];
                    response.status(200).json({
                        'result': result
                    });
                }
            })
        .catch(next);
    }

    getAllVehicles(request, response, next) {
        this.opts.headers['X-Auth-Token'] = request.user;
        req.getAsync(this.host + "/v1/veiculos", this.opts)
            .then((res, error) => {
                if(res && res.statusCode === 200){
                    response.json({'result': res.body});
                }
            })
        .catch(next);
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
