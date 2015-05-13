/* declaration of modules  */
var assert = require('assert');

describe('Test String.prototype.match', function () {
	it('Should return an array containing the entire match result and any parentheses - captured matched results, or null if there were no matches', function (){
		/* An Array containing the entire match result and any parentheses - captured matched results, or null if there were no matches.
		 */
		/*
		 * 	In the following example, match() is used to find 'Chapter' followed by 1 or more numeric characters
		 * followed by a decimal point and numeric character 0 or more times.The regular expression includes the
		 * i flag so that upper / lower case differences will be ignored.
		 */

		// var str = 'For more information, see Chapter 3.4.5.1';
		// var re = /see (chapter \d+(\.\d)*)/i;
		// var found = str.match(re);
		
		// console.log(found);
		
		// logs [ 'see Chapter 3.4.5.1',
		//        'Chapter 3.4.5.1',
		//        '.1',
		//        index: 22,
		//        input: 'For more information, see Chapter 3.4.5.1' ]
		
		// 'see Chapter 3.4.5.1' is the whole match.
		// 'Chapter 3.4.5.1' was captured by '(chapter \d+(\.\d)*)'.
		// '.1' was the last value captured by '(\.\d)'.
		// The 'index' property (22) is the zero-based index of the whole match.
		// The 'input' property is the original string that was parsed.
		assert.equal(true, 'For more information, see Chapter 3.4.5.1'.match(/see (chapter \d+(\.\d)*)/i).hasOwnProperty('length'));
		assert.equal(3, 'For more information, see Chapter 3.4.5.1'.match(/see (chapter \d+(\.\d)*)/i).length);
		assert.equal(true, 'For more information, see Chapter 3.4.5.1'.match(/see (chapter \d+(\.\d)*)/i).hasOwnProperty('index'));
		assert.equal(22,'For more information, see Chapter 3.4.5.1'.match(/see (chapter \d+(\.\d)*)/i).index);
		assert.equal(true, 'For more information, see Chapter 3.4.5.1'.match(/see (chapter \d+(\.\d)*)/i).hasOwnProperty('input'));
		assert.equal('For more information, see Chapter 3.4.5.1', 'For more information, see Chapter 3.4.5.1'.match(/see (chapter \d+(\.\d)*)/i).input);
		assert.equal('see Chapter 3.4.5.1', 'For more information, see Chapter 3.4.5.1'.match(/see (chapter \d+(\.\d)*)/i)[0]);
		assert.equal('Chapter 3.4.5.1', 'For more information, see Chapter 3.4.5.1'.match(/see (chapter \d+(\.\d)*)/i)[1]);
		assert.equal('.1', 'For more information, see Chapter 3.4.5.1'.match(/see (chapter \d+(\.\d)*)/i)[2]);

	});
});
