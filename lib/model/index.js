/*globals ext*/
var protean = ext.protean,
    _ = ext._,
    Rx = ext.Rx;

function Model (opts) {
    var state = _.extend({}, opts || {}),
        subject = new Rx.BehaviorSubject(state);

    this.properties = {};
    this.state = state;
    this._subject = subject;
    // aliases
    this.on = this.changes;

    Model.superclass.call(this, subject.subscribe.bind(subject));

    _.
    pairs(state).
    forEach(function (args) { this.add(args[0], args[1]); }, this);
}

module.exports = protean.inherit(Rx.Observable, Model, {

    get keys () { return _.keys(this.properties); },

    get: function (key) { return this.state[key]; },

    set: function (key, value) {
        if (!this.properties[key]) {
            this.add(key, value);
            return;
        }

        this.properties[key].onNext(value);
    },

    add: function (key, value) {
        var prop;

        this.remove(key);
        prop = new Rx.BehaviorSubject(value);
        this.properties[key] = prop;

        this.changes(key).subscribe(this._updateState.bind(this, key));

        return prop;
    },

    remove: function (key) {
        var prop = this.properties[key];

        if (prop) {
            prop.onCompleted();
            delete this.properties[key];
        }
    },

    removeAll: function () {
        this.keys.forEach(this.remove.bind(this));
    },

    changes: function (key) {
        var prop = this.properties[key],
            changes = prop && prop.changes;

        if (!prop) {
            return this.add(key);
        }

        if (!changes) {
            prop.changes =
            changes =
                prop.
                distinctUntilChanged().
                publish().
                refCount();
        }

        return changes;
    },

    destroy: function () {
        var subject = this._subject;

        if (subject && !subject.isStopped) {
            this.removeAll();
            subject.onCompleted();
            this.properties = null;
            this.state = null;
            this._subject = null;
        }
    },

    _updateState: function (key, value) {
        var state = this.state,
            subject = this._subject,
            prev = state[key];

        if (prev !== value) {
            state[key] = value;
            subject.onNext(state);
        }
    }
});
