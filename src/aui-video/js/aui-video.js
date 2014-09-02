/**
 * The Video Component
 *
 * @module aui-video
 */

var Lang = A.Lang,
    UA = A.UA,
    getClassName = A.getClassName,

    CSS_VIDEO_NODE = getClassName('video', 'node'),

    TPL_VIDEO = '<video id="{id}" controls="controls" class="' + CSS_VIDEO_NODE + '" {height} {width}></video>',
    TPL_VIDEO_FALLBACK = '<div class="' + CSS_VIDEO_NODE + '"></div>';

/**
 * A base class for Video.
 *
 * Check the [live demo](http://alloyui.com/examples/video/).
 *
 * @class A.Video
 * @extends A.Component
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 * @include http://alloyui.com/examples/video/basic-markup.html
 * @include http://alloyui.com/examples/video/basic.js
 */
var Video = A.Component.create({
    /**
     * Static property provides a string to identify the class.
     *
     * @property NAME
     * @type String
     * @static
     */
    NAME: 'video',

    /**
     * Static property used to define the default attribute
     * configuration for the Video.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {

        /**
         * The required Flash version for the swf player
         *
         * @attribute flashPlayerVersion
         * @default '9,0,0,0'
         * @type String
         */
        flashPlayerVersion: {
            validator: Lang.isString,
            value: '9,0,0,0'
        },

        /**
         * Image displayed before playback starts.
         *
         * @attribute poster
         * @default ''
         * @type String
         */
        poster: {
            value: ''
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
    BIND_UI_ATTRS: ['poster'],

    /**
     * Static property used to define the attributes
     * for the syncUI lifecycle phase.
     *
     * @property SYNC_UI_ATTRS
     * @type Array
     * @static
     */
    SYNC_UI_ATTRS: ['poster'],

    prototype: {

        /**
         * Render Video in DOM.
         *
         * @method _renderMedia
         * @param fallback
         * @protected
         */
        _renderMedia: function(fallback) {
            var instance = this,
                attrHeight,
                attrWidth,
                height,
                tpl,
                tplObj,
                video,
                width;

            tpl = TPL_VIDEO;

            if (UA.gecko && fallback) {
                tpl = TPL_VIDEO_FALLBACK;
            } else {
                attrHeight = '';
                attrWidth = '';

                height = instance.get('height');

                width = instance.get('width');

                if (height) {
                    attrHeight = 'height="' + height + '"';
                }

                if (width) {
                    attrWidth = 'width="' + width + '"';
                }
            }

            tplObj = Lang.sub(
                tpl, {
                    height: attrHeight,
                    id: A.guid(),
                    width: attrWidth
                }
            );

            video = A.Node.create(tplObj);

            instance.get('contentBox').append(video);

            instance._media = video;
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
                var videoUrl = instance.get('url');
                var posterUrl = instance.get('poster');
                var flashVars = instance.get('flashVars');

                A.mix(
                    flashVars, {
                        controls: true,
                        src: videoUrl,
                        poster: posterUrl
                    }
                );

                var flashVarString = A.QueryString.stringify(flashVars);

                if (instance._swfId) {
                    instance._media.removeChild(A.one('#' + instance._swfId));
                } else {
                    instance._swfId = A.guid();
                }

                var tplObj = '<object id="' + instance._swfId + '" ';

                if (UA.ie) {
                    tplObj += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ' +
                        'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=' +
                        instance.get('flashPlayerVersion') + '" ';
                } else {
                    tplObj += 'type="application/x-shockwave-flash" data="' + swfUrl + '" ';
                }

                tplObj += 'height="100%" width="100%">';

                if (UA.ie) {
                    tplObj += '<param name="movie" value="' + swfUrl + '"/>';
                }

                var fixedAttributes = instance.get('fixedAttributes');

                for (var i in fixedAttributes) {
                    if (fixedAttributes.hasOwnProperty(i)) {
                        tplObj += '<param name="' + i + '" value="' + fixedAttributes[i] + '" />';
                    }
                }

                if (flashVarString) {
                    tplObj += '<param name="flashVars" value="' + flashVarString + '" />';
                }

                if (posterUrl !== '') {
                    tplObj += '<img src="' + posterUrl + '" alt="" />';
                }

                tplObj += '</object>';

                instance._media.append(tplObj);
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
            A.Video.superclass._uiSetOggUrl(val, 'video', 'video/ogg; codecs="theora, vorbis"');
        },

        /**
         * Set the `poster` on the UI.
         *
         * @method _uiSetPoster
         * @param val
         * @protected
         */
        _uiSetPoster: function(val) {
            var instance = this;

            var video = instance._media;

            if (instance._usingMedia('video')) {
                video.setAttribute('poster', val);
            }

            instance._renderSwfTask();
        },

        /**
         * Set the `url` on the UI.
         *
         * @method _uiSetUrl
         * @param val
         * @protected
         */
        _uiSetUrl: function(val) {
            A.Video.superclass._uiSetUrl(this, val, 'video', 'video/mp4;');
        },

        /**
         * Provides the default value for the `swfUrl` attribute.
         *
         * @method _valueSwfUrl
         * @return String
         * @protected
         */
        _valueSwfUrl: function() {
            return A.config.base + 'aui-video/assets/player.swf?t=' + Lang.now();
        }
    }
});

A.Video = Video;