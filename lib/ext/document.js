/*globals ext*/
var Element = require('./element'),
    _ = require('underscore'),
    EMPTY = {};

/*globals document*/
document = exports;

_.extend(document, {
    _elements: {},

    _doc: event.target,

    getElementById: function (id) {
        if (!this._elements[id]) {
            this._elements[id] = new Element(this._doc, id);
        }
        return this._elements[id];
    },

    createElement: function () { return EMPTY; },

    getField: function (id) {
        var el = this.getElementById(id);
        return el && el.field;
    },

    emit: function (type) {
        var target = event.target,
            id = target.name,
            el = this.getElementById(id);

        if (el) {
            el.emit(type, event);
        }
    },

    reset: function () {
        var elements = this._elements;

        _.
            keys(elements).
            map(_.pick.bind(_, elements)).
            forEach(this.resetElement.bind(this));
        
        this._elements = {};
    }
});

