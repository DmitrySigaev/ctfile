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
 *	Parses a string to check line by a template. Converts string data to boolean
 *	@method parseFlag
 *	@param {String} flag the string to parse
 *	@return {Bolean} type from the flag string
 */
var parseFlag = function (flag) {
	return (/^\s*((true)|1)\s*$/.test(flag))? true : false;
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
	line1 : {
		description: "Molecule name. This line is unformatted, but like all other lines in a molfile cannot extend beyond column 80. If no name is available, a blank line must be present.",
		rep: function (x) { return x.replace(/;/g, ' '); }, // type = 1;
		check_zero: /(\d[23]D)|(V[23]000)/, /* regular expression object for matching text in line with keys of next lines*/
		mask: 'N40N40', /* (FORTRAN notation: A2<--A8--><---A10-->A2I2<--F10.5-><---F12.5--><-I6-> ) */
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
		mask: 'N40N40',
		format : { 'N': { key: 'comments', fn: String, def: " " } }
	},
	line4 : {
		description: "V2000 commonly",
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


module.exports = new CTFile ();
