/**
 * The Image Cropper Component
 *
 * @module aui-image-cropper
 */

var CSS_IMAGE_CROPPER_CROP = A.getClassName('image', 'cropper', 'crop'),
    CSS_IMAGE_CROPPER_IMAGE = A.getClassName('image', 'cropper', 'image');
/**
 * A base class for Image Cropper.
 *
 * Check the [live demo](http://alloyui.com/examples/image-cropper/).
 *
 * @class A.ImageCropper
 * @extends A.Component
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 * @include http://alloyui.com/examples/image-cropper/basic-markup.html
 * @include http://alloyui.com/examples/image-cropper/basic.js
 */

var ImageCropper = A.Base.create('image-cropper', A.Widget, [
    A.WidgetCssClass
], {
    CONTENT_TEMPLATE: null,

    /**
     * Binds the events on the `A.ImageCropper` UI. Lifecycle.
     *
     * @method bindUI
     * @protected
     */
    bindUI: function() {
        var instance = this;

        instance._fireCropEventTask = A.debounce(instance._fireCropEvent, 10, instance);

        instance.after('xChange', instance._afterXChange);
        instance.after('yChange', instance._afterYChange);

        instance.after('cropHeightChange', instance._afterCropHeightChange);
        instance.after('cropWidthChange', instance._afterCropWidthChange);

        instance.after('minHeightChange', instance._afterMinHeightChange);
        instance.after('minWidthChange', instance._afterMinWidthChange);

        instance.after('movableChange', instance._afterMovableChange);
        instance.after('resizableChange', instance._afterResizableChange);
        instance.after('preserveRatioChange', instance._afterPreserveRatioChange);

        instance.after(['drag:drag', 'resize:resize'], instance._syncRegion);

        instance.after(
                ['xChange', 'yChange', 'cropWidthChange', 'cropHeightChange'],
            function(event) {
                instance._fireCropEventTask(event);
                instance._syncCropNodeUI();
            }
        );

        instance._bindDrag();
        instance._bindResize();

        A.after('windowresize', function() {
            instance._syncRegion();
            instance.syncUI();
        });
    },

    /**
     * Syncs the `A.ImageCropper` UI. Lifecycle.
     *
     * @method syncUI
     * @protected
     */
    syncUI: function() {

        this._syncImageSize();

        this._uiSetCropWidth(this.get('cropWidth'));
        this._uiSetCropHeight(this.get('cropHeight'));

        this._uiSetX(this.get('x'));
        this._uiSetY(this.get('y'));

        this._uiSetMovable(this.get('movable'));
        this._uiSetResizable(this.get('resizable'));

        this._syncBackgroundImage();
        this._syncCropNodeUI();
    },

    /**
     * Render the Image Cropper component instance. Lifecycle.
     *
     * @method renderUI
     * @protected
     */
    renderUI: function() {
        var boundingBox = this.get('boundingBox');

        this._cropNode = A.Node.create('<div class="' + CSS_IMAGE_CROPPER_CROP + '"></div>');
        this.get('image').addClass(CSS_IMAGE_CROPPER_IMAGE);

        boundingBox.append(this.get('image'));
        boundingBox.append(this._cropNode);
    },

    /**
     * Fires after the `minHeight` attribute changes.
     *
     * @method _afterMinHeightChange
     * @protected
     */
    _afterMinHeightChange: function(event) {
        this._uiSetMinHeight(event.newVal);
    },

    /**
     * Fires after the `minWidth` attribute changes.
     *
     * @method _afterMinWidthChange
     * @protected
     */
    _afterMinWidthChange: function(event) {
        this._uiSetMinWidth(event.newVal);
    },

    /**
     * Fires after `movable` attribute changes.
     *
     * @method _afterMovableChange
     * @param event
     * @protected
     */
    _afterMovableChange: function(event) {
        this._uiSetMovable(event.newVal);
    },

    /**
     * Fires after `preserveRatio` attribute changes.
     *
     * @method _afterPreserveRatioChange
     * @param event
     * @protected
     */
    _afterPreserveRatioChange: function(event) {
        this._uiSetPreserveRatio(event.newVal);
    },

    /**
     * Fires after `resizable` attribute changes.
     *
     * @method _afterResizableChange
     * @param event
     * @protected
     */
    _afterResizableChange: function(event) {
        this._uiSetResizable(event.newVal);
    },

    /**
     * Fire after `x` attribute changes.
     *
     * @method _afterXChange
     * @param event
     * @protected
     */
    _afterXChange: function(event) {
        this._uiSetX(event.newVal);
    },

    /**
     * Fire after `y` attribute changes.
     *
     * @method _afterYChange
     * @param event
     * @protected
     */
    _afterYChange: function(event) {
        this._uiSetY(event.newVal);
    },

    /**
     * Plug Drag into Image Cropper.
     *
     * @method _bindDrag
     * @protected
     */
    _bindDrag: function() {
        this._drag = new A.DD.Drag({
            node: this._cropNode,
            bubbleTargets: this
        }).plug(
            A.Plugin.DDConstrained, {
                constrain: this.get('image')
            }
        );
    },

    /**
     * Plug Resize into Image Cropper.
     *
     * @method _bindResize
     * @protected
     */
    _bindResize: function() {
        this._resize = new A.Resize({
            node: this._cropNode,
            bubbleTargets: this
        }).plug(
            A.Plugin.ResizeConstrained, {
                constrain: this.get('image'),
                preserveRatio: this.get('preserveRatio'),
                minHeight: this.get('minHeight'),
                minWidth: this.get('minWidth')
            }
        );
    },

    /**
     * Fire event of cropping a selected area.
     *
     * @method _fireCropEvent
     * @param event
     * @protected
     */
    _fireCropEvent: function(event) {
        this.fire('crop', {
            cropType: event.type
        });
    },

    /**
     * Get crop region (width/height/x/y).
     *
     * @method _getCropRegion
     * @return {Object}
     * @protected
     */
    _getCropRegion: function() {
        return {
            height: this.get('cropHeight'),
            width: this.get('cropWidth'),
            x: this.get('x'),
            y: this.get('y')
        };
    },

    /**
     * Set `cropHeight` attribute on the UI.
     *
     * @method _uiSetCropHeight
     * @param value
     * @protected
     */
    _uiSetCropHeight: function(value) {
        this._cropNode.height(value);
    },

    /**
     * Set `cropWidth` attribute on the UI.
     *
     * @method _uiSetCropWidth
     * @param value
     * @protected
     */
    _uiSetCropWidth: function(value) {
        this._cropNode.width(value);
    },

    /**
     * Set `minHeight` attribute on the UI.
     *
     * @method _uiSetMinHeight
     * @param value
     * @protected
     */
    _uiSetMinHeight: function(value) {
        this._resize.con.set('minHeight', value);
    },

    /**
     * Set `minWidth` attribute on the UI.
     *
     * @method _uiSetMinWidth
     * @param value
     * @protected
     */
    _uiSetMinWidth: function(value) {
        this._resize.con.set('minWidth', value);
    },

    /**
     * Set `movable` attribute on the UI.
     *
     * @method _uiSetMovable
     * @param value
     * @protected
     */
    _uiSetMovable: function(value) {
        this._drag.set('lock', !value);
    },

    /**
     * Set `preserveRatio` attribute on the UI.
     *
     * @method _uiSetPreserveRatio
     * @param value
     * @protected
     */
    _uiSetPreserveRatio: function(value) {
        this._resize.con.set('preserveRatio', value);
    },

    /**
     * Set `resizable` attribute on the UI.
     *
     * @method _uiSetResizable
     * @param value
     * @protected
     */
    _uiSetResizable: function(value) {
        if (value) {
            if (this._stopResizeHandle) {
                this._stopResizeHandle.detach();
            }
        }
        else if (!this._stopResizeHandle) {
            this._stopResizeHandle = this._resize.on(
                'resize:resize',
                function(event) {
                    event.halt();
                }
            );
        }
    },

    /**
     * Set `x` attribute on the UI.
     *
     * @method _uiSetX
     * @param value
     * @protected
     */
    _uiSetX: function(value) {
        this._cropNode.setStyle('left', value);
    },

    /**
     * Set `y` attribute on the UI.
     *
     * @method _uiSetY
     * @param value
     * @protected
     */
    _uiSetY: function(value) {
        this._cropNode.setStyle('top', value);
    },

    /**
     * Set `cropHeight` attribute on the UI.
     *
     * @method _setCropHeight
     * @param value
     * @protected
     */
    _setCropHeight: function(value) {
        var maxHeight = this.get('image').get('offsetHeight'),
            minHeight = this.get('minHeight');

        if (value < minHeight) {
            return minHeight;
        }
        else if (value >= maxHeight) {
            return maxHeight;
        }
        return value;
    },

    /**
     * Set `cropWidth` attribute on the UI.
     *
     * @method _setCropWidth
     * @param value
     * @protected
     */
    _setCropWidth: function(value) {
        var maxWidth = this.get('image').get('offsetWidth'),
            minWidth = this.get('minWidth');

        if (value < minWidth) {
            return minWidth;
        }
        else if (value >= maxWidth) {
            return maxWidth;
        }
        return value;
    },

    /**
     * Set `x` attribute on the UI.
     *
     * @method _setX
     * @param value
     * @protected
     */
    _setX: function(value) {
        var maxWidth = this.get('image').get('offsetWidth'),
            width = this.get('cropWidth');

        if (value < 0) {
            return 0;
        }
        else if (value + width > maxWidth) {
            return maxWidth - width;
        }

        return Math.round(value);
    },

    /**
     * Set `y` attribute on the UI.
     *
     * @method _setY
     * @param value
     * @protected
     */
    _setY: function(value) {
        var maxHeight = this.get('image').get('offsetHeight'),
            height = this.get('cropHeight');

        if (value < 0) {
            return 0;
        }
        else if (value + height > maxHeight) {
            return maxHeight - height;
        }

        return Math.round(value);
    },

    /**
     * Sync background image.
     *
     * @method _syncBackgroundImage
     * @protected
     */
    _syncBackgroundImage: function() {
        this._cropNode.setStyle('backgroundImage', 'url(' + this.get('image').get('src') + ')');
    },

    /**
     * Sync crop node on the UI.
     *
     * @method _syncCropNodeUI
     * @protected
     */
    _syncCropNodeUI: function() {
        this._cropNode.setStyle('backgroundPosition', (-this.get('x')) + 'px ' + (-this.get('y')) +
            'px');
        this._cropNode.setStyle('backgroundSize', this.get('image').width() + 'px ' +
            this.get('image').height() + 'px');
    },

    /**
     * Sync the image width and height.
     *
     * @method _syncImageSize
     */
    _syncImageSize: function() {
        this._imageWidth = this.get('image').width();
        this._imageHeight = this.get('image').height();
    },

    /**
     * Sync region (top/bottom/left/right).
     *
     * @method _syncRegion
     * @param event
     * @protected
     */
    _syncRegion: function() {
        var nodeWidth = this.get('image').get('offsetWidth'),
            nodeHeigth = this.get('image').get('offsetHeight');

        this.set('cropHeight', Math.round(this._cropNode.get('offsetHeight') * nodeHeigth) / this._imageHeight);
        this.set('cropWidth', Math.round(this._cropNode.get('offsetWidth') * nodeWidth) / this._imageWidth);

        this.set('x', (A.Lang.toInt(this._cropNode.getStyle('left')) * nodeWidth / this._imageWidth));
        this.set('y', (A.Lang.toInt(this._cropNode.getStyle('top')) * nodeHeigth / this._imageHeight));
    },

    /**
     * Validates the value of cropWidth and cropHeight attributes.
     *
     * @method _validateDimension
     * @param value
     * @protected
     * @return {Boolean} True if vaule is greater-than 0.
     */
    _validateDimension: function(value) {
        if (A.Lang.isNumber(value)) {
            return value >= 0;
        }
        return false;
    }

}, {
    /**
     * Static property provides a string to identify the CSS prefix.
     *
     * @property CSS_PREFIX
     * @type String
     */
    CSS_PREFIX: A.getClassName('image-cropper'),

    ATTRS: {

        /**
         * The height of a selected area to crop.
         *
         * @attribute cropHeight
         * @default 100
         * @type Number
         */
        cropHeight: {
            setter: '_setCropHeight',
            validator: '_validateDimension',
            value: 100
        },

        /**
         * The width of a selected area to crop.
         *
         * @attribute cropWidth
         * @default 100
         * @type Number
         */
        cropWidth: {
            setter: '_setCropWidth',
            validator: '_validateDimension',
            value: 100
        },

        image: {
            setter: A.one
        },
        /**
         * The minimum width of a selected area to crop.
         *
         * @attribute minWidth
         * @default 0
         * @type Number
         */
        minWidth: {
            lazyAdd: false,
            validator: '_validateDimension',
            value: 0
        },

        /**
         * The minimum height of a selected area to crop.
         *
         * @attribute minHeight
         * @default 0
         * @type Number
         */
        minHeight: {
            lazyAdd: false,
            validator: '_validateDimension',
            value: 0
        },

        /**
         * Determine if the crop area should move or not.
         *
         * @attribute movable
         * @default true
         * @type Boolean
         */
        movable: {
            value: true,
            validator: A.Lang.isBoolean
        },

        /**
         * Determine if the crop area should preserve the
         * aspect ratio or not.
         *
         * @attribute preserveRatio
         * @default false
         * @type Boolean
         */
        preserveRatio: {
            value: false,
            validator: A.Lang.isBoolean
        },

        /**
         * Determine the region of a selected area to crop.
         *
         * @attribute region
         * @default {}
         * @type Object
         */
        region: {
            getter: '_getCropRegion',
            value: {}
        },

        /**
         * Determine if the crop area should resize or not.
         *
         * @attribute resizable
         * @default true
         * @type Boolean
         */
        resizable: {
            value: true,
            validator: A.Lang.isBoolean
        },

        /**
         * The X position of a selected area to crop.
         *
         * @attribute x
         * @default 0
         * @type Number
         */
        x: {
            value: 0,
            setter: '_setX',
            validator: A.Lang.isNumber
        },

        /**
         * The Y position of a selected area to crop.
         *
         * @attribute y
         * @default 0
         * @type Number
         */
        y: {
            value: 0,
            setter: '_setY',
            validator: A.Lang.isNumber
        }
    },

    HTML_PARSE: {

    }
});

A.ImageCropper = ImageCropper;
