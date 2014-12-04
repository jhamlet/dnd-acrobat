var Model = require('./model'),
    WHITESPACE_REGEX = /\s+/g;

function Traits (parent) {
    Traits.superclass.call(this, {
        parent: parent,
        _value: '',
        _traits: {}
    });

    parent.once('init', this.init.bind(this));
}

module.exports = Model.extend(Traits, {
    _fieldName: 'FeaturesAndTraits',

    init: function () {
        document.on(
            this._fieldName,
            'blur',
            this.onFeaturesAndTraitsBlurred.bind(this)
        );

        this.onFeaturesAndTraitsBlurred({
            target: document.getField(this._fieldName)
        });
    },

    bonus: function (spec) {
        var type = spec.type,
            name = spec.name,
            aspect = this._traits[type],
            trait = aspect && aspect[name];

        return trait && trait(spec) || 0;
    },

    updateFeaturesAndTraits: function (txt) {
        this._traits = {};
    },

    onFeaturesAndTraitsBlurred: function (e) {
        var field = e.target,
            prev = this._value,
            current = field.value.replace(WHITESPACE_REGEX, '');

        if (current !== prev) {
            this._value = current;
            this.updateFeaturesAndTraits(current);
        }
    }
});
