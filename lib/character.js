/*globals ext*/
var Model = require('./model/character'),
    protean = ext.protean,
    util = require('./util');

function Character () {
    this.model = new Model();

    this.initAbilities();
    this.initClassLevel();
    this.initSaves();
    this.initSkills();

    this.
        model.
        on('passive-perception').
        subscribe(function (value) {
            document.getElementById('PassivePerception').field.value = value;
        });

    this.
        model.
        on('initiative-bonus').
        select(util.formatBonus).
        subscribe(function (mod) {
            document.getElementById('Initiative').field.value = mod;
        });
}

module.exports = protean.classify(Character, {
    initAbilities: function () {
        var model = this.model;

        Model.
            Abilities.
            keys.
            forEach(function (ability) {
                var abbr = util.upperCaseFirst(ability.slice(0, 3)),
                    abilityBonus = ability + '-bonus',
                    abilityScore = ability + '-score',
                    bonusEl = document.getElementById(abbr + 'Mod'),
                    scoreEl = document.getElementById(abbr + 'Score');

                // when the model changes update the bonus field
                model.
                    on(abilityBonus).
                    select(util.formatBonus).
                    // doAction(function (v) {
                    //     console.println(ability + ' bonus: ' + v);
                    // }).
                    subscribe(function (mod) { bonusEl.field.value = mod; });

                // when the score field changes update the model
                scoreEl.
                    on('blur').
                    select(util.eventTargetValue).
                    startWith(scoreEl.field.value).
                    select(util.toInteger).
                    // doAction(function (v) {
                    //     console.println(ability + ': ' + v);
                    // }).
                    subscribe(model.set.bind(model, abilityScore));

                model.set(util.toInteger(scoreEl.field.value));
            });
    },

    initClassLevel: function () {
        var model = this.model,
            levelEl = document.getElementById('ClassLevel'),
            profEl = document.getElementById('ProfBonus');

        model.
            on('proficiency-bonus').
            select(util.formatBonus).
            subscribe(function (prof) { profEl.field.value = prof; });

        levelEl.
            on('blur').
            select(util.eventTargetValue).
            subscribe(model.set.bind(model, 'class-level'));
    },

    initSaves: function () {
        var model = this.model;

        Model.
            Abilities.
            keys.
            forEach(function (ability) {
                var abbr = util.upperCaseFirst(ability.slice(0, 3)),
                    abilitySave = ability + '-save',
                    abilityProf = ability + '-proficiency',
                    saveEl = document.getElementById(abbr + 'Save'),
                    profEl = document.getElementById(abbr + 'SaveProf');

                model.
                    on(abilitySave).
                    select(util.formatBonus).
                    // doAction(function (v) {
                    //     console.println(ability + ' save bonus: ' + v);
                    // }).
                    subscribe(function (mod) { saveEl.field.value = mod; });

                profEl.
                    on('click').
                    select(util.eventTargetIsChecked).
                    startWith(profEl.field.isBoxChecked(0)).
                    select(Boolean).
                    // doAction(function (v) {
                    //     console.println(ability + ' save proficiency: ' + v);
                    // }).
                    subscribe(model.set.bind(model, abilityProf));
            });
    },

    initSkills: function () {
        var model = this.model;

        Model.
            Skills.
            keys.
            forEach(function (skill) {
                var key = skill.replace(/\s+/g, ''),
                    name = util.toCamelCase(skill),
                    skillEl = document.getElementById(name),
                    profEl = document.getElementById(name + 'Prof');

                model.
                    on(key + '-bonus').
                    // doAction(function (v) {
                    //     console.println(key + ' before formating: ' + v);
                    // }).
                    select(util.formatBonus).
                    // doAction(function (v) {
                    //     console.println(skill + ' bonus: ' + v);
                    // }).
                    subscribe(function (mod) { skillEl.field.value = mod; });

                profEl.
                    on('click').
                    select(util.eventTargetIsChecked).
                    startWith(profEl.field.isBoxChecked(0)).
                    select(Boolean).
                    // doAction(function (v) {
                    //     console.println(skill + ' proficiency: ' + v);
                    // }).
                    subscribe(model.set.bind(model, key + '-proficiency'));
            });
    }
});
