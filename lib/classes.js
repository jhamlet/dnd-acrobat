var Model = require('./model'),
    CLASS_REGEXP = /([\w-]+)\s*(\d+)/g;

function Classes (parent) {
    Classes.superclass.call(this, {
        parent: parent,
        _value: '',
        _classes: [],
        proficiency: 0
    });

    parent.once('init', this.init.bind(this));
}

module.exports = Model.extend(Classes, {
    init: function () {

        document.on('ClassLevel', 'blur', this.onClassLevelBlurred.bind(this));

        this.on('changed', this.updateProficiencyBonus.bind(this));
        this.on('proficiency-bonus', function (value) {
            document.getField('ProfBonus').value =
                (value >= 0 ? '+' : '-') + value;
        });

        this.onClassLevelBlurred({ target: document.getField('ClassLevel') });
    },

    updateClassLevel: function (txt) {
        var classes = this._classes;

        classes.length = 0;

        txt.
            replace(CLASS_REGEXP, function (m, c, l) {
                classes.push({ name: c, level: parseInt(l, 10) });
            });

        this.emit(
            'changed',
            classes.reduce(function (acc, cur) {
                acc[cur.name] = cur.level;
                acc.total += cur.level;
                return acc;
            }, { total: 0 })
        );
    },

    updateProficiencyBonus: function (classlevels) {
        var total = classlevels.total,
            prev = this.proficiency,
            bonus = Math.ceil(total / 4) + 1;

        if (bonus !== prev) {
            this.proficiency = bonus;
            this.emit('proficiency-bonus', bonus);
        }
    },

    onClassLevelBlurred: function (e) {
        var field = e.target,
            prev = this._value,
            current = field.value;

        if (current !== prev) {
            this._value = current;
            this.updateClassLevel(current);
        }
    }
});

