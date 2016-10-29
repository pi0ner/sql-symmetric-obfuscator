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
            var data = "SELECT \n field1, field2 FROM view1; ";
            var targetOutputData = "SELECT \n field1, field2 FROM view1; "
            obfuscator.obfuscate(data,function (obfuscatedData) {
                expect(obfuscatedData).to.eql(targetOutputData);
                done();
            });
        } catch (err){
            done(err);
        }

    });

    it("tokensAndDelimites",function (done) {
        try{
            var data = "SELECT \n field1, field2 FROM view1; ";
            var splitedData = ["SELECT"," ","\n"," ","field1",","," ","field2"," ","FROM"," ","view1;"," "]

            obfuscator.tokensAndDelimites(data,function (obfuscatedData) {
                expect(obfuscatedData).to.eql(splitedData);
                done();
            });
        } catch (err){
            done(err);
        }
    });


});
