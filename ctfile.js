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
	return ((parseInt(flag) == 1) || /^\s*true\s*$/.test(flag))? true : false;
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
