/* ctfile.js
 * Copyright 2016 Dmitry Sigaev
 *
 * Released under the MIT license -- see MIT-LICENSE for details
 */

/*
 *    Parser for Chemical Table Files formats
 *    Usage:
 *        var ctfile = require('ctfile');
 *        var CTobject = ctfile.parseCTfileFormat(string);
 *        var version = ctfile.getVersion();
 *    @module ctfile
 *    @class  ctfile
 */


var CTFile = function () {
}

/*
 *    Return module version object.
 *    @method getVersion
 *    @return {String} parser version
 */

CTFile.prototype.getVersion = function () {
	return {
		moduleVersion: '0.0.0'
	};
};

/*
 *	Converts FORTRAN notation like  A2 to AA
 *	@method poundoutMask
 *	@param {String} mask the string to pound out
 *	@return {String} a new string with digitals replaced by a char or return input mask
 */
var poundoutMask = function (mask) {
	if (/\w\d+/.test(mask)) {
		/* convert FORTRAN notation like  A2 to AA */
		return mask.replace(/(\w)(\d+)/g, function (match, p1, p2) { return p1.repeat(parseInt(p2)) });
	}
	return mask;
}

/*
 *	Converts FORTRAN notation like  A2 to AA or '.2' to '..' and '\d2 to '\d\d' 
 *	@method poundoutMaskExt
 *	@param {String} mask the string to pound out
 *	@return {String} a new string with digitals replaced by a char or return input mask
 */
var poundoutMaskExt = function (mask) {
	if (/\\\S\d+|\S\d+/.test(mask)) {
		/* convert FORTRAN notation like  A2 to AA */
		mask = mask.replace(/(\\\S)(\d+)/g, function (match, p1, p2) { return p1.repeat(parseInt(p2)) });
		return mask.replace(/(\S)(\d+)/g, function (match, p1, p2) { return p1.repeat(parseInt(p2)) });
	}
	return mask;
}

/*
 *	Parses a string to check line by a template. Converts string data to boolean
 *	@method parseFlag
 *	@param {String} flag the string to parse
 *	@return {Bolean} type from the flag string
 */
var parseFlag = function (flag) {
	return (/^\s*((true)|1)\s*$/.test(flag))? true : false;
};

/*
 *	Clean invisible characters (any Unicode spaces unless \n - splitter and ' ' - separator)
 *	@method cleanInvChars
 *	@param {string} str the str to clean
  *	@param {string=} splitter(optional). Specifies the character(s) to use as a splitter in returned string
  *	@param {string=} separator(optional). Specifies the character(s) to use as a separator in returned string
  *	@return {string} A new string where white space charactes clean unless \n and ' '
 */
var cleanInvChars = function (str, splitter, separator) {
	if (splitter === undefined)
		splitter = '\n';
	if (separator === undefined)
		separator = ' ';
	var tempstr = str.replace(RegExp(splitter,'gi'), '\u9787'); /* \u9787 is an emoticon */ /* splitter */
	tempstr = tempstr.replace(RegExp(separator, 'gi'), '\u9786'); /* \u9786 is an emoticon */  /* separator */
	tempstr = tempstr.replace(/\s+/gi, '');
	tempstr = tempstr.replace(/\u9787/gi, splitter);
	tempstr = tempstr.replace(/\u9786/gi, separator);
	return tempstr;
}

/*
 *	Clean invisible characters and replace splitters(any Unicode spaces unless \n - splitter and ' ' - separator)
 *	@method cleanInvChars
 *	@param {string} str the str to clean
  *	@param {string=} splitter(optional). Specifies the character(s) to use as a splitter in returned string
  *	@param {string=} separator(optional). Specifies the character(s) to use as a separator in returned string
  *	@return {string} A new string where white space charactes clean unless \n and ' '
 */
var cleanInvCharsWithReplacement = function (str, splitter, separator, newsplitter, newseparator) {
	if (splitter === undefined)
		splitter = '\n';
	if (separator === undefined)
		separator = ' ';
	if (newsplitter === undefined)
		newsplitter = '\n';
	if (newseparator === undefined)
		newseparator = ' ';
	var tempstr = str.replace(RegExp(splitter, 'gi'), '\u9787'); /* \u9787 is an emoticon */ /* splitter */
	tempstr = tempstr.replace(RegExp(separator, 'gi'), '\u9786'); /* \u9786 is an emoticon */  /* separator */
	tempstr = tempstr.replace(/\s+/gi, '');
	tempstr = tempstr.replace(/\u9787/gi, newsplitter);
	tempstr = tempstr.replace(/\u9786/gi, newseparator);
	return tempstr;
};


