var Model = require('../'),
    Abilities = require('./abilities'),
    Skills = require('./skills'),
    Traits = require('./traits');

function Character () {
    Character.superclass.call(this);

    this.
        on('character-level').
        select(function (lvl) { return Math.ceil(lvl / 4) + 1; }).
        subscribe(this.set.bind(this, 'proficiency-bonus'));

    this.
        on('class-level').
        startWith('1').
        select(this._calculateLevels).
        subscribe(this.set.bind(this, 'character-level'));

    this.
        on('perception-bonus').
        select(function (pb) { return (pb || 0) + 10; }).
        subscribe(this.set.bind(this, 'passive-perception'));

    this.
        on('dexterity-bonus').
        subscribe(this.set.bind(this, 'initiative-bonus'));

    this.traits     = new Traits(this);
    this.skills     = new Skills(this);
    this.abilities  = new Abilities(this);
}

Character.Abilities = Abilities;
Character.Skills = Skills;
Character.Traits = Traits;

module.exports = Model.extend(Character, {
    _calculateLevels: function (txt) {
        var lvl = 0;

        txt = txt || '1';
        txt.replace(/(\d+)/g, function (m, l) { lvl += parseInt(l, 10); });

        return lvl;
    }
});
