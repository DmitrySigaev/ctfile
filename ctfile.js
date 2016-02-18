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
 *	Parses a string to check line by a template. Converts string data to boolean
 *	@method parseFlag
 *	@param {String} flag the string to parse
 *	@return {Bolean} type from the flag string
 */
var parseFlag = function (flag) {
	return ((parseInt(flag) == 1) || /^\s*true\s*$/.test(flag))? true : false;
};

/*
 *	Parses a line by a template
 *	@method parseLineByTemplate
 *	@param {String} line the line to parse
 *	@param {Object} template the template of lined data consists from mask and format
 *	@return {Object} data from the line
 */

var parseLineByTemplate = function (line, template) {
	var   { mask, format } = template;
	var tokens = {};
	
	for (var i = 0; i < mask.length && i < line.length; ++i) {
		if (line[i] !== ' ') {
			var token = format[mask[i]];
			if (token === undefined)
				continue;
			if (tokens[token.key] === undefined)
				tokens[token.key] = '';
			tokens[token.key] += line[i];
		}
	}
	
	Object.keys(format).forEach(function (ch) {
		var token = format[ch];
		if (tokens[token.key] !== undefined) {
			tokens[token.key] = token.fn(tokens[token.key]);
		} else {
			if (token.def !== undefined)
				tokens[token.key] = token.def;
		}
	});
	return tokens;
};

module.exports = new CTFile ();