/*
 * Molfile
 * By now there are two version of Molfile format: V2000 and V3000
 * V2000 and V3000 have common header structure but they have different ctab data.
 * V2000 header contains the information without which it can not continue to read data
 * the mainest line where this information located is 4
 */
var molfileHeaderTemplate = {
	description: "Header Template for V2000 and V3000 Molfiles. Identifies the molfile: molecule name, user's name, program, date, and other miscellaneous information and comments",
	preprocess: cleanInvChars,
	line1 : {
		description: "Molecule name. This line is unformatted, but like all other lines in a molfile cannot extend beyond column 80. If no name is available, a blank line must be present.",
		rep: function (x) { return x.replace(/;/g, ' '); }, // type = 1;
		check_zero: /(\d[23]D)|(V[23]000)/, /* regular expression object for matching text in line with keys of next lines*/
		mask: 'N80', /* (FORTRAN notation: A2<--A8--><---A10-->A2I2<--F10.5-><---F12.5--><-I6-> ) */
		format : { 'N': { key: 'name', fn: String, def: " " } }
	},
	line2 : {
		description: "Note: A blank line can be substituted for line 2.",
		mask: 'IIPPPPPPPPMMDDYYHHmmddSSssssssssssEEEEEEEEEEEERRRRRR', /*(FORTRAN: A2<--A8--><---A10-->A2I2<--F10.5-><---F12.5--><-I6-> ) */
		format: {
			'I': { key: 'userInitials', fn: String },
			'P': { key: 'programName', fn: String },
			'M': { key: 'month', fn: parseInt, def: 1 },
			'D': { key: 'day', fn: parseInt, def: 0 },
			'Y': { key: 'year', fn: parseInt, def: 0 },
			'H': { key: 'hour', fn: parseInt, def: 0 },
			'm': { key: 'minute', fn: parseInt, def: 0 },
			'd': { key: 'dimension', fn: String },
			'S': { key: 'scalingFactorsMajor', fn: String },
			's': { key: 'scalingFactorsMinor', fn: String },
			'E': { key: 'energy', fn: String },
			'R': { key: 'internalRegistryNumber', fn: String }
		}
	},
	line3 : {
		description: "A line for comments.If no comment is available, a blank line must be present.",
		rep: function (x) { return x.replace(/;/g, ' '); }, // type = 1;
		check_zero: /V[23]000/,
		mask: 'N80',
		format : { 'N': { key: 'comments', fn: String, def: " " } }
	},
	line4 : {
		description: "V2000 commonly",
		re_find: /V[23]000/g,
		check: 'V[23]000',
		re_check: RegExp('\\n' + poundoutMaskExt('.34') + 'V[23]000', 'g'),
		mask: 'aaabbblllfffcccsssxxxrrrpppiiimmmvvvvvv',
		format: {
			'a': { key: 'numAtoms', fn: parseInt, def: 0 },
			'b': { key: 'numBonds', fn: parseInt, def: 0 },
			'l': { key: 'numAtomLists', fn: parseInt, def: 0 },
			'c': { key: 'chiralFlag', fn: parseFlag, def: false },
			's': { key: 'numStextEntries', fn: parseInt, def: 0 },
			'm': { key: 'numAdditionalProperties', fn: parseInt, def: 999 },
			'v': { key: 'version', fn: String, def: 0 }
		}
	}
};

/*
 *	Parses a line by a template
 *	@method parseLineByTemplate
 *	@param {string} line the line to parse
 *	@param {Object} template the template of lined data consists from mask and format
 *	@param {string=} separator(optional). Specifies the character(s) to use for parsing the line by template
 *	@return {Object} data from the line
 */
