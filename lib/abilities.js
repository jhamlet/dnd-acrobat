var Model = require('./model'),
    // document = require('./document'),
    _ = require('underscore'),
    ABILITIES = [
        {
            name: 'strength',
            abbr: 'Str'
        },
        {
            name: 'dexterity',
            abbr: 'Dex'
        },
        {
            name: 'constitution',
            abbr: 'Con'
        },
        {
            name: 'intelligence',
            abbr: 'Int'
        },
        {
            name: 'wisdom',
            abbr: 'Wis'
        },
        {
            name: 'charisma',
            abbr: 'Cha'
        }
    ];

function Abilities (parent) {
    Abilities.superclass.call(
        this,
        ABILITIES.
            reduce(function (acc, cur) {
                acc[cur.name] = _.extend({ score: 0, bonus: 0 }, cur);
                return acc;
            }, { parent: parent})
    );

    parent.once('init', this.init.bind(this));
}

module.exports = Model.extend(Abilities, {
    get keys () {
        return ABILITIES.map(_.property('name'));
    },

    init: function () {
        var updateScore = this.updateScore.bind(this),
            onScoreBlurred = this.onScoreBlurred.bind(this);

        this.on('score-changed', this.onScoreChanged.bind(this));
        this.on('bonus-changed', this.onBonusChanged.bind(this));

        // setup the initial values
        ABILITIES.
            forEach(function (abil) {
                var abbr = abil.abbr,
                    name = abil.name,
                    field = document.getField(abbr + 'Score'),
                    fn = onScoreBlurred.bind(null, name);

                updateScore(name, field.value);
                document.on(abbr + 'Score', 'blur', fn);
            });

        this.init = _.noop;
    },

    updateBonus: function (ability, bonus) {
        var abil = this[ability],
            prev = abil.bonus;

        if (prev !== bonus) {
            abil.bonus = bonus;
            this.emit('bonus-changed', ability, bonus);
        }
    },

    updateScore: function (ability, value) {
        var abil = this[ability],
            prev = abil.score;

        value = parseInt(value, 10);

        if (value !== prev) {
            abil.score = value;
            this.emit('score-changed', ability, value);
        }
    },

    onScoreChanged: function (ability, value) {
        var bonus = Math.floor((value - 10) / 2);
        this.updateBonus(ability, bonus);
    },

    onBonusChanged: function (ability, bonus) {
        var abbr = _.where(ABILITIES, { name: ability })[0].abbr,
            field = document.getField(abbr + 'Mod');

        field.value = (bonus >= 0 ? '+' : '-') + Math.abs(bonus);
    },

    onScoreBlurred: function (ability, e) {
        var field = e.target;
        this.updateScore(ability, field.value);
    }
});

