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

describe('Test internal function molfileHeaderTemplate', function () {
	it('should return true', function () {
		assert.equal(true, ctfile.ut_getMolHeaderPattern().hasOwnProperty('description'));
	});
});

describe('Test internal function poundoutMask', function () {
	it('should compare with patterns', function () {
		assert.equal('AAAAAA', ctfile.ut_poundoutMask('AAAAAA'));
		assert.equal('AAAAAA', ctfile.ut_poundoutMask('A1A2A3'));
		assert.equal('ABBCCC', ctfile.ut_poundoutMask('A1B2C3'));
		assert.equal('(ma)2 hello~2world! 2aaa', ctfile.ut_poundoutMask('(ma)2 hel2o~2world! 2a3'));
		assert.equal('\n2', ctfile.ut_poundoutMask('\n2'));
		assert.equal('\ra{aa', ctfile.ut_poundoutMask('\ra{a2'));
	});
});

describe('Test internal function poundoutMaskExt', function () {
	it('should compare with patterns', function () {
		assert.equal('AAAAAA', ctfile.ut_poundoutMaskExt('AAAAAA'));
		assert.equal('AAAAAA', ctfile.ut_poundoutMaskExt('A1A2A3'));
		assert.equal('ABBCCC', ctfile.ut_poundoutMaskExt('A1B2C3'));
		assert.equal('(ma)2 hello~2world! 2aaa', ctfile.ut_poundoutMaskExt('(ma)2 hel2o~2world! 2a3'));
		assert.equal('\n2', ctfile.ut_poundoutMaskExt('\n2'));
		assert.equal('\ra{aa', ctfile.ut_poundoutMaskExt('\ra{a2'));
	});
});


describe('Test internal function parseLineByTemplate', function () {
	it('should compare with patterns', function () {
		assert.deepStrictEqual({ name: 'Test 1' }, ctfile.ut_parseLineByTemplate('Test 1', ctfile.ut_getMolHeaderPattern().line1));
		assert.equal('GT', ctfile.ut_parseLineByTemplate('GTMACCS-II11299515322D 1   0.00377     0.00000     0    GST', ctfile.ut_getMolHeaderPattern().line2, ' ').userInitials);
		assert.equal('MACCS-II', ctfile.ut_parseLineByTemplate('GTMACCS-II11299515322D 1   0.00377     0.00000     0    GST', ctfile.ut_getMolHeaderPattern().line2, ' ').programName);
		
		assert.deepStrictEqual({ userInitials: 'GT', programName: 'MACCS-II', month: 11, day: 29, year: 95, hour: 15, minute: 32, dimension: '2D', scalingFactorsMajor: '1', scalingFactorsMinor: '0.00377', energy: '0.00000', internalRegistryNumber: '0' }, ctfile.ut_parseLineByTemplate('GTMACCS-II11299515322D 1   0.00377     0.00000     0    GST', ctfile.ut_getMolHeaderPattern().line2, ' '));
	});
});

describe('Test internal function cleanWSChs', function () {
	it('should compare with patterns', function () {
		assert.equal('ACETYLCHOLINE & stuff', ctfile.ut_cleanWSChs('ACETYLCHOLINE & stuff', ' '));
		assert.equal('ACETYLCHOLINE;&;stuff', ctfile.ut_cleanWSChs('ACETYLCHOLINE & stuff'));
		assert.equal('\nACETYLCHOLINE;&;stuff', ctfile.ut_cleanWSChs('\n   \n\n   \nACETYLCHOLINE & stuff'));
		assert.equal('\nACETYLCHOLINE & stuff', ctfile.ut_cleanWSChs('\n   \n\n   \nACETYLCHOLINE & stuff', ' '));
		assert.equal('\nACETYLCHOLINE;&;stuff;', ctfile.ut_cleanWSChs('\n   \n\n   \nACETYLCHOLINE & stuff\n', ';'));
		assert.equal('\nACETYLCHOLINE;&;stuff\n', ctfile.ut_cleanWSChs('\n   \n\n   \nACETYLCHOLINE & stuff\n ', ';'));
		assert.equal('\nACETYLCHOLINE;&;stuff;', ctfile.ut_cleanWSChs('\n   \n\n   \nACETYLCHOLINE & stuff\n\n', ';'));
		assert.equal('\nACETYLCHOLINE;&;stuff\n', ctfile.ut_cleanWSChs('\n   \n\n   \nACETYLCHOLINE & stuff\n   \n   \n', ';'));
		assert.equal(';ACETYLCHOLINE;&;stuff\n', ctfile.ut_cleanWSChs('\nACETYLCHOLINE & stuff\n   \n   \n', ';'));
		assert.equal(';ACETYLCHOLINE;&;stuff\n', ctfile.ut_cleanWSChs('\n\nACETYLCHOLINE & stuff\n   \n   \n', ';'));
		assert.equal(';ACETYLCHOLINE;&;stuff\n', ctfile.ut_cleanWSChs('\n\n\nACETYLCHOLINE & stuff\n   \n   \n', ';'));
		assert.equal(';ACETYLCHOLINE;&;stuff\n', ctfile.ut_cleanWSChs('\n\n\nACETYLCHOLINE & stuff\n\n   \n   \n', ';'));
		assert.equal(' ACETYLCHOLINE & stuff ', ctfile.ut_cleanWSChs('\n\n\nACETYLCHOLINE & stuff\n\n\n', ' '));
	});
});

