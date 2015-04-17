/* declaration of modules  */
var assert = require('assert');
var ctfile = require("../ctfile");

describe('Test moduleVersion of ctfile module', function () {
	it('should return Object: {moduleVersion: \'0.0.0\'}', function (){
		assert.deepStrictEqual({ moduleVersion: '0.0.0' }, ctfile.getVersion());
	});
});

describe('Test internal function parseFlag', function () {
	it('should return true', function () {
		assert.equal(true, ctfile.ut_parseFlag(1));
		assert.equal(true, ctfile.ut_parseFlag("  1"));
		assert.equal(true, ctfile.ut_parseFlag(true));
		assert.equal(true, ctfile.ut_parseFlag("true"));
		assert.equal(true, ctfile.ut_parseFlag("  1 "));
		assert.equal(true, ctfile.ut_parseFlag(" true"));
		assert.equal(true, ctfile.ut_parseFlag("true "));
		assert.equal(true, ctfile.ut_parseFlag(" true "));
	});	
	
	it('should return false', function () {
		assert.equal(false, ctfile.ut_parseFlag(false));
		assert.equal(false, ctfile.ut_parseFlag("false"));
		assert.equal(false, ctfile.ut_parseFlag(0));
		assert.equal(false, ctfile.ut_parseFlag(" 0"));
		assert.equal(false, ctfile.ut_parseFlag(" 0 0"));
		assert.equal(false, ctfile.ut_parseFlag(" 1 0"));
		assert.equal(false, ctfile.ut_parseFlag("true 1"));
		assert.equal(false, ctfile.ut_parseFlag("true ;"));
	});
});
