var supertest = require("supertest"),
    app       = require("../app"),
    async     = require("async"),
    debug     = require("debug")("thebusao:test"),
    should    = require('chai').should();

global.app = app;
global.request = supertest(app);
global.should = should;
global.debug = debug;
global.async = async;
