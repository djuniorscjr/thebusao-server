'use strict';

const needle  = require("needle");
const debug   = require("debug")("thebusao:request");

const get = (url, opt, callback) => {
    needle.get(url, opt, callback);
};

const post = (url, body, opt, callback) => {
    needle.post(url, body, opt, callback);
};

module.exports = {
    get: get,
    post: post
};
