var Model = require('./model'),
    _ = require('underscore'),
    SKILLS = {
        Acrobatics: { ability: 'dexterity' },
        AnimalHandling: { ability: 'wisdom' },
        Arcana: { ability: 'intelligence' },
        Athletics: { ability: 'strength' },
        Deception: { ability: 'charisma' },
        History: { ability: 'intelligence' },
        Insight: { ability: 'wisdom' },
        Intimidation: { ability: 'charisma' },
        Investigation: { ability: 'intelligence' },
        Medicine: { ability: 'wisdom' },
        Nature: { ability: 'intelligence' },
        Perception: { ability: 'wisdom' },
        Performance: { ability: 'charisma' },
        Persuasion: { ability: 'charisma' },
        Religion: { ability: 'intelligence' },
        SleightOfHand: { ability: 'dexterity' },
        Stealth: { ability: 'dexterity' },
        Survival: { ability: 'wisdom' }
    };

function Skills (parent) {
    Skills.superclass.call(
        this,
        _.
            keys(SKILLS).
            map(function (skill) { return _.extend({ name: skill }, SKILLS[skill]); }).
            reduce(function (acc, cur) {
                acc[cur.name] = _.extend({ total: 0 }, cur);
                return acc;
            }, { parent: parent })
    );
    parent.once('init', this.init.bind(this));
}

module.exports = Model.extend(Skills, {
    get keys () { return _.keys(SKILLS); },

    init: function () {
        var parent = this.parent,
            abilities = parent.abilities,
            skillKeys = this.keys,
            update = this.update.bind(this);

        parent.
        classes.
        on('proficiency-bonus', this.updateAll.bind(this));

        abilities.on('bonus-changed', function (ability, bonus) {
            skillKeys.
                forEach(function (skill) {
                    if (SKILLS[skill].ability === ability) {
                        update(skill, bonus);
                    }
                });
        });

        this.
            keys.
            forEach(function (skill) {
                var id = skill + 'Prof';
                document.on(id, 'click', function () {
                    update(skill, abilities[SKILLS[skill].ability].bonus);
                });
            });

        this.updateAll();
    },

    updateAll: function () {
        var abilities = this.parent.abilities,
            update = this.update.bind(this);

        this.
        keys.
        forEach(function (skill) {
            var ability = SKILLS[skill].ability;
            update(skill, abilities[ability].bonus);
        });
    },

    update: function (skill, bonus) {
        var hasField = document.getField(skill + 'Prof'),
            skillField = document.getField(skill),
            isChecked = hasField.isBoxChecked(0),
            proficiency = this.parent.classes.proficiency || 0,
            obj = this[skill],
            prev = obj && obj.total,
            total = bonus + (isChecked ? proficiency : 0);

        if (!skillField) {
            console.println('COULD NOT LOCATE SKILL FIELD: ' + skill);
            return;
        }

        if (skillField.value === '' || prev !== total) {
            this[skill].total = total;
            skillField.value = (total >= 0 ? '+' : '-') + total;
            this.emit('changed', skill, total);
        }
    }
});
