var buttonGeneratorApp = angular.module('buttonGenerator', []),
    labelNotSet = '-- not set --',
    enumerations = {
        units: [
            new CssPropertyModel('None', ''),
            new CssPropertyModel('Pixels', 'px'),
            new CssPropertyModel('Percent', '%'),
            new CssPropertyModel('Inch', 'in'),
            new CssPropertyModel('Centimeter', 'cm'),
            new CssPropertyModel('Millimeter', 'mm'),
            new CssPropertyModel('Em', 'em'),
            new CssPropertyModel('Ex', 'ex'),
            new CssPropertyModel('Point', 'pt'),
            new CssPropertyModel('Pica', 'pc')
        ], basic: {
            display: [
                new CssPropertyModel(labelNotSet, 'none'),
                new CssPropertyModel('Block', 'block'),
                new CssPropertyModel('Inline', 'inline'),
                new CssPropertyModel('List Item', 'list-item')
            ]
        }, border: {
            style: [
                new CssPropertyModel(labelNotSet, 'none'),
                new CssPropertyModel('Hidden', 'hidden'),
                new CssPropertyModel('Dotted', 'dotted'),
                new CssPropertyModel('Dashed', 'dashed'),
                new CssPropertyModel('Solid', 'solid'),
                new CssPropertyModel('Double', 'double'),
                new CssPropertyModel('Groove', 'groove'),
                new CssPropertyModel('Ridge', 'ridge'),
                new CssPropertyModel('Inset', 'inset'),
                new CssPropertyModel('Outset', 'outset')
            ]
        }, font: {
            weight: [
                new CssPropertyModel('Normal', 'normal'),
                new CssPropertyModel('Lighter', 'lighter'),
                new CssPropertyModel('Bold', 'bold'),
                new CssPropertyModel('Bolder', 'bolder')
            ],
            style: [
                new CssPropertyModel('Normal', 'normal'),
                new CssPropertyModel('Italic', 'italic'),
                new CssPropertyModel('Oblique', 'oblique'),
                new CssPropertyModel('Inherit', 'inherit')
            ],
            variant: [
                new CssPropertyModel('Normal', 'normal'),
                new CssPropertyModel('Small Caps', 'small-caps'),
                new CssPropertyModel('Inherit', 'inherit')
            ]
        }, shadow: {
            position: [
                new CssPropertyModel('Inside', 'inset'),
                new CssPropertyModel('Outside', '')
            ]
        }, misc: {
            verticalAlign: [
                new CssPropertyModel('Baseline', 'baseline'),
                new CssPropertyModel('Bottom', 'bottom'),
                new CssPropertyModel('Middle', 'middle'),
                new CssPropertyModel('Sub', 'sub'),
                new CssPropertyModel('Super', 'super'),
                new CssPropertyModel('Text Bottom', 'text-bottom'),
                new CssPropertyModel('Text Top', 'text-top'),
                new CssPropertyModel('Top', 'top'),
                new CssPropertyModel('Inherit', 'inherit')
            ]
        }
    };

function CssPropertyModel(label, cssValue) {
    this.label = label;
    this.cssValue = cssValue;
}

function SimplePropertyModel(label, cssName, defaultValue, units) {
    return {
        label: label,
        value: defaultValue,
        units: units || enumerations.units[0],
        getCss: function () {
            if (angular.isString(this.value) && this.value === '') {
                return '';
            }
            return (cssName ? cssName + ': ' : '') +
                (this.value.constructor === CssPropertyModel ? this.value.cssValue : this.value) +
                (this.units.constructor === CssPropertyModel ? this.units.cssValue : this.units) + ';\r\n'
        }
    }
}

function OptionalPropertyModel(label, cssName, values, defaultValueIdx) {
    var me = new SimplePropertyModel(label, cssName, values[defaultValueIdx]);
    me.options = values;
    me.constructor = arguments.callee;
    return me;
}

function ComplexPropertyModel(label, cssName, components) {
    var me = new SimplePropertyModel(label, cssName, '');
    me.getCss = function () {
        if (!angular.isArray(components)) {
            return '';
        }
        var cssString = cssName + ':', component;
        for (component in components) {
            cssString += ' ' + component.getCss();
        }
        return cssString;
    };
    me.constructor = arguments.callee;
    return me;
}

buttonGeneratorApp.controller('ButtonGeneratorCtrl', function ButtonGeneratorCtrl($scope) {
    $scope._defaults = {
        basic: {
            title: 'Basic options',
            order: 1,
            properties: [
                new SimplePropertyModel('Width', 'width', 100, enumerations.units[2]),
                new OptionalPropertyModel('Display', 'display', enumerations.basic.display, 1),
                new SimplePropertyModel('Height', 'height', 24, enumerations.units[1])
            ]
        }, border: {
            title: 'Border',
            order: 2,
            properties: [
                new SimplePropertyModel('Width', 'border-width', 1, enumerations.units[1]),
                new OptionalPropertyModel('Style', 'border-style', enumerations.border.style, 4),
                new SimplePropertyModel('Color', 'border-color', '#CCCCCC', enumerations.units[0]),
                new SimplePropertyModel('Radius', 'border-radius', '4px 4px 4px 4px', enumerations.units[0])
            ]
        }, font: {
            title: 'Font',
            order: 3,
            properties: [
                new SimplePropertyModel('Family', 'font-family', '', enumerations.units[0]),
                new SimplePropertyModel('Color', 'color', '#555555', enumerations.units[0]),
                new SimplePropertyModel('Size', 'font-size', 14, enumerations.units[1]),
                new OptionalPropertyModel('Weight', 'font-weight', enumerations.font.weight, 0),
                new OptionalPropertyModel('Style', 'font-style', enumerations.font.style, 0),
                new OptionalPropertyModel('Variant', 'font-variant', enumerations.font.variant, 0),
                new SimplePropertyModel('Padding', 'padding', '6px 12px', enumerations.units[0]),
                new SimplePropertyModel('Line Height', 'line-height', 1.42857, enumerations.units[0])
            ]
        }, background: {
            title: 'Background',
            order: 4,
            properties: [
                new SimplePropertyModel('Color', 'background-color', '#FFFFFF', enumerations.units[0])
            ]
        }/*, shadow: {
         title: 'Shadow',
         order: 5,
         properties: [
         new OptionalPropertyModel('Position', '', enumerations.shadow.position, 1),
         new SimplePropertyModel('Color', '', 'rgba(0, 0, 0, 0.075)', enumerations.units[0]),
         new SimplePropertyModel('Offset X', '', 1, enumerations.units[1]),
         new SimplePropertyModel('Offset Y', '', 1, enumerations.units[1]),
         new SimplePropertyModel('Blur', '', 0, enumerations.units[1]),
         new SimplePropertyModel('Spread', '', 0, enumerations.units[1])
         ]
         }*/, misc: {
            title: 'Miscellaneous',
            order: 6,
            properties: [
                new SimplePropertyModel('Transitions', 'transitions', 'border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s', enumerations.units[0]),
                new OptionalPropertyModel('Vertical Align', 'vertical-align', enumerations.misc.verticalAlign, 2)
            ]
        }
    };
    $scope.enumerations = enumerations;
    $scope.model = $scope._defaults;
    $scope.$watch('model', function () {
        buildStyle();
    }, true);
    function buildStyle() {
        var cssString = '', cssDisplayString = '', propGroupName, propGroup, prop;
        angular.forEach($scope.model, function (value, key) {
            if (!angular.isArray(value.properties)) {
                return;
            }
            var curCss;
            angular.forEach(value.properties, function (value, key) {
                curCss = value.getCss();
                if (angular.isString(curCss) && curCss.length === 0) {
                    return;
                }
                cssString += ' ' + value.getCss();
                cssDisplayString += '\t' + value.getCss();
            });
        });
        $scope.buttonStyle = cssString;
        $scope.displayStyle = '.beatyButton {\r\n' + cssDisplayString + '}';
    }
});

buttonGeneratorApp.filter('orderObjectBy', function () {
    return orderObjectBy;
});

function orderObjectBy(input, attribute) {
    if (!angular.isObject(input)) return input;

    var array = [];
    for (var objectKey in input) {
        array.push(input[objectKey]);
    }

    array.sort(function (a, b) {
        a = parseInt(a[attribute]);
        b = parseInt(b[attribute]);
        return a - b;
    });
    return array;
}