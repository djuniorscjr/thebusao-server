const app =  require("../app");

global.request = require("supertest")(app),
global.async   = require("async"),
global.Promise = require("bluebird"),
global.debug   = require("debug")("thebusao:test"),
global.should  = require('chai').should();
