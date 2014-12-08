var Model = require('../'),
    Abilities = require('./abilities'),
    Skills = require('./skills');

function Character () {
    Character.superclass.call(this);

    this.abilities      = new Abilities(this);
    this.skills         = new Skills(this);

    this.
        on('class-level').
        select(this._calculateLevels).
        subscribe(this.set.bind(this, 'character-level'));

    this.
        on('character-level').
        select(function (lvl) { return Math.ceil(lvl / 4) + 1; }).
        subscribe(this.set.bind(this, 'proficiency-bonus'));

    this.
        on('perception-bonus').
        select(function (pb) { return (pb || 0) + 10; }).
        subscribe(this.set.bind(this, 'passive-perception'));

    this.
        on('dexterity-bonus').
        subscribe(this.set.bind(this, 'initiative-bonus'));
}

Character.Abilities = Abilities;
Character.Skills = Skills;

module.exports = Model.extend(Character, {
    _calculateLevels: function (txt) {
        var lvl = 0;

        txt = txt || '1';
        txt.replace(/(\d+)/g, function (m, l) { lvl += parseInt(l, 10); });

        return lvl;
    }
});
