/*globals ext*/
var _ = ext._;

_.extend(exports, {
    upperCaseFirst: function (txt) {
        return txt.slice(0, 1).toUpperCase() + txt.slice(1);
    },

    toCamelCase: function (txt) {
        return txt.
            split(/\s+/g).
            map(function (word) {
                return word.slice(0, 1).toUpperCase() + word.slice(1);
            }).
            join('');
    },

    toInteger: function (v) {
        return parseInt(v, 10) || 0;
    },

    toFloat: function (v) {
        return parseFloat(v) || 0;
    },

    formatBonus: function (value) {
        value = !_.isNumber(value) ? 0 : value;
        return (value > -1 ? '+' : '') + value;
    },

    eventTargetValue: function (e) {
        return e.target && e.target.value;
    },

    eventTargetIsChecked: function (e) {
        return e.target && e.target.isBoxChecked(0);
    }
});

