/*globals ext*/
var protean = ext.protean;

function Traits (model) {
    this.model = model;

    model.
        property('traits-text').
        where(Boolean).
        distinctUntilChanged().
        doAction(this.clear.bind(this)).
        doAction(function (v) {
            console.println('traits-text: ' + v);
        }).
        select(this.parse.bind(this)).
        subscribe(function (traits) {
            traits.forEach(function (t) { model.set(t.key, t.value); });
        });
}

module.exports = protean.classify(Traits, {
    parsers: [
        function expertise (line) {
            if (/expertise:\s+/i.test(line)) {
                console.println('MATCH');
                return line.
                    slice(line.indexOf(':') + 1).
                    split(',').
                    map(function (skill) {
                        return skill.
                            replace(/\s+/g, '').
                            toLowerCase() +
                            '-expertise';
                    }).
                    map(function (key) {
                        console.println('key: ' + key);
                        return {
                            key: key,
                            value: true,
                            reset: false
                        };
                    });
            }
        }
    ],

    clear: function () {
        var model = this.model,
            traits = this._traits || [];

        traits.forEach(function (t) { model.set(t.key, t.reset); });
    },

    parse: function (txt) {
        var parsers = this.parsers,
            len = parsers.length,
            traits;

        traits =
            txt.
            split(/\n+/).
            reduce(function (acc, line) {
                var i = 0,
                    result;

                for (; i < len; i++) {
                    result = parsers[i](line);
                    if (result !== undefined) {
                        acc.push.apply(acc, result);
                        break;
                    }
                }

                return acc;
            }, []);

        this._traits = traits;

        return traits;
    }
});
