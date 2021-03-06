'use strict';

describe("Testing Rest Api Wrapper", function() {
    let config = {};
    config.search = "cristo rei"; //neighborhood teresina pi

    before((done) => {

        function setToken(callback) {
            request
                .get("/api/v1/token")
                .expect(200)
                .end((err, res) => {
                    config.token = res.body.token;
                    callback(err, res.body.token);
                });
        };

        function setCode(token, callback) {
            request
                .get("/api/v1/lines/" + config.search)
                .set("x-access-token", token)
                .expect(200)
                .end((err, res) => {
                   config.code = res.body.result[0].CodigoLinha;
                   callback(err, res);
                });
        };
        async.waterfall([
          setToken,
          setCode
       ], (err, result) => {
          done();
       });
    });

    it("GET /api/v1/token", (done) =>{
        request
            .get("/api/v1/token")
            .expect(200)
            .end((err, res) => {
               res.status.should.equal(200);
               should.exist(res.body.token);
               done();
            });
    });

    it("GET /api/v1/lines/:search", (done) =>{
        request
            .get("/api/v1/lines/" + config.search)
            .set("x-access-token", config.token)
            .expect(200)
            .end((err, res) =>{
               res.status.should.equal(200);
               res.body.result.should.have.length(1);
               done();
            });
    });

    it("GET /api/v1/vehicles/:code", (done) => {
        request
            .get("/api/v1/vehicles/" + config.code)
            .set("x-access-token", config.token)
            .expect(200)
            .end((err, res) => {
               res.status.should.equal(200);
               should.exist(res.body.result);
               done();
            });
    });

    it("GET /api/v1/lines/", (done) => {
        request
            .get("/api/v1/lines/")
            .set("x-access-token", config.token)
            .expect(200)
            .end((err, res) => {
               res.status.should.equal(200);
               res.body.result.length.should.be.above(200);
               done();
            });
    });

    it("GET /api/v1/vehicles/", (done) => {
        request
            .get("/api/v1/vehicles/")
            .set("x-access-token", config.token)
            .expect(200)
            .end((err, res) => {
               res.status.should.equal(200);
               should.exist(res.body.result);
               done();
        });
    });
});
