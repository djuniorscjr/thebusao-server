'use strict';

const needle  = require("needle");
const debug   = require("debug")("thebusao:request");

function get(url, opt, callback) {
    needle.get(url, opt, callback);
};

function post(url, body, opt, callback){
    needle.post(url, body, opt, callback);
};

module.exports = {
    get : get,
    post: post
};
