/* declaration of modules  */
var assert = require('assert');

describe('Test String.prototype.match', function () {
	it('Should return an array containing the entire match result', function (){
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

		// Using global and ignore case flags with match()
		// The following example demonstrates the use of the global and ignore case flags with match().Allletters A through E and a through e are returned, each its own element in the array.

		// var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		// var regexp = /[A-E]/gi;
		// var matches_array = str.match(regexp);
		// console.log(matches_array);
		// ['A', 'B', 'C', 'D', 'E', 'a', 'b', 'c', 'd', 'e']

		assert.equal(true, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.match(/[A-E]/gi).hasOwnProperty('length'));
		assert.equal(10, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.match(/[A-E]/gi).length);
		assert.equal(false, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.match(/[A-E]/gi).hasOwnProperty('index'));
		assert.equal(false, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.match(/[A-E]/gi).hasOwnProperty('input'));
		/* there are additional examples: here, in global case, any parentheses don't capture matched results. In other words parentheses are ignored */
		assert.equal(true, '@V2000ab@03V3000a!V200'.match(/v[23]000(\w*)/gi).hasOwnProperty('length'));
		assert.equal(2, '@V2000ab@03V3000a!V200'.match(/v[23]000(\w*)/gi).length);
		assert.equal(false, '@V2000ab@03V3000a!V200'.match(/v[23]000(\w*)/gi).hasOwnProperty('index'));
		assert.equal(false, '@V2000ab@03V3000a!V200'.match(/v[23]000(\w*)/gi).hasOwnProperty('input'));
		assert.equal('V2000ab', '@V2000ab@03V3000a!V200'.match(/v[23]000(\w*)/gi)[0]);
		assert.equal('V3000a', '@V2000ab@03V3000a!V200'.match(/v[23]000(\w*)/gi)[1]);

		assert.equal(true, '@V2000ab@03V3000a!v2000'.match(/v[23]000(\w*)/gi).hasOwnProperty('length'));
		assert.equal(3, '@V2000ab@03V3000a!v2000'.match(/v[23]000(\w*)/gi).length);
		assert.equal(false, '@V2000ab@03V3000a!v2000'.match(/v[23]000(\w*)/gi).hasOwnProperty('index'));
		assert.equal(false, '@V2000ab@03V3000a!v2000'.match(/v[23]000(\w*)/gi).hasOwnProperty('input'));
		assert.equal('V2000ab', '@V2000ab@03V3000a!v2000'.match(/v[23]000(\w*)/gi)[0]);
		assert.equal('V3000a', '@V2000ab@03V3000a!v2000'.match(/v[23]000(\w*)/gi)[1]);
		assert.equal('v2000', '@V2000ab@03V3000a!v2000'.match(/v[23]000(\w*)/gi)[2]);
		/*let's remove global flag */
		assert.equal(true, '@V2000ab@03V3000a!v2000'.match(/v[23]000(\w*)/i).hasOwnProperty('length'));
		assert.equal(2, '@V2000ab@03V3000a!v2000'.match(/v[23]000(\w*)/i).length);
		assert.equal(true, '@V2000ab@03V3000a!v2000'.match(/v[23]000(\w*)/i).hasOwnProperty('index'));
		assert.equal(1, '@V2000ab@03V3000a!v2000'.match(/v[23]000(\w*)/i).index);
		assert.equal(true, '@V2000ab@03V3000a!v2000'.match(/v[23]000(\w*)/i).hasOwnProperty('input'));
		assert.equal('@V2000ab@03V3000a!v2000', '@V2000ab@03V3000a!v2000'.match(/v[23]000(\w*)/i).input);
		assert.equal('V2000ab', '@V2000ab@03V3000a!v2000'.match(/v[23]000(\w*)/i)[0]);
		assert.equal('ab', '@V2000ab@03V3000a!v2000'.match(/v[23]000(\w*)/i)[1]);
		/* compare to above :) */
		assert.equal('b', '@V2000ab@03V3000a!v2000'.match(/v[23]000(\w)*/i)[1]);
		/* again */
		assert.equal('abcd', '@V2000abcd@03V3000a!v2000'.match(/v[23]000(\w\w*)/i)[1]);
		assert.equal('cd', '@V2000abcd@03V3000a!v2000'.match(/v[23]000(\w\w)*/i)[1]);
	});
});
