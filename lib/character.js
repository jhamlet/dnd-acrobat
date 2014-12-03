var Model = require('./model'),
    Abilities = require('./abilities'),
    Classes = require('./classes'),
    Saves = require('./saves'),
    Skills = require('./skills');

function Character () {
    Character.superclass.call(this, {
        abilities: new Abilities(this),
        classes: new Classes(this),
        saves: new Saves(this),
        skills: new Skills(this)
    });

    this.init();
}

module.exports = Model.extend(Character, {
    init: function () {
        var updatePerception = this.updatePerception.bind(this);

        this.emit('init');

        this.skills.on('changed', function (skill, total) {
            if (skill.toLowerCase() === 'perception') {
                updatePerception(total);
            }
        });

        this.updatePerception(this.skills.Perception.total);
    },

    updatePerception: function (bonus) {
        var field = document.getField('PassivePerception');
        field.value = 10 + bonus;
    }
});
