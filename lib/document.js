var protean = require('protean'),
    EventEmitter = require('events').EventEmitter,
    _ = require('underscore'),
    ACTIONS = {
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

/*globals document*/
document = exports;

protean.augment(document, {
    _elements: {},

    _doc: event.target,

    _get: function (id) {
        var f;

        if (this._elements[id]) {
            return this._elements[id];
        }

        f = this._doc.getField(id);
        return f && this.initField(f);
    },

    getField: function (id) {
        var el = this._get(id);
        return el && el.field;
    },

    emit: function (type) {
        var target = event.target,
            id = target.name,
            emitter = this.getEmitter(id);

        if (emitter) {
            emitter.emit(type, event);
        }
    },

    on: function (id, name, fn) {
        var el = this.initEvent(this._get(id), name);

        if (el) {
            el.emitter.on(name, fn);
        }
    },

    removeListener: function (id, name, fn) {
        var el = this._get(id);

        if (el) {
            el.removeListener(name, fn);
        }
    },

    getEmitter: function (id) {
        var el = this._get(id);
        return el && el.emitter;
    },

    initField: function (field) {
        var name = field.name,
            el = this._elements[name];

        if (!el) {
            el = this._elements[name] = {
                emitter: new EventEmitter(),
                field: field,
                actions:
                    _.
                    keys(ACTIONS).
                    reduce(function (acc, cur) {
                        acc[cur] = false;
                        return acc;
                    }, {})
            };
        }

        return el;
    },

    initEvent: function (el, action) {
        if (el && !el.actions[action]) {
            el.actions[action] = true;
            el.field.setAction(ACTIONS[action], 'document.emit(\'' + action + '\');');
        }
        return el;
    },

    resetField: function (field) {
        _.
            keys(ACTIONS).
            forEach(function (action) { field.setAction(ACTIONS[action], ''); });
    },

    resetElement: function (el) {
        el.emitter.removeAllListeners();
        el.emitter = null;
        this.resetField(el.field);
        el.actions = null;
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

