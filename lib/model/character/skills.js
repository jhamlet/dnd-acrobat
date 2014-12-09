/*globals ext*/
var protean = ext.protean,
    _ = ext._,
    // util = require('../../util'),
    Abilities = require('./abilities'),
    STR = Abilities.keys[0],
    DEX = Abilities.keys[1],
    // CON = Abilities.keys[2],
    INT = Abilities.keys[3],
    WIS = Abilities.keys[4],
    CHA = Abilities.keys[5],
    SKILLS = [
        {
            name: 'acrobatics',
            ability: DEX
        },
        {
            name: 'animal handling',
            ability: WIS
        },
        {
            name: 'arcana',
            ability: INT
        },
        {
            name:'athletics',
            ability: STR
        },
        {
            name: 'deception',
            ability: CHA
        },
        {
            name: 'history',
            ability: INT
        },
        {
            name: 'insight',
            ability: WIS
        },
        {
            name: 'intimidation',
            ability: CHA
        },
        {
            name: 'investigation',
            ability: INT
        },
        {
            name: 'medicine',
            ability: WIS
        },
        {
            name: 'nature',
            ability: INT
        },
        {
            name: 'perception',
            ability: WIS
        },
        {
            name: 'performance',
            ability: CHA
        },
        {
            name: 'persuasion',
            ability: CHA
        },
        {
            name: 'religion',
            ability: INT
        },
        {
            name: 'sleight of hand',
            ability: DEX
        },
        {
            name: 'stealth',
            ability: DEX
        },
        {
            name: 'survival',
            ability: WIS
        }
    ];

function Skills (model) {
    this.model = model;

    Skills.
        list.
        forEach(function (skill) {
            var key = skill.key,
                ability = skill.ability,
                skillProf = key + '-proficiency',
                skillExp = key + '-expertise',
                abilityBonus = ability + '-bonus',
                skillBonus = key + '-bonus';

            model.
                property(skillProf).
                combineLatest(
                    model.property('proficiency-bonus'),
                    model.property(abilityBonus),
                    model.property(skillExp),
                    function (a, b, c, d) {
                        // console.println(skillProf + ': ' + a);
                        // console.println(skillProf + ' bonus: ' + b);
                        // console.println(abilityBonus + ': ' + c);
                        // console.println(skillExp + ': ' + d);

                        return (c || 0) + (a ? b * (d ? 2 : 1) : 0);
                    }
                ).
                subscribe(model.set.bind(model, skillBonus));
        });
}

protean.augment(Skills, {
    get keys () {
        return Skills.list.map(_.property('key'));
    },

    get names () {
        return Skills.list.map(_.property('name'));
    },

    list: SKILLS.
        map(function (o) {
            o.key = o.name.replace(/\s+/g, '').toLowerCase();
            return o;
        })
});

module.exports = protean.classify(Skills);

