var Model = require('./model');

function Saves (parent) {
    Saves.superclass.call(this, { parent: parent });
    parent.once('init', this.init.bind(this));
}

module.exports = Model.extend(Saves, {
    init: function () {
        var parent = this.parent,
            abilities = parent.abilities,
            update = this.update.bind(this);

        abilities.on('bonus-changed', update);
        parent.classes.on('proficiency-bonus', this.updateAll.bind(this));

        abilities.
            keys.
            forEach(function (ability) {
                var abbr = parent.abilities[ability].abbr,
                    id = abbr + 'SaveProf';

                document.on(id, 'click', function () {
                    update(ability, abilities[ability].bonus);
                });
            });

        this.updateAll();
    },

    updateAll: function () {
        var abilities = this.parent.abilities,
            update = this.update.bind(this);

        abilities.
            keys.
            forEach(function (ability) {
                update(ability, abilities[ability].bonus);
            });
    },

    update: function (ability, bonus) {
        var abbr = this.parent.abilities[ability].abbr,
            hasField = document.getField(abbr + 'SaveProf'),
            saveField = document.getField(abbr + 'Save'),
            isChecked = hasField.isBoxChecked(0),
            proficiency = this.parent.classes.proficiency || 0,
            save = bonus + (isChecked ? proficiency : 0);

        saveField.value = (save >= 0 ? '+' : '-') + save; 
        this.emit('changed', ability, save);
    }
});

