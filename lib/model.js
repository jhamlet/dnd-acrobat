var protean = require('protean'),
    EventEmitter = require('events').EventEmitter;

function Model (opts) {
    Model.superclass.call(this);
    protean.augment(this, opts || {});
}

module.exports = protean.inherit(EventEmitter, Model);

