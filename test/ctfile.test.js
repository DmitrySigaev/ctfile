/* declaration of modules  */
var assert = require('assert');
var ctfile = require("../ctfile");

describe('Test moduleVersion of ctfile module', function () {
    it('should return Object: {moduleVersion: \'0.0.0\'}', function(){
	assert.deepStrictEqual({moduleVersion: '0.0.0'}, ctfile.getVersion());
    });
});