describe('Test internal function cleanWSChs2', function () {
	it('should compare with patterns', function () {
		assert.equal('ACETYLCHOLINE & stuff', ctfile.ut_cleanWSChs2('ACETYLCHOLINE & stuff', ' '));
		assert.equal('ACETYLCHOLINE;&;stuff', ctfile.ut_cleanWSChs2('ACETYLCHOLINE & stuff'));
		assert.equal('@ACETYLCHOLINE;&;stuff', ctfile.ut_cleanWSChs2('\n   \n\n   \nACETYLCHOLINE & stuff'));
		assert.equal('@ACETYLCHOLINE & stuff', ctfile.ut_cleanWSChs2('\n   \n\n   \nACETYLCHOLINE & stuff', ' '));
		assert.equal('@ACETYLCHOLINE;&;stuff@', ctfile.ut_cleanWSChs2('\n   \n\n   \nACETYLCHOLINE & stuff\n', ';'));
		assert.equal('@ACETYLCHOLINE;&;stuff@', ctfile.ut_cleanWSChs2('\n   \n\n   \nACETYLCHOLINE & stuff\n ', ';'));
		assert.equal('@ACETYLCHOLINE;&;stuff@', ctfile.ut_cleanWSChs2('\n   \n\n   \nACETYLCHOLINE & stuff\n\n', ';'));
		assert.equal('@ACETYLCHOLINE;&;stuff@', ctfile.ut_cleanWSChs2('\n   \n\n   \nACETYLCHOLINE & stuff\n   \n   \n', ';'));
		assert.equal('@ACETYLCHOLINE;&;stuff@', ctfile.ut_cleanWSChs2('\nACETYLCHOLINE & stuff\n   \n   \n', ';'));
		assert.equal('@ACETYLCHOLINE;&;stuff@', ctfile.ut_cleanWSChs2('\n\nACETYLCHOLINE & stuff\n   \n   \n', ';'));
		assert.equal('@ACETYLCHOLINE;&;stuff@', ctfile.ut_cleanWSChs2('\n\n\nACETYLCHOLINE  & stuff\n   \n   \n', ';'));
		assert.equal('@ACETYLCHOLINE;&;stuff@', ctfile.ut_cleanWSChs2('\n\n\nACETYLCHOLINE &  \rstuff\n\n   \n   \n', ';'));
		assert.equal('@ACETYLCHOLINE & stuff@', ctfile.ut_cleanWSChs2('\n\n\nACETYLCHOLINE & stuff\n\n\n', ' '));
		assert.equal('@ACETYLCHOLINE;&;stuff@', ctfile.ut_cleanWSChs2('\n\n\r\nACETYLCHOLINE & stuff\n\r\n\n', ';'));
		assert.equal('@ACETYLCHOLINE;&;stuff@GTMACCS-II11299515322D;1;0.00377;0.00000;0;GST', ctfile.ut_cleanWSChs2('\n\n\nACETYLCHOLINE & stuff\n\n\nGTMACCS-II11299515322D 1   0.00377     0.00000     0    GST', ';'));
		assert.equal('@ACETYLCHOLINE;&;stuff@GTMACCS-II11299515322D;1;0.00377;0.00000;0;GST', ctfile.ut_cleanWSChs2('\n\n\nACETYLCHOLINE & stuff\n\n\r\nGTMACCS-II11299515322D 1   0.00377     0.00000     0    GST', ';'));

	});
});


describe('Test internal function cleanInvChars', function () {
	it('should compare with patterns', function () {
		assert.equal('\nACETYLCHOLINE & stuff\n   \n   \n', ctfile.ut_cleanInvChars('\n\r\f\v\tACETYLCHOLINE & stuff\n  \r\f\v \t\n \u00a0\u00a0  \n', ';'));
	});
});

