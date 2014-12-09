/*globals ext*/
var protean = ext.protean;

function Abilities (model) {
    Abilities.
        keys.
        forEach(function (ability) {
            var abilityScore = ability + '-score',
                abilityBonus = ability + '-bonus',
                abilityProf = ability + '-proficiency',
                abilitySave = ability + '-save';

            model.
                on(abilityScore).
                select(this._calculateBonus).
                subscribe(model.set.bind(model, abilityBonus));

            model.
                property(abilityProf).
                combineLatest(
                    model.property('proficiency-bonus'),
                    model.property(abilityBonus),
                    function (prof, pBonus, aBonus) {
                        return (prof ? pBonus : 0) + aBonus;
                    }
                ).
                subscribe(model.set.bind(model, abilitySave));
        }, this);
}

protean.augment(Abilities, {
    keys: [
        'strength',
        'dexterity',
        'constitution',
        'intelligence',
        'wisdom',
        'charisma'
    ]
});

module.exports = protean.classify(Abilities, {
    _calculateBonus: function (value) {
        var score = parseInt(value, 10);
        return Math.floor((score - 10) / 2);
    }
});
