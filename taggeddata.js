/* 
 * taggeddata.js 
 * Copyright 2015 Dmitry Sigaev
 *
 * Released under the MIT license -- see MIT-LICENSE for details
 */

/*
 *	Counts for a match between a regular expression and a specified string 
 *	@method countRegExpEntry
 *	@param {object} re the regular expression object.
 *	@param {string} str thr input string (stream) where the match is to be found
 *	@return {number} A number of a match on the same global regular expression
 */
var countRegExpEntry = function (re, str) {
	var count = 0;
	while (re.test(str)) { count++; } //  test() called multiple times on the same global regular expression instance will advance past the previous match
	return count;
};

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
 *	Converts data to tagged (covert) data
 *	@method doTaggedData
 *	@param {string} str the str to clean
  *	@param {string=} splitter(optional). Specifies the character(s) to use as a splitter in returned string
  *	@param {string=} separator(optional). Specifies the character(s) to use as a separator in returned string
  *	@return {object} A taggedData
 */
var doTaggedData = function (string, splitter, separator) {
	var taggedData = {};
	if (splitter === undefined)
		splitter = '\n';
	if (separator === undefined)
		separator = ' ';
	var unicode = 9787; /* \u263B is an emoticon */ 
	var uncString = '';
	do { uncString = String.fromCharCode(unicode); unicode--; }  while(countRegExpEntry(RegExp(uncString, 'g'), string));
	var newSplitter = uncString;
	do { uncString = String.fromCharCode(unicode); unicode--; } while(countRegExpEntry(RegExp(uncString, 'g'), string));
	var newSeparator = uncString;
	taggedData.data = string.replace(RegExp(splitter, 'gi'), newSplitter); /* splitter */
	taggedData.data = taggedData.data.replace(RegExp(separator, 'gi'), newSeparator);  /* eparator */
	taggedData.data = taggedData.data.replace(/\s+/gi, '');
	taggedData.splitter = { 0: newSplitter, 1: splitter };
	taggedData.separator = { 0: newSeparator, 1: separator };
	return taggedData;
}

/*
 *	Create tagged (covert) data from string
 *	@method TaggedData
 *	@param {string} str the str to clean
  *	@param {string=} splitter(optional). Specifies the character(s) to use as a splitter in returned string
  *	@param {string=} separator(optional). Specifies the character(s) to use as a separator in returned string
  *	@return {object} A taggedData
 */
var TaggedData = function (string, splitter, separator) {
	var taggedData = doTaggedData(string, splitter, separator)
	this.data = taggedData.data;
	this.splitter = taggedData.splitter;
	this.separator = taggedData.separator;
}

/*
 *	Check a masked data on a data corruption by using global flag
 *	@method checkMaskedDataCorruption
 *	@param {string} stream the stream 
 *	@param {Object} template the template of lined data consists from mask and format
  *	@return {Object} the state
 */
TaggedData.prototype.checkMaskedDataCorruption = function (template, ignore) {
	var cs = '';
	var splitter = '';
	if (!(template) || !(template.check) || !(template.mask))
		return { check: false, err: '@param template should be checked' };
	if (!ignore)
		splitter = this.splitter[0];
	cs = this.data;
	var mask = template.mask;
	var check = doTaggedData(template.check, this.splitter[1], this.separator[1]).data;
	var mul_match = 0;  //multiple matching
	var hasmatch = cs.match(RegExp(check, 'g')); // check key information
	if (hasmatch === null)
		return { check: false, m: mul_match };
	mul_match = hasmatch.length; //detect the multiple matching
	// construct a regular expression to check a lined mask
	// '.' + str(mask - 'V2000'.length) should be like .34
	var shouldPoundOut = '.' + (mask.length - hasmatch[0].length).toString();
	re = RegExp(splitter + poundoutMaskExt(shouldPoundOut) + check, 'g');
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
 *	Converts tagged (covert) data to string
 *	@method tdToString
 *	@param {object} taggedData the taggedData 
 *	@return {string} 
 */
var tdToString = function (taggedData) {
	var tempstr = '';
	if (!(taggedData) || !(taggedData.data) || !(taggedData.splitter) || !(taggedData.separator))
		return tempstr;
	tempstr = taggedData.data;
	tempstr = tempstr.replace(RegExp(taggedData.splitter[0], 'g'), taggedData.splitter[1]);
	tempstr = tempstr.replace(RegExp(taggedData.separator[0], 'g'), taggedData.separator[1]);
	return tempstr;
};

/*
 *	Converts TaggedData to string 
 *	@method toString
 *	@return {string} 
 */
TaggedData.prototype.toString = function () {
	// Converts tagged (covert) data to string
	return tdToString(this);
}

module.exports = TaggedData;
