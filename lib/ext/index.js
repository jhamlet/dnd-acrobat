require('./function');
require('./object');
require('./array');
require('./console');
require('./document');

/*globals ext*/
ext = typeof ext === 'object' ? ext : {};

ext.window   = require('./window');
ext.document = window.document;
ext._        = require('underscore');
ext.protean  = require('protean');
