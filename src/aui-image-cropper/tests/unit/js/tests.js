YUI.add('aui-image-cropper-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-image-cropper');

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',

        init: function() {
            this._container = Y.one('#container');
        },

        setUp: function() {
            this._container.setHTML(Y.one('.bounding-box').cloneNode(true));

            this.createImageCropper({
                boundingBox: Y.one('#container').one('.bounding-box'),
                image: Y.one('#container').one('img'),
                x: 100,
                y: 100
            });
        },

        tearDown: function() {
            this._imageCropper && this._imageCropper.destroy();
        },

        createImageCropper: function(config) {
            this._imageCropper = new Y.ImageCropper(config).render();
        },

        pixelValue: function(pixel) {
            return parseInt(pixel.replace(/px/g, ''));
        },

        'should change positon': function() {
            var instance = this,
                cropRegion = Y.one('.image-cropper-crop');

            instance._imageCropper.set('x', 200);
            instance._imageCropper.set('y', 150);

            Y.Assert.areEqual(
                200,
                cropRegion.get('offsetLeft'),
                'The X position crop region should have been updated'
            );
            Y.Assert.areEqual(
                150,
                cropRegion.get('offsetTop'),
                'The Y position crop region should have been updated'
            );
        },

        'should set x/y values in the valid range': function() {
            var instance = this,
                cropRegion = Y.one('.image-cropper-crop');

            instance._imageCropper.set('x', -100);
            instance._imageCropper.set('y', -100);

            Y.Assert.areEqual(
                0,
                cropRegion.get('offsetLeft'),
                'The X position crop region should have been zero'
            );
            Y.Assert.areEqual(
                0,
                cropRegion.get('offsetTop'),
                'The Y position crop region should have been zero'
            );

            instance._imageCropper.set('x', 1000);
            instance._imageCropper.set('y', 1000);

            Y.Assert.areEqual(
                400,
                cropRegion.get('offsetLeft'),
                'The X position crop region should have been the max valid value'
            );
            Y.Assert.areEqual(
                213,
                cropRegion.get('offsetTop'),
                'The Y position crop region should have been the max valid value'
            );

            instance._imageCropper.set('x', '100px');
            instance._imageCropper.set('y', '100px');

            Y.Assert.areNotEqual(
                '100px',
                cropRegion.get('offsetLeft'),
                'The X position can\'t be a string'
            );
            Y.Assert.areNotEqual(
                '100px',
                cropRegion.get('offsetTop'),
                'The Y position can\'t be a string'
            );
        },

        'should change region size': function() {
            var instance = this,
                cropRegion = Y.one('.image-cropper-crop');

            instance._imageCropper.set('cropWidth', 200);
            instance._imageCropper.set('cropHeight', 150);

            Y.Assert.areEqual(
                200,
                cropRegion.get('offsetWidth'),
                'The Width of crop region should have been updated'
            );
            Y.Assert.areEqual(
                150,
                cropRegion.get('offsetHeight'),
                'The Height of crop region should have been updated'
            );
        },

        'should set crop width/height values in the valid range': function() {
            var instance = this,
                cropRegion = Y.one('.image-cropper-crop'),
                imageCorner = Y.one('.yui3-resize-handle-br');

            instance._imageCropper.set('minWidth', 100);
            instance._imageCropper.set('minHeight', 100);

            imageCorner.simulate('mousedown');
            imageCorner.simulate('mousemove', {
                clientX: -100,
                clientY: -100
            });
            imageCorner.simulate('mouseup');

            Y.Assert.areEqual(
                100,
                cropRegion.get('offsetWidth'),
                'The Width can\'t be less than minWidth'
            );
            Y.Assert.areEqual(
                100,
                cropRegion.get('offsetHeight'),
                'The Height can\'t be less than minHeight'
            );

            instance._imageCropper.set('cropWidth', 10);
            instance._imageCropper.set('cropHeight', 10);

            Y.Assert.areEqual(
                100,
                cropRegion.get('offsetWidth'),
                'The Width can\'t be less than minWidth'
            );
            Y.Assert.areEqual(
                100,
                cropRegion.get('offsetHeight'),
                'The Height can\'t be less than minHeight'
            );

            instance._imageCropper.set('cropWidth', 1000);
            instance._imageCropper.set('cropHeight', 1000);

            Y.Assert.areEqual(
                500,
                cropRegion.get('offsetWidth'),
                'The Width can\'t be greater than image width'
            );
            Y.Assert.areEqual(
                313,
                cropRegion.get('offsetHeight'),
                'The Height can\'t be greater than image height'
            );
        },

        'should set minimum width/height value as positive number': function() {
            var instance = this,
                cropRegion = Y.one('.image-cropper-crop');

            instance._imageCropper.set('minWidth', -100);
            instance._imageCropper.set('minHeight', -100);

            Y.Assert.areEqual(
                100,
                cropRegion.get('offsetWidth'),
                'The X position crop region should have been zero'
            );
            Y.Assert.areEqual(
                100,
                cropRegion.get('offsetHeight'),
                'The Y position crop region should have been zero'
            );

            instance._imageCropper.set('minWidth', '100px');
            instance._imageCropper.set('minHeight', '100px');

            Y.Assert.areNotEqual(
                '100px',
                cropRegion.get('offsetWidth'),
                'The X position crop region should have been the max valid value'
            );
            Y.Assert.areNotEqual(
                '100px',
                cropRegion.get('offsetHeight'),
                'The Y position crop region should have been the max valid value'
            );
        },

        'should preserve size ratio': function() {
            var cropRegion = Y.one('.image-cropper-crop'),
                imageCorner = Y.one('.yui3-resize-handle-r'),
                oldPosition;

            this._imageCropper.set('preserveRatio', true);

            oldPosition = cropRegion.getStyle('height');

            imageCorner.simulate('mousedown');
            imageCorner.simulate('mousemove', {
                clientX: 50
            });
            imageCorner.simulate('mouseup');

            Y.Assert.areEqual(
                this.pixelValue(oldPosition) + 50,
                this.pixelValue(cropRegion.getStyle('height')),
                'The Ratio can be preserved'
            );
        },

        'should update the size of crop region on drag crop region corner': function() {
            var cropRegion = Y.one('.image-cropper-crop'),
                imageCorner = Y.one('.yui3-resize-handle-br'),
                oldPosition;

            oldPosition = cropRegion.getStyle('width');

            this._imageCropper.set('resizable', false);
            this._imageCropper.set('resizable', true);

            imageCorner.simulate('mousedown');
            imageCorner.simulate('mousemove', {
                clientX: 50
            });
            imageCorner.simulate('mouseup');

            Y.Assert.areEqual(
                this.pixelValue(oldPosition) + 50,
                this.pixelValue(cropRegion.getStyle('width')),
                'The Width can\'t be less than minWidth'
            );
        },

        'shouldn\'t update the size of crop region on drag crop region corner': function() {
            var cropRegion = Y.one('.image-cropper-crop'),
                imageCorner = Y.one('.yui3-resize-handle-br'),
                oldPosition;

            this._imageCropper.set('resizable', false);

            oldPosition = cropRegion.getStyle('width');

            imageCorner.simulate('mousedown');
            imageCorner.simulate('mousemove', {
                clientX: 50
            });
            imageCorner.simulate('mouseup');

            Y.Assert.areNotEqual(
                this.pixelValue(oldPosition) + 50,
                this.pixelValue(cropRegion.getStyle('width')),
                'The Width can\'t be less than minWidth'
            );
        },

        'shouldn\'t update the position of crop region on drag crop region corner': function() {
            var cropRegion = Y.one('.image-cropper-crop'),
                oldPosition;

            this._imageCropper.set('movable', false);

            oldPosition = cropRegion.getStyle('left');

            cropRegion.simulate('mousedown', {
                clientX: 50,
                clientY: 50
            });
            cropRegion.simulate('mousemove', {
                screenX: 300
            });
            cropRegion.simulate('mouseup', {
                screenX: 300
            });

            Y.Assert.areNotEqual(
                this.pixelValue(oldPosition) + 50,
                this.pixelValue(cropRegion.getStyle('left')),
                'The Width can\'t be less than minWidth'
            );
        },

        'should return the crop region': function() {
            var region = this._imageCropper.get('region');

            Y.Assert.areEqual(
                region.height,
                100,
                'The height can\'t be 100'
            );

            Y.Assert.areEqual(
                region.width,
                100,
                'The width can\'t be 100'
            );

            Y.Assert.areEqual(
                region.x,
                100,
                'The x positon can\'t be 100'
            );

            Y.Assert.areEqual(
                region.y,
                100,
                'The y positon can\'t be 100'
            );
        },

        'should update position and size of crop region on windown resize': function() {
            var cropRegion = Y.one('.image-cropper-crop'),
                oldXPosition = cropRegion.getStyle('left'),
                oldYPosition = cropRegion.getStyle('top'),
                oldWidth = cropRegion.getStyle('width'),
                oldXHeight = cropRegion.getStyle('height');

            // This simulates moving the image as the window resizes.
            this._container.setStyle('position', 'relative');
            this._container.setStyle('width', '250px');
            this._container.setStyle('height', '155px');
            if (Y.UA.ie === 8) {
                // Can't simulate a resize on IE8's window object, so
                // calling the function directly here.
                this._imageCropper._syncRegion();
                this._imageCropper.syncUI();
            }
            else {
                Y.one(Y.config.win).simulate('resize');
            }

            this.wait(function() {

                Y.Assert.areEqual(
                    Math.floor(this.pixelValue(oldXPosition) / 2),
                    cropRegion.get('offsetLeft'),
                    'The x can\'t keep the value'
                );

                Y.Assert.areEqual(
                    Math.floor(this.pixelValue(oldYPosition)/2),
                    cropRegion.get('offsetTop'),
                    'The y can\'t keep the value'
                );

                Y.Assert.areEqual(
                    Math.floor(this.pixelValue(oldWidth) / 2),
                    cropRegion.get('offsetWidth'),
                    'The Width can\'t keep the value'
                );

                Y.Assert.areEqual(
                    Math.floor(this.pixelValue(oldXHeight)/2),
                    cropRegion.get('offsetHeight'),
                    'The Height can\'t keep the value'
                );

            }, Y.config.windowResizeDelay || 100);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['aui-image-cropper', 'node-base', 'node-event-simulate', 'test']
});
