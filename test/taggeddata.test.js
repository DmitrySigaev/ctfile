/* declaration of modules  */
var assert = require('assert');
var TaggedData = require("../taggeddata");
var testdata = require("../ctfile");

describe('Test TaggedData', function () {
	it('should return TaggedData object', function () {
		var td = new TaggedData("\n ");
		
		assert.equal('\u263B\u263A', (new TaggedData("\n ")).data);
		assert.deepStrictEqual({ 0: '\u263B', 1: '\n' }, new TaggedData("\n ").splitter);
		assert.deepStrictEqual({ 0: '\u263A', 1: ' ' }, new TaggedData("\n ").separator);
		assert.deepStrictEqual('\n ', new TaggedData("\n\r\v\t ").toString());
		assert.equal('\n ', td.toString());
	});
});


describe('Test checkMaskedDataCorruption', function () {
	it('should compare with patterns', function () {
		assert.deepStrictEqual({ check: false, err: '@param template should be checked' }, new TaggedData(' ').checkMaskedDataCorruption());
		assert.deepStrictEqual({ check: false, err: '@param template should be checked' }, new TaggedData(' ').checkMaskedDataCorruption({}));
		assert.deepStrictEqual({ check: false, err: '@param template should be checked' }, new TaggedData(' ').checkMaskedDataCorruption({ check: ' ' }));
		assert.deepStrictEqual({ check: false, err: '@param template should be checked' }, new TaggedData(' ').checkMaskedDataCorruption({ mask: ' ' }));
		assert.deepStrictEqual({ check: false, err: '@param template should be checked' }, new TaggedData(' ').checkMaskedDataCorruption({ mask: '', check: '' }));
/*corrupted: true due to s!=m*/ 
		assert.deepStrictEqual({ check: false, s: 0, m: 1 }, new TaggedData(' ').checkMaskedDataCorruption({ check: ' ', mask: ' ' }));
		assert.deepStrictEqual({ check: true, m: 1 }, new TaggedData('\n ').checkMaskedDataCorruption({ check: ' ', mask: ' ' }));
		assert.deepStrictEqual({ check: false, s: 1, m: 2 }, new TaggedData(' \n ').checkMaskedDataCorruption({ check: ' ', mask: ' ' }));
		assert.deepStrictEqual({ check: true, m: 2 }, new TaggedData('\n \n ').checkMaskedDataCorruption({ check: ' ', mask: ' ' }));
		assert.deepStrictEqual({ check: true, m: 1 }, new TaggedData(' ').checkMaskedDataCorruption({ check: ' ', mask: ' ' }, true));
/* be careful*/
		assert.deepStrictEqual({ check: false, s: 0, m: 1 }, new TaggedData(' ', '').checkMaskedDataCorruption({ check: ' ', mask: ' ' }));
		assert.deepStrictEqual({ check: true, m: 1 }, new TaggedData(' \n').checkMaskedDataCorruption({ check: ' ', mask: ' ' }, true));
		assert.deepStrictEqual({ check: true, m: 1 }, new TaggedData('@ ', '@').checkMaskedDataCorruption({ check: ' ', mask: ' ' }));
		assert.deepStrictEqual({ check: true, m: 2 }, new TaggedData('@ @ ', '@').checkMaskedDataCorruption({ check: ' ', mask: ' ' }));
		assert.deepStrictEqual({ check: false, s: 2, m: 3 }, new TaggedData(' @ @ ', '@').checkMaskedDataCorruption({ check: ' ', mask: ' ' }));
		assert.deepStrictEqual({ check: true, m: 3 }, new TaggedData('@1 @2 @5 ', '@').checkMaskedDataCorruption({ check: ' ', mask: 'AB' }));
		assert.deepStrictEqual({ check: false, s: 1, m: 3 }, new TaggedData('@1 @2 @5 ', '@2').checkMaskedDataCorruption({ check: ' ', mask: 'B' }));
		assert.deepStrictEqual({ check: false, s: 0, m: 4 }, new TaggedData('@1 1@2 1@5 1', '@2').checkMaskedDataCorruption({ check: '1', mask: 'B' }));
		assert.deepStrictEqual({ check: false, s: 1, m: 3 }, new TaggedData('@6 1@2 1@5 1', '@2').checkMaskedDataCorruption({ check: '1', mask: 'AB' }));
		assert.deepStrictEqual({ check: true, m: 1 }, new TaggedData('@6 1@2 3@5 1', '@2').checkMaskedDataCorruption({ check: '3', mask: 'AB' }));
		assert.deepStrictEqual({ check: true, m: 3 }, new TaggedData('@ 4 1@ 2 1@ 5 1', '@ ').checkMaskedDataCorruption({ check: '1', mask: 'aBc' }));
		assert.deepStrictEqual({ check: false, m: 0 }, new TaggedData(' ').checkMaskedDataCorruption(testdata.ut_getMolHeaderPattern().line4));
		assert.equal(false, new TaggedData(' ').checkMaskedDataCorruption(testdata.ut_getMolHeaderPattern().line4).check);
		assert.equal(true, new TaggedData('ACETYLCHOLINE & stuff\nGTMACCS - II11299515322D 1   0.00377     0.00000     0    GST\n \n 10  9  0  0  0  0              2 V2000\n    2.5762   -0.3621    0.0000 N   0  3  3  0  0  0'.repeat(15)).checkMaskedDataCorruption(testdata.ut_getMolHeaderPattern().line4).check);
	});
});