var parseLineByTemplate = function (line, template, separator) {
	var mask = poundoutMask(template.mask);
	var format = template.format;
	var out = {};
	
	/*
	note: "How to do a fast check: Each line of templated data has a mask. Mask length is the longest length of structured data. Firstly we should compare Mask.length with split data."
	*/

	for (var i = 0; i < mask.length && i < line.length; i++) {
		if (line[i] !== separator) {
			var token = format[mask[i]];
			if (token === undefined)
				continue;
			if (out[token.key] === undefined)
				out[token.key] = '';
			out[token.key] += line[i];
		}
	}
	
	Object.keys(format).forEach(function (char) {
		var token = format[char];
		if (out[token.key] !== undefined) {
			out[token.key] = token.fn(out[token.key]);
		} else {
			if (token.def !== undefined)
				out[token.key] = token.def;
		}
	});
	return out;
};

/*
 *	Counts for a match between a regular expression and a specified string 
 *	@method countRegExpEntry
 *	@param {Object} re the regular expression object.
 *	@param {string} str thr input string (stream) where the match is to be found
 *	@return {number} A number of a match on the same global regular expression
 */
var countRegExpEntry = function (re, str) {
	var count = 0;
	while (re.test(str)) { count++; } //  test() called multiple times on the same global regular expression instance will advance past the previous match
	return count;
}

/*
 *	Check a masked data on a data corruption by using global flag
 *	@method checkMaskedDataCorruption
 *	@param {string} stream the stream 
 *	@param {Object} template the template of lined data consists from mask and format
 *	@param {string=} spliter(optional). Specifies the character(s) to use as a line spliter
  *	@return {Object} the state
 */
var checkMaskedDataCorruption = function (stream, template, spliter) {
	var cs = '';
	if (!(template) || !(template.check) || !(template.mask))
		return { check: false, err: '@param template should be checked' };
	if (spliter === undefined) {
		cs = cleanInvChars(stream); // clean stream
		spliter = '\n';
	}
	else {
		if (spliter !== '')
			cs = cleanInvChars(stream); // clean stream
		else
			cs = stream;
	}
	var mask = template.mask;
	var check = template.check;
	var mul_match = 0;  //multiple matching
	var hasmatch = cs.match(RegExp(check,'g')); // check key information
	if (hasmatch === null)
		return { check: false, m: mul_match };
	mul_match = hasmatch.length; //detect the multiple matching
	// construct a regular expression to check a lined mask
	// '.' + str(mask - 'V2000'.length) should be like .34
	var shouldPoundOut = '.' + (mask.length - hasmatch[0].length).toString();
	re = RegExp(spliter + poundoutMaskExt(shouldPoundOut) + check, 'g');
	var uncorrupted = countRegExpEntry(re, cs);
	if (uncorrupted !== mul_match) {
		// should detect the data corruption
		// m - a count of a multiple matching
		// s - solid data in masked data
		return { check: false, m: mul_match, s: uncorrupted };
	}
	return { check: true, m: mul_match };
}

/*
 *	Clean set of white space characters from string
 *	@method cleanWSChs
 *	@param {string} str the str to clean
 *	@param {string=} separator(optional). Specifies the character(s) to use as a separator in returned string
  *	@return {string} A new string where white space charactes clean
 */
var cleanWSChs = function (str, separator) {
	var tempstr = str.replace(/\n+/gi, '\u9787'); /* \u9787 is an emoticon */
	tempstr = tempstr.replace(/\s+/gi, '\u9787');
	tempstr = tempstr.replace(/(\u9787){2,}/gi, '\n');
	separator = (separator === undefined)?';':separator;
	tempstr = tempstr.replace(/\u9787/gi, separator);
	return tempstr;
}

/*
 *	Clean set of white space characters from string
 *	@method cleanWSChs2
 *	@param {string} str the str to clean
 *	@param {string=} separator(optional). Specifies the character(s) to use as a separator in returned string
  *	@return {string} A new string where white space charactes clean
 */
var cleanWSChs2 = function (str, separator) {
	var tempstr = str.replace(/\n+/gi, '\u9787\u9788\u9787'); /* \u9787 is an emoticon */
	tempstr = tempstr.replace(/\s+/gi, '\u9787');
	tempstr = tempstr.replace(/(\u9787){2,}/gi, '@');
	separator = (separator === undefined)?';':separator;
	tempstr = tempstr.replace(/\u9787/gi, separator);
	tempstr = tempstr.replace(/\u9788/gi, '@');
	tempstr = tempstr.replace(RegExp(''+separator+'*'+'@+'+separator + '*', 'gi'), '@');
	return tempstr;
}

