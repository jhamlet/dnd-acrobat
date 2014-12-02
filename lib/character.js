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

    this.emit('init');
}

module.exports = Model.extend(Character);
