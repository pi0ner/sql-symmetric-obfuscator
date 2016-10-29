var expect = require("chai").expect;
var assert = require("chai").assert;
var obfuscator = require("../index")

describe("Obfuscator tests", function() {
    it("matchUserAndSqlWords",function (done) {
        try{
            var words = ['select','field1','update'];
            obfuscator.setUserWords(words);
            obfuscator.matchUserAndSqlWords(function (matches) {
                expect(matches).to.eql(['select','update']);
                done();
            });
        } catch (err){
            done(err);
        }

    });

    it("obfuscate",function (done) {
        try{
            var data = "select field1 from view1";
            obfuscator.obfuscate(data,function (obfuscatedData) {
                expect(data).to.eql(obfuscatedData);
                done();
            });
        } catch (err){
            done(err);
        }

    });
});