/*
 *    Parses a CTAB record and returns an Object
 *    @method parseCTfileFormat
 *    @param {String} mol the complete molfile, including newlines
 *    @return {Object} an object representing the contents of the molfile
 */

CTFile.prototype.parseCTfileFormat = function (mol) {
	return {
		ctab: {}
	};
};

/*
 *	UT:Parses a string to check line by a template. Converts string data to boolean
 *	@method parseFlag
 *	@param {String} flag the string to parse
 *	@return {Bolean} type from the flag string
 */
CTFile.prototype.ut_parseFlag = function (flag) {
	return parseFlag(flag);
};

/*
 *	UT:Get molfileHeaderTemplate Object
 *	@method ut_getMolHeaderPattern
 *	@return {Object} molfileHeaderTemplate 
 */
CTFile.prototype.ut_getMolHeaderPattern = function () {
	return molfileHeaderTemplate;
};

/*
 *	UT:Converts FORTRAN notation like  A2 to AA
 *	@method ut_poundoutMask
 *	@param {String} mask the string to pound out
 *	@return {String} a new string with digitals replaced by a char
 */
CTFile.prototype.ut_poundoutMask = function (mask) {
	return poundoutMask(mask);
};

/*
*	UT:Converts FORTRAN notation like  A2 to AA or '.2' to '..'
*	@method ut_poundoutMask
*	@param {String} mask the string to pound out
*	@return {String} a new string with digitals replaced by a char
*/
CTFile.prototype.ut_poundoutMaskExt = function (mask) {
	return poundoutMaskExt(mask);
};

/*
 *	UT: Parses a line by a template
 *	@method ut_parseLineByTemplate
 *	@param {string} line the line to parse
 *	@param {Object} template the template of lined data consists from mask and format
 *	@param {string=} separator(optional). Specifies the character(s) to use for parsing the line by template
  *	@return {Object} data from the line
 */

CTFile.prototype.ut_parseLineByTemplate = function (line, template, separator) {
	return parseLineByTemplate(line, template, separator);
};

/*
 *	UT: Clean set of white space characters from string
 *	@method ut_cleanWSChs
 *	@param {string} str the str to clean
 *	@param {string=} separator(optional). Specifies the character(s) to use as a separator in returned string
  *	@return {string} A new string where white space charactes clean
 */
CTFile.prototype.ut_cleanWSChs = function (str, separator) {
	return cleanWSChs(str, separator);
};

/*
 *	UT: Clean set of white space characters from string
 *	@method ut_cleanWSChs
 *	@param {string} str the str to clean
 *	@param {string=} separator(optional). Specifies the character(s) to use as a separator in returned string
  *	@return {string} A new string where white space charactes clean
 */
CTFile.prototype.ut_cleanWSChs2 = function (str, separator) {
	return cleanWSChs2(str, separator);
};

/*
 *	UT: Clean invisible characters (any Unicode spaces unless \n and ' ')
 *	@method ut_cleanInvChars
 *	@param {string} str the str to clean
  *	@return {string} A new string where white space charactes clean unless \n and ' '
 */
CTFile.prototype.ut_cleanInvChars = function (str) {
	return cleanInvChars(str);
};

/*
 *	UT: Counts for a match between a regular expression and a specified string 
 *	@method countRegExpEntry
 *	@param {Object} re the regular expression object.
 *	@return {number} A number of a match on the same global regular expression
 */
CTFile.prototype.ut_countRegExpEntry = function (re, str) {
	return countRegExpEntry(re, str);
}

/*
 *	UT: Check a masked data on a data corruption by using global flag
 *	@method checkMaskedDataCorruption
 *	@param {string} stream the stream 
 *	@param {Object} template the template of lined data consists from mask and format
 *	@param {string=} spliter(optional). Specifies the character(s) to use as a line spliter
  *	@return {Object} the state
 */
CTFile.prototype.ut_checkMaskedDataCorruption = function (stream, template, spliter) {
	return checkMaskedDataCorruption(stream, template, spliter);
};

module.exports = new CTFile();
