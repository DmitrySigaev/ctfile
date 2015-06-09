/* 
 * logger.js 
 * Copyright 2015 Dmitry Sigaev
 *
 * Released under the MIT license -- see MIT-LICENSE for details
 */

var Logger = {
	/* Predefined logging levels. */
	DEBUG: { name: 'DEBUG', desc : 'handles all incoming log messages', level: 1 },
	INFO: { name: 'INFO' , desc : 'can be used as common log messages', level: 2 },
	TIME: { name: 'TIME' , desc : 'profiling level', level: 3 },
	WARN: { name: 'WARN' , desc : 'handles all notices', level: 4 },
	ERROR: { name: 'ERROR', desc : 'handles critical or error log messages', level: 5 },
	OFF: { name: 'OFF', desc : 'switch off all incoming log messages', level: 6 }
};

module.exports = Logger;
