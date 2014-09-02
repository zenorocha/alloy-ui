/**
 * The Widget Media Utility
 *
 * @module aui-widget-media
 */

var Lang = A.Lang,
    UA = A.UA,
    DOC = A.config.doc;

/**
 * A base class for Widget Media.
 *
 * @class A.WidgetMedia
 * @constructor
 */
var WidgetMedia = A.Component.create({
    /**
     * Static property used to define the default attribute configuration.
     *
     * @property ATTRSs
     * @type Object
     * @static
     */
    ATTRS: {

        /**
         * Variables used by Flash player.
         *
         * @attribute flashVars
         * @default {}
         * @type Object
         */
        flashVars: {
            value: {},
            validator: Lang.isObject
        },

        /**
         * An additional list of attributes.
         *
         * @attribute fixedAttributes
         * @default {}
         * @type Object
         */
        fixedAttributes: {
            value: {},
            validator: Lang.isObject
        },

        /**
         * URL (on .ogg format) used by Media to play.
         *
         * @attribute oggUrl
         * @default ''
         * @type String
         */
        oggUrl: {
            value: '',
            validator: Lang.isString
        },

        /**
         * If `true` the render phase will be automatically invoked
         * preventing the `.render()` manual call.
         *
         * @attribute render
         * @default true
         * @type Boolean
         */
        render: {
            value: true,
            validator: Lang.isBoolean
        },

        /**
         * URL (on .swf format) used by Media to create
         * a fallback player with Flash.
         *
         * @attribute swfUrl
         * @type String
         */
        swfUrl: {
            valueFn: '_valueSwfUrl',
            validator: Lang.isString
        },

        /**
         * URL used by Media to play.
         *
         * @attribute url
         * @default ''
         * @type String
         */
        url: {
            value: ''
        }
    },

    /**
     * Static property used to define the attributes
     * for the bindUI lifecycle phase.
     *
     * @property BIND_UI_ATTRS
     * @type Array
     * @static
     */
    BIND_UI_ATTRS: ['url', 'oggUrl', 'swfUrl', 'fixedAttributes', 'flashVars'],

    /**
     * Static property used to define the attributes
     * for the syncUI lifecycle phase.
     *
     * @property SYNC_UI_ATTRS
     * @type Array
     * @static
     */
    SYNC_UI_ATTRS: ['url', 'oggUrl'],

    prototype: {

        /**
         * Bind the events on the Media UI. Lifecycle.
         *
         * @method bindUI
         * @protected
         */
        bindUI: function() {
            var instance = this;

            instance.publish(
                'audioReady', {
                    fireOnce: true
                }
            );

            instance._media.on({
                pause: instance._onPause,
                play: instance._onPlay
            });
        },

        /**
         * Render the Media component instance. Lifecycle.
         *
         * @method renderUI
         * @protected
         */
        renderUI: function() {
            var instance = this;

            instance._renderMediaTask = A.debounce(instance._renderMedia, 1, instance);
            instance._renderSwfTask = A.debounce(instance._renderSwf, 1, instance);

            instance._renderMedia(!instance.get('oggUrl'));
        },

        /**
         * Load media track.
         *
         * @method load
         */
        load: function() {
            var instance = this;

            if (instance._media.hasMethod('load')) {
                instance._media.invoke('load');
            }
        },

        /**
         * Pause media track.
         *
         * @method pause
         */
        pause: function() {
            var instance = this;

            if (instance._media.hasMethod('pause')) {
                instance._media.invoke('pause');
            }
        },

        /**
         * Play media track.
         *
         * @method play
         */
        play: function() {
            var instance = this;

            if (instance._media.hasMethod('play')) {
                instance._media.invoke('play');
            }
        },

        /**
         * Create `source` element
         * using passed type attribute.
         *
         * @method _createSource
         * @param type
         * @protected
         */
        _createSource: function(type) {
            var sourceNode = new A.Node(DOC.createElement('source'));

            sourceNode.attr('type', type);

            return sourceNode;
        },

        /**
         * Fires on media pause event fires.
         *
         * @method _onPause
         * @param {EventFacade} event
         * @protected
         */
        _onPause: function(event) {

            this.fire('play', {
                cropType: event.type
            });
        },

        /**
         * Fires on media play event fires.
         *
         * @method _onPlay
         * @param {EventFacade} event
         * @protected
         */
        _onPlay: function(event) {

            this.fire('pause', {
                cropType: event.type
            });
        },

        /**
         * Set the `fixedAttributes` on the UI.
         *
         * @method _uiSetFixedAttributes
         * @param val
         * @protected
         */
        _uiSetFixedAttributes: function() {
            var instance = this;

            instance._renderSwfTask();
        },

        /**
         * Set the `flashVars` on the UI.
         *
         * @method _uiSetFlashVars
         * @param val
         * @protected
         */
        _uiSetFlashVars: function() {
            var instance = this;

            instance._renderSwfTask();
        },

        /**
         * Set the `oggUrl` on the UI.
         *
         * @method _uiSetOggUrl
         * @param val
         * @protected
         */
        _uiSetOggUrl: function(val, type, src) {
            var instance = this;

            if (UA.gecko || UA.opera) {
                var audio = instance._media;

                var usingMedia = instance._usingMedia(type);

                if ((!val && usingMedia) || (val && !usingMedia)) {
                    audio.remove(true);

                    audio = instance._renderMedia(!val);
                }

                if (!val) {
                    instance._renderSwfTask();
                } else {
                    var sourceOgg = instance._sourceOgg;

                    if (!sourceOgg) {
                        sourceOgg = instance._createSource(src);

                        audio.append(sourceOgg);

                        instance._sourceOgg = sourceOgg;
                    }

                    sourceOgg.attr('src', val);
                }
            }
        },

        /**
         * Set the `swfUrl` on the UI.
         *
         * @method _uiSetSwfUrl
         * @param val
         * @protected
         */
        _uiSetSwfUrl: function() {
            var instance = this;

            instance._renderSwfTask();
        },

        /**
         * Set the `url` on the UI.
         *
         * @method _uiSetUrl
         * @param val
         * @protected
         */
        _uiSetUrl: function(instance, val, type, src) {
            var oggUrl = instance.get('oggUrl');
            var media = instance._media;

            var source = instance._source;

            if (UA.gecko && !instance._usingMedia(type)) {
                if (source !== null) {
                    source.remove(true);

                    instance._source = null;
                }
            } else {
                if (media || !oggUrl) {
                    if (!source) {
                        source = instance._createSource(src);

                        media.append(source);

                        instance._source = source;
                    }

                    source.attr('src', val);
                }
            }

            instance._renderSwfTask();
        },

        /**
         * Check if it's a `media` node.
         *
         * @method _usingMedia
         * @protected
         */
        _usingMedia: function(type) {
            var instance = this;

            return (instance._media.get('nodeName').toLowerCase() === type);
        },

        /**
         * Provides the default value for the `swfUrl` attribute.
         *
         * @method _valueSwfUrl
         * @return String
         * @protected
         */
        _valueSwfUrl: function() {
            return '';
        }
    }
});

A.WidgetMedia = WidgetMedia;