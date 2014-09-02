/**
 * The Audio Component
 *
 * @module aui-audio
 */

var Lang = A.Lang,
    UA = A.UA,

    owns = A.Object.owns,

    getClassName = A.getClassName,

    CSS_AUDIO_NODE = getClassName('audio', 'node'),

    TPL_AUDIO_FALLBACK = '<div class="' + CSS_AUDIO_NODE + '"></div>',
    TPL_AUDIO = '<audio id="{0}" controls class="' + CSS_AUDIO_NODE + '"></audio>',
    TPL_FLASH =
    '<object id="{id}" {applicationType} height="{height}" width="{width}">{movie}{fixedAttributes}{flashVars}</object>',

    REGEX_FILE_EXTENSION = /\.([^\.]+)$/;

/**
 * A base class for Audio.
 *
 * Check the [live demo](http://alloyui.com/examples/audio/).
 *
 * @class A.Audio
 * @extends A.Component
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 * @include http://alloyui.com/examples/audio/basic-markup.html
 * @include http://alloyui.com/examples/audio/basic.js
 */
var AudioImpl = A.Component.create({
    /**
     * Static property provides a string to identify the class.
     *
     * @property NAME
     * @type String
     * @static
     */
    NAME: 'audio',

    /**
     * Static property used to define the default attribute
     * configuration for the Audio.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {

        /**
         * Sets the `aria-role` for Audio.
         *
         * @attribute role
         * @type String
         */
        role: {
            value: 'application',
            validator: Lang.isString
        },

        /**
         * The height of Audio's fallback using Flash.
         *
         * @attribute swfHeight
         * @default 30
         * @type String
         */
        swfHeight: {
            value: '30',
            validator: Lang.isString
        },

        /**
         * The width of Audio's fallback using Flash.
         *
         * @attribute swfWidth
         * @default 100%
         * @type String
         */
        swfWidth: {
            value: '100%',
            validator: Lang.isString
        },

        /**
         * The type of audio.
         *
         * @attribute type
         * @default mp3
         * @type String
         */
        type: {
            value: 'mp3',
            validator: Lang.isString
        },

        /**
         * Boolean indicating if use of the WAI-ARIA Roles and States
         * should be enabled.
         *
         * @attribute useARIA
         * @default true
         * @type Boolean
         */
        useARIA: {
            value: true,
            validator: Lang.isBoolean,
            writeOnce: 'initOnly'
        }
    },

    /**
     * Static property used to define which component it extends.
     *
     * @property EXTENDS
     * @type String
     * @static
     */
    EXTENDS: A.WidgetMedia,

    /**
     * Static property used to define the attributes
     * for the bindUI lifecycle phase.
     *
     * @property BIND_UI_ATTRS
     * @type Array
     * @static
     */
    BIND_UI_ATTRS: ['url', 'oggUrl', 'swfUrl', 'fixedAttributes', 'flashVars'],

    prototype: {

        /**
         * Sync the Audio UI. Lifecycle.
         *
         * @method syncUI
         * @protected
         */
        syncUI: function() {
            var instance = this;

            if (instance.get('useARIA')) {
                instance.plug(A.Plugin.Aria, {
                    roleName: instance.get('role')
                });
            }
        },

        /**
         * Render Audio in DOM.
         *
         * @method _renderMedia
         * @param fallback
         * @protected
         */
        _renderMedia: function(fallback) {
            var instance = this;

            var tpl = TPL_AUDIO;

            if (UA.gecko && fallback) {
                tpl = TPL_AUDIO_FALLBACK;
            }

            var tplObj = Lang.sub(tpl, [A.guid()]);

            var audio = A.Node.create(tplObj);

            instance.get('contentBox').append(audio);

            instance._media = audio;

            return audio;
        },

        /**
         * Render SWF in DOM.
         *
         * @method _renderSwf
         * @protected
         */
        _renderSwf: function() {
            var instance = this;

            var swfUrl = instance.get('swfUrl');

            if (swfUrl) {
                var flashVars = instance.get('flashVars');

                instance._setMedia(flashVars);

                var flashVarString = A.QueryString.stringify(flashVars);

                if (instance._swfId) {
                    instance._media.removeChild(A.one('#' + instance._swfId));
                } else {
                    instance._swfId = A.guid();
                }

                var applicationType = 'type="application/x-shockwave-flash" data="' + swfUrl + '"';

                var movie = '';

                if (UA.ie) {
                    applicationType = 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"';

                    movie = '<param name="movie" value="' + swfUrl + '"/>';
                }

                var fixedAttributes = instance.get('fixedAttributes');

                var fixedAttributesParam = [];

                for (var attributeName in fixedAttributes) {
                    if (owns(fixedAttributes, attributeName)) {
                        fixedAttributesParam.push('<param name="', attributeName, '" value="', fixedAttributes[
                            attributeName], '" />');
                    }
                }

                var flashVarsParam = '';

                if (flashVarString) {
                    flashVarsParam = '<param name="flashVars" value="' + flashVarString + '" />';
                }

                var height = instance.get('swfHeight');

                var width = instance.get('swfWidth');

                var tplObj = Lang.sub(
                    TPL_FLASH, {
                        applicationType: applicationType,
                        id: instance._swfId,
                        fixedAttributes: fixedAttributesParam.join(''),
                        flashVars: flashVarsParam,
                        height: height,
                        movie: movie,
                        width: width
                    }
                );

                instance._media.append(tplObj);
            }
        },

        /**
         * Set media on `flashVars`.
         *
         * @method _setMedia
         * @param flashVars
         * @protected
         */
        _setMedia: function(flashVars) {
            var instance = this;

            if (!owns(flashVars, 'mp3') && !owns(flashVars, 'mp4') && !owns(flashVars, 'flv')) {
                var audioUrl = instance.get('url');

                var type = instance.get('type');

                if (!type) {
                    var typeMatch = REGEX_FILE_EXTENSION.exec(audioUrl);

                    if (typeMatch) {
                        type = typeMatch[1];
                    }
                }

                flashVars[type] = audioUrl;
            }
        },

        /**
         * Set the `oggUrl` on the UI.
         *
         * @method _uiSetOgvUrl
         * @param val
         * @protected
         */
        _uiSetOggUrl: function(val) {
            A.Audio.superclass._uiSetOggUrl(val, 'audio', 'audio/ogg');
        },

        /**
         * Set the `url` on the UI.
         *
         * @method _uiSetUrl
         * @param val
         * @protected
         */
        _uiSetUrl: function(val) {
            A.Audio.superclass._uiSetUrl(this, val, 'audio', 'audio/mp3');
        },

        /**
         * Provides the default value for the `swfUrl` attribute.
         *
         * @method _valueSwfUrl
         * @return String
         * @protected
         */
        _valueSwfUrl: function() {
            return A.config.base + 'aui-audio/assets/player.swf?t=' + Lang.now();
        }
    }
});

A.Audio = AudioImpl;