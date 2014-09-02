YUI.add('aui-base-tests', function(Y) {

    var caseStrings = ['liferay', 'Liferay', 'cAPITAL', 'Capital', 'word-dash', 'Word-dash'],
        containStrings = ['alongstring', 'a-different-string', 'anotherstring123'],
        endsWithStrings = [
            'lorem-ipsum',
            'lorem ipsum',
            'loremipsumdolor',
            'lorem'
        ],
        endsWithStringsSuffixes = [
            'ipsum',
            ' ipsum',
            'dolor',
            'm'
        ],
        entityCharacters = ['!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~'],
        entityNames = ['', '', '', '', '', '&amp;', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '&lt;', '', '&gt;', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        entityNumbers = ['&#33;', '&#34;', '&#35;', '&#36;', '&#37;', '&#38;', '&#39;', '&#40;', '&#41;', '&#42;', '&#43;', '&#44;', '&#45;', '&#46;', '&#47;', '&#48;', '&#49;', '&#50;', '&#51;', '&#52;', '&#53;', '&#54;', '&#55;', '&#56;', '&#57;', '&#58;', '&#59;', '&#60;', '&#61;', '&#62;', '&#63;', '&#64;', '&#65;', '&#66;', '&#67;', '&#68;', '&#69;', '&#70;', '&#71;', '&#72;', '&#73;', '&#74;', '&#75;', '&#76;', '&#77;', '&#78;', '&#79;', '&#80;', '&#81;', '&#82;', '&#83;', '&#84;', '&#85;', '&#86;', '&#87;', '&#88;', '&#89;', '&#90;', '&#91;', '&#92;', '&#93;', '&#94;', '&#95;', '&#96;', '&#97;', '&#98;', '&#99;', '&#100;', '&#101;', '&#102;', '&#103;', '&#104;', '&#105;', '&#106;', '&#107;', '&#108;', '&#109;', '&#110;', '&#111;', '&#112;', '&#113;', '&#114;', '&#115;', '&#116;', '&#117;', '&#118;', '&#119;', '&#120;', '&#121;', '&#122;', '&#123;', '&#124;', '&#125;', '&#126;'],
        escapedEntities = ['&amp;', '&lt;', '&gt;', '&#034;', '&#039;', '&#047;', '&#096;'],
        nl2brStrings = [
            'lorem-ipsum-dolor\r\n, lorem-ipsum!',
            'lorem?\r',
            'lorem ipsum dolor\n lorem-ipsum dolor.',
            'Lorem ipsum\n\r lorem-ipsum-dolor-sit-amet \r dolor.'
        ],
        nl2brStringsOutput = [
            'lorem-ipsum-dolor<br />, lorem-ipsum!',
            'lorem?\r',
            'lorem ipsum dolor<br /> lorem-ipsum dolor.',
            'Lorem ipsum<br />\r lorem-ipsum-dolor-sit-amet \r dolor.'
        ],
        numbersToPad = [1, 10, 2.5, 6.789, 123.4, 3000.3102, .5, .10001, 500000.0],
        pluralizedStrings = [
            'apples',
            'fish',
            'mailmen',
            'octopi'
        ],
        prefixedStrings = [
            'blacksmith',
            'goldsmith',
            'john smith',
            'smithereens',
            'swordsmith',
            'wordsmith'
        ],
        prefixLessStrings = [
            'smith',
            'smith',
            'smith',
            'ereens',
            'smith',
            'smith'
        ],
        prefixStrings = [
            'black',
            'gold',
            'john ',
            'smith',
            'sword',
            'word'
        ],
        regExCharacters = ['(', ')', '^', '$', '.', '*', '?', '/', '+', '|', '[', ']', '\\'],
        singularStrings = [
            'apple',
            'fish',
            'mailman',
            'octopus'
        ],
        symbolEntities = ['&','<','>','"','\'','/','`'],
        uncamelizedStrings = [
            'lorem-ipsum-dolor-sit-amet',
            'LorEm-Ipsum-dolor-sit-AMET',
            'Lorem-Ipsum-doLOR. sit-amet +1',
            'lorem-ipsum-dolor-sit-amet, LOREM-ipsum-D&OLOR',
            'Lorem-ipsum-dolor-sit-amet. lorem-ipsum-dolor-sit-amet, lorem-Ipsum-Dolor-Sit-Amet'
        ];

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('aui-base');

    suite.add(new Y.Test.Case({

        getPrecisionPrePostDecimal: function(number) {
            var split = number.toString().split('.');

            return {
                pre: split[0].length,
                post: split[1] ? split[1].length : 0
            };
        },

        'should unescape symbols as HTML entities': function() {
            var escaped = [];

            for (var i = 0; i < symbolEntities.length; i++) {
                escaped.push(Y.Lang.String.unescapeHTML(symbolEntities[i]));
            }

            for (var j = 0; j < escapedEntities.length; j++) {
                Assert.areEqual(escaped[i], escapedEntities[i]);
            }
        },

        'should escape HTML entities as symbols': function() {
            var symbols = [];

            for (var i = 0; i < escapedEntities.length; i++) {
                symbols.push(Y.Lang.String.unescapeHTML(escapedEntities[i]));
            }

            for (var j = 0; j < symbolEntities.length; j++) {
                Assert.areEqual(symbols[i], symbolEntities[i]);
            }
        },

        'should camelize strings correctly': function() {
            for (var i = 0; i < uncamelizedStrings.length; i++) {
                var toBeCamelized = uncamelizedStrings[i],
                    camelized = Y.Lang.String.camelize(toBeCamelized),
                    capitalIndices = [],
                    character = null,
                    dashCount = 0;

                //find the dash and capitalized indicies
                for (var j = 0; j < toBeCamelized.length; j++) {
                    character = toBeCamelized[j];

                    if (character === '-') {
                        capitalIndices.push(j - dashCount);

                        dashCount++;
                    }
                    else if (character.toUpperCase() === character) {
                        capitalIndices.push(j - dashCount);
                    }
                }

                //ensure the result is camelized
                for (var k = 0; k < camelized.length; k++) {
                    character = camelized[k];

                    if (Y.Array.indexOf(capitalIndices, k) === -1) {
                        Assert.areSame(character.toLowerCase(), character);
                    }
                    else {
                        Assert.areSame(character.toUpperCase(), character);
                    }
                }
            }
        },

        'should pad numbers correctly': function() {
            for (var i = 0; i < numbersToPad.length; i++) {
                var toBePadded = numbersToPad[i],
                    toBePaddedLengths = this.getPrecisionPrePostDecimal(toBePadded),
                    length = null,
                    padded = null,
                    paddedLengths = null
                    precision = null;

                for (var j = 0; j < 20; j++) {
                    length = Math.max(toBePaddedLengths.post, j);
                    precision = Math.max(toBePaddedLengths.pre, j);
                    padded = Y.Lang.String.padNumber(toBePadded, precision, length);
                    paddedLengths = this.getPrecisionPrePostDecimal(padded);

                    Assert.isTrue(Y.Lang.isString(padded));
                    Assert.isTrue(Y.Lang.isNumber(parseFloat(toBePadded)));
                    Assert.areEqual(toBePadded, parseFloat(padded));
                    Assert.areEqual(paddedLengths.pre, precision);
                    Assert.areEqual(paddedLengths.post, length);
                }
            }
        },

        'should convert new lines("\\n" & "\\r") to line breaks("<br />")': function() {
            for (var i = 0; i < nl2brStrings.length; i++) {
                Assert.areEqual(Y.Lang.String.nl2br(nl2brStrings[i]),  nl2brStringsOutput[i]);
            }
        },

        'should escape regular expressions correctly': function() {
            for (var i = 0; i < regExCharacters.length; i++) {
                Assert.areEqual(Y.Lang.String.escapeRegEx(regExCharacters[i]), '\\'.concat(regExCharacters[i]));
            }
        },

        'should check for ending suffix correctly': function() {
            for (var i = 0; i < endsWithStrings.length; i++) {
                Assert.isTrue(Y.Lang.String.endsWith(endsWithStrings[i], endsWithStringsSuffixes[i]));
            }
        },

        'should pluralize known words correctly': function() {
            for (var i = 0; i < singularStrings.length; i++) {
                Assert.areEqual(Y.Lang.String.pluralize(0, singularStrings[i], pluralizedStrings[i]), '0 '.concat(pluralizedStrings[i]));
                Assert.areEqual(Y.Lang.String.pluralize(1, singularStrings[i], pluralizedStrings[i]), '1 '.concat(singularStrings[i]));
                Assert.areEqual(Y.Lang.String.pluralize(2, singularStrings[i], pluralizedStrings[i]), '2 '.concat(pluralizedStrings[i]));
                Assert.areEqual(Y.Lang.String.pluralize(3, singularStrings[i], pluralizedStrings[i]), '3 '.concat(pluralizedStrings[i]));
                Assert.areEqual(Y.Lang.String.pluralize(4, singularStrings[i], pluralizedStrings[i]), '4 '.concat(pluralizedStrings[i]));
            }
        },

        'should prefix a string with a given string (does not work if the prefix is already appended) correctly': function() {
            var prefixStringsLength = prefixStrings.length;

            Assert.isTrue((prefixStringsLength == prefixLessStrings.length) && (prefixStringsLength == prefixedStrings.length))

            for (var i = 0; i < prefixStringsLength; i++) {
                Assert.areEqual(Y.Lang.String.prefix(prefixStrings[i], prefixLessStrings[i]), prefixedStrings[i]);
            }
        },

        'should default to string correctly': function () {
            Assert.areEqual('default', Y.Lang.String.defaultValue('', 'default'));
            Assert.areEqual('', Y.Lang.String.defaultValue('', undefined));
            Assert.areEqual('default', Y.Lang.String.defaultValue(undefined, 'default'));
            Assert.areNotEqual(undefined, Y.Lang.String.defaultValue('string', undefined));
            Assert.areNotEqual('default', Y.Lang.String.defaultValue('string', 'default'));
        },

        'should search strings correctly': function () {
            for (var i = 0; i < containStrings.length; i++) {
                var testString = containStrings[i],
                    testSubString = testString.substring(0, testString.length - 3);

                Assert.isTrue(Y.Lang.String.contains(testString, testSubString));
                Assert.isFalse(Y.Lang.String.contains(testString, 'abcdefghijkl'));
            }
        },

        'should capitalize words correctly': function () {
            for (var i = 0; i < caseStrings.length; i+=2) {
                var actual = caseStrings[i],
                    expected = caseStrings[i+1];

                Assert.areNotEqual(expected, actual);
                Assert.areEqual(expected, Y.Lang.String.capitalize(actual));
            }
        },

        'should unescape HTML entities correctly': function() {
            var entityCharactersLength = entityCharacters.length,
                entityName;

            Assert.isTrue((entityCharactersLength == entityNumbers.length) && (entityCharacters.length == entityNames.length))

            for (var i = 0; i < entityCharactersLength; i++) {
                Assert.areEqual(Y.Lang.String._unescapeEntitiesUsingDom(entityNumbers[i]), entityCharacters[i]);

                entityName = entityNames[i];

                if (entityName != '') {
                    Assert.areEqual(Y.Lang.String._unescapeEntitiesUsingDom(entityName), entityCharacters[i]);
                }
            }
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['test', 'aui-base']
});
