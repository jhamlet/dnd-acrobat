/*globals window, app*/
window = typeof window === 'object' ? window : exports;

exports.setTimeout = app.setTimeOut;
exports.clearTimeout = app.clearTimeOut;
exports.setInterval = app.setInterval;
exports.clearInterval = app.clearInterval;

window.document = require('./document');
