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

module.exports = new CTFile ();
