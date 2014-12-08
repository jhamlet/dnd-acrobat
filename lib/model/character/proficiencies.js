/*globals ext*/
var protean = ext.protean,
    Abilities = require('./abilities'),
    Skills = require('./skills');

function Proficiencies (model) {
    Abilities.
        keys.
        concat(Skills.keys).
        map(function (key) { return key.replace(/\s+/, '').toLowerCase(); }).
        forEach(function (key) {
            var name = 'proficiency-' + key;

            model.
                on(name).
                subscribe(model.set.bind(model, name));
        }, this);
}

module.exports = protean.classify(Proficiencies);
