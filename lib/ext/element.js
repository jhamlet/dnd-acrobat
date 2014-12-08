/*globals ext*/
var protean = require('protean'),
    _ = require('underscore'),
    EVENTS = {
        'enter':     'MouseEnter',
        'leave':     'MouseExit',
        'press':     'MouseDown',
        'click':     'MouseUp',
        'focus':     'OnFocus',
        'blur':      'OnBlur',
        'keyup':     'Keystroke',
        'validate':  'Validate',
        'format':    'Format',
        'calculate': 'Calculate'
    };

function Element (doc, id) {
    this._doc = doc;
    this.id = id;
    this.events = {};
}

module.exports = protean.classify(Element, {
    get field () {
        return this._doc.getField(this.id);
    },

    on: function (name) {
        this.initEvent(name);
        return this.events[name];
    },

    emit: function (name, e) {
        var subject = this.events[name];
        return subject && subject.onNext(e);
    },

    initEvent: function (name) {
        if (!this.events[name]) {
            this.events[name] = new ext.Rx.Subject();
            this.field.setAction(EVENTS[name], 'document.emit(\'' + name + '\');');
        }
    }
});
