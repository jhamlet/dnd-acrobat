/*globals ext*/
var protean = ext.protean,
    Rx = ext.Rx,
    Observable = Rx.Observable,
    merge = Observable.merge,
    zip = Observable.zip,
    Abilities = require('./abilities'),
    STR = Abilities.keys[0],
    DEX = Abilities.keys[1],
    // CON = Abilities.keys[2],
    INT = Abilities.keys[3],
    WIS = Abilities.keys[4],
    CHA = Abilities.keys[5];

function Skills (model) {
    this.model = model;

    Skills.
        keys.
        forEach(function (skill, idx) {
            var name = skill.replace(/\s+/g, ''),
                ability = Skills.abilities[idx],
                skillProf = name + '-proficiency',
                abilityBonus = ability + '-bonus',
                skillBonus = name + '-bonus';

            model.
                on(skillProf).
                combineLatest(
                    model.on('proficiency-bonus'),
                    model.on(abilityBonus),
                    model.on(name + '-expertise'),
                    function (a, b, c, d) {
                        return c + (a ? b * (d ? 2 : 1) : 0);
                    }
                ).
                subscribe(model.set.bind(model, skillBonus));
        });
}

protean.augment(Skills, {
   keys: [
        'acrobatics',
        'animal handling',
        'arcana',
        'athletics',
        'deception',
        'history',
        'insight',
        'intimidation',
        'investigation',
        'medicine',
        'nature',
        'perception',
        'performance',
        'persuasion',
        'religion',
        'sleight of hand',
        'stealth',
        'survival'
   ],
   abilities: [
        DEX,
        WIS,
        INT,
        STR,
        CHA,
        INT,
        WIS,
        CHA,
        INT,
        WIS,
        INT,
        WIS,
        CHA,
        CHA,
        INT,
        DEX,
        DEX,
        WIS
   ]
});

module.exports = protean.classify(Skills);

