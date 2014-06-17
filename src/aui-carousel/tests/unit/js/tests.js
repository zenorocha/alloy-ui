YUI.add('aui-carousel-tests', function(Y) {
    var suite = new Y.Test.Suite('aui-carousel');

    suite.add(new Y.Test.Case({
        name: 'AUI Carousel Unit Tests',

        _should: {
            // Ignore the following tests in touch enabled browsers. They will
            // be tested properly in the tests for the aui-carousel-touch module.
            ignore: {
                'should play/pause when user clicks the button': Y.UA.touchEnabled,
                'should switch images when user clicks on next/previous buttons': Y.UA.touchEnabled,
                'should switch images when user clicks on item buttons': Y.UA.touchEnabled,
                'should switch the item selector': Y.UA.touchEnabled,
                'should render the menu outside of the carousel': Y.UA.touchEnabled
            }
        },

        init: function() {
            this._container = Y.one('#container');

            // Remove 'mouseenter' and 'mouseleave' from DOM_EVENTS so we
            // can simulate them in the test by just calling 'fire'.
            delete Y.Node.DOM_EVENTS.mouseenter;
            delete Y.Node.DOM_EVENTS.mouseleave;
        },

        setUp: function() {
            this.createCarousel({
                contentBox: '#content',
                height: 300,
                intervalTime: 1,
                itemSelector: '> div,img',
                width: 940
            });
        },

        tearDown: function() {
            this._carousel && this._carousel.destroy();
        },

        createCarousel: function(config) {
            var content = Y.Node.create('<div id="content"></div>'),
                images = Y.one('#images');

            content.setHTML(images.getHTML());
            this._container.append(content);

            this._carousel = new Y.Carousel(config).render();
        },

        assertPaused: function(callback) {
            var instance = this,
                previousActiveIndex = this._carousel.get('activeIndex');

            this.wait(function() {
                Y.Assert.areEqual(
                    previousActiveIndex,
                    instance._carousel.get('activeIndex'),
                    'Carousel was paused, so activeIndex should not have been updated'
                );

                callback && callback();
            }, (this._carousel.get('animationTime') + this._carousel.get('intervalTime')) * 1000 + 100);
        },

        waitForNext: function(callback) {
            var instance = this,
                timeBefore = new Date().getTime();

            this._carousel.onceAfter('activeIndexChange', function() {
                instance.resume(function() {
                    callback(Math.round((new Date().getTime() - timeBefore) / 1000));
                });
            });

            this.wait();
        },

        'should play images in sequence': function() {
            var instance = this;

            Y.Assert.areEqual(0, this._carousel.get('activeIndex'), 'Initially, activeIndex should be 0');

            this.waitForNext(function() {
                Y.Assert.areEqual(
                    1,
                    instance._carousel.get('activeIndex'),
                    'Next activeIndex should be 1'
                );

                instance.waitForNext(function() {
                    Y.Assert.areEqual(
                        2,
                        instance._carousel.get('activeIndex'),
                        'Next activeIndex should be 2'
                    );

                    instance.waitForNext(function() {
                        Y.Assert.areEqual(
                            0,
                            instance._carousel.get('activeIndex'),
                            'Cycle is closed, activeIndex should be 0'
                        );
                    });
                });
            });
        },

        'should change the interval time': function() {
            var instance = this;

            this.waitForNext(function(intervalTime1) {
                Y.Assert.areEqual(
                    1,
                    intervalTime1,
                    'Initial interval time is of 1 second'
                );

                instance._carousel.set('intervalTime', 2);
                instance.waitForNext(function(intervalTime2) {
                    Y.Assert.areEqual(
                        2,
                        intervalTime2,
                        'Interval time should have been updated'
                    );
                });
            });
        },

        'should play/pause when user clicks the button': function() {
            var instance = this,
                pauseButton = this._carousel.get('boundingBox').one('.carousel-menu-pause');

            pauseButton.simulate('click');

            this.assertPaused(function() {
                pauseButton.simulate('click');

                instance.waitForNext(function() {
                    Y.Assert.areEqual(
                        1,
                        instance._carousel.get('activeIndex'),
                        'Carousel was resumed, so activeIndex should have been updated to 1'
                    );
                });
            });
        },

        'should play/pause when functions are called': function() {
            var instance = this;

            this._carousel.pause();

            this.assertPaused(function() {
                instance._carousel.play();

                instance.waitForNext(function() {
                    Y.Assert.areEqual(
                        1,
                        instance._carousel.get('activeIndex'),
                        'Carousel was resumed, so activeIndex should have been updated to 1'
                    );
                });
            });
        },

        'should be able to switch images while paused': function() {
            var instance = this;

            this._carousel.pause();
            this._carousel.item(1);

            Y.Assert.areEqual(
                1,
                instance._carousel.get('activeIndex'),
                'The image index should have been updated correctly'
            );
        },

        'should switch images when user clicks on next/previous buttons': function() {
            var nextButton = this._carousel.get('boundingBox').one('.carousel-menu-next'),
                prevButton = this._carousel.get('boundingBox').one('.carousel-menu-prev');

            prevButton.simulate('click');
            Y.Assert.areEqual(
                2,
                this._carousel.get('activeIndex'),
                'Previous button was pressed, activeIndex should be 2'
            );

            prevButton.simulate('click');
            Y.Assert.areEqual(
                1,
                this._carousel.get('activeIndex'),
                'Previous button was pressed, activeIndex should be 1'
            );

            nextButton.simulate('click');
            Y.Assert.areEqual(
                2,
                this._carousel.get('activeIndex'),
                'Next button was pressed, activeIndex shoudl be 2'
            );

            nextButton.simulate('click');
            Y.Assert.areEqual(
                0,
                this._carousel.get('activeIndex'),
                'Next button was pressed, activeIndex shoudl be 0'
            );
        },

        'should switch images when next/prev functions are called': function() {
            this._carousel.prev();
            Y.Assert.areEqual(
                2,
                this._carousel.get('activeIndex'),
                'Previous function was called, activeIndex should be 2'
            );

            this._carousel.prev();
            Y.Assert.areEqual(
                1,
                this._carousel.get('activeIndex'),
                'Previous function was called, activeIndex should be 1'
            );

            this._carousel.next();
            Y.Assert.areEqual(
                2,
                this._carousel.get('activeIndex'),
                'Next function was called, activeIndex should be 2'
            );

            this._carousel.next();
            Y.Assert.areEqual(
                0,
                this._carousel.get('activeIndex'),
                'Next function was called, activeIndex should be 0'
            );
        },

        'should switch images when user clicks on item buttons': function() {
            var itemButtons = this._carousel.get('boundingBox').all('.carousel-menu-index');

            itemButtons.item(2).simulate('click');
            Y.Assert.areEqual(
                2,
                this._carousel.get('activeIndex'),
                'Second item button was clicked, activeIndex should be 2'
            );

            itemButtons.item(0).simulate('click');
            Y.Assert.areEqual(
                0,
                this._carousel.get('activeIndex'),
                'First item button was clicked, activeIndex should be 0'
            );

            itemButtons.item(1).simulate('click');
            Y.Assert.areEqual(
                1,
                this._carousel.get('activeIndex'),
                'First item button was clicked, activeIndex should be 1'
            );
        },

        'should switch images when item function is called': function() {
            this._carousel.item(2);
            Y.Assert.areEqual(
                2,
                this._carousel.get('activeIndex'),
                'Item function was called, activeIndex should be 2'
            );

            this._carousel.item(0);
            Y.Assert.areEqual(
                0,
                this._carousel.get('activeIndex'),
                'Item function was called, activeIndex should be 0'
            );

            this._carousel.item(1);
            Y.Assert.areEqual(
                1,
                this._carousel.get('activeIndex'),
                'Item function was called, activeIndex should be 1'
            );
        },

        'should pause on hover': function() {
            var boundingBox = this._carousel.get('boundingBox'),
                nodeMenu = this._carousel.get('nodeMenu');

            boundingBox.fire('mouseenter', {
                clientX: nodeMenu.get('region').left - 1
            });
            Y.Assert.isTrue(this._carousel.get('playing'), 'Should not pause, since pauseOnHover is false');

            this._carousel.set('pauseOnHover', true);

            boundingBox.fire('mouseenter', {
                clientX: nodeMenu.get('region').left - 1
            });
            Y.Assert.isFalse(this._carousel.get('playing'), 'Should have paused on hover');

            boundingBox.fire('mouseleave');
            Y.Assert.isTrue(this._carousel.get('playing'), 'Should have resumed on mouse leave');

            this._carousel.set('pauseOnHover', false);

            boundingBox.fire('mouseenter', {
                clientX: nodeMenu.get('region').left - 1
            });
            Y.Assert.isTrue(this._carousel.get('playing'), 'Should not pause, since pauseOnHover is false');
        },

        'should not resume on leaving if carouse was paused manually': function() {
            var boundingBox = this._carousel.get('boundingBox'),
                nodeMenu = this._carousel.get('nodeMenu');

            this._carousel.set('pauseOnHover', true);

            this._carousel.pause();

            boundingBox.fire('mouseenter', {
                clientX: nodeMenu.get('region').left - 1
            });
            boundingBox.fire('mouseleave');
            Y.Assert.isFalse(this._carousel.get('playing'), 'Should not have resumed on mouse leave');
        },

        'should not pause when entering carousel through menu': function() {
            var boundingBox = this._carousel.get('boundingBox'),
                nodeMenu = this._carousel.get('nodeMenu');

            this._carousel.set('pauseOnHover', true);

            boundingBox.fire('mouseenter', {
                clientX: nodeMenu.get('region').left + 1
            });
            Y.Assert.isTrue(this._carousel.get('playing'), 'Should not have paused on hover');
        },

        'should resume when entering the menu from the carousel': function() {
            var boundingBox = this._carousel.get('boundingBox'),
                nodeMenu = this._carousel.get('nodeMenu');

            this._carousel.set('pauseOnHover', true);

            boundingBox.fire('mouseenter', {
                clientX: nodeMenu.get('region').left - 1
            });
            nodeMenu.fire('mouseenter', {
                relatedTarget: this._carousel.nodeSelection.item(0)
            });
            Y.Assert.isTrue(this._carousel.get('playing'), 'Should have resumed on entering menu');

            boundingBox.fire('mouseleave');
            nodeMenu.fire('mouseleave', {
                relatedTarget: this._carousel.nodeSelection.item(0)
            });
            Y.Assert.isFalse(this._carousel.get('playing'), 'Should have paused on leaving menu');
        },

        'should not resume when entering the menu from outside the carousel': function() {
            var boundingBox = this._carousel.get('boundingBox'),
                nodeMenu = this._carousel.get('nodeMenu');

            this._carousel.set('pauseOnHover', true);

            boundingBox.fire('mouseenter', {
                clientX: nodeMenu.get('region').left - 1
            });
            nodeMenu.fire('mouseenter', {
                relatedTarget: Y.one('body')
            });
            Y.Assert.isFalse(this._carousel.get('playing'), 'Should not have resumed on entering menu');

            boundingBox.fire('mouseleave');
            nodeMenu.fire('mouseleave', {
                relatedTarget: Y.one('body')
            });
            Y.Assert.isTrue(this._carousel.get('playing'), 'Should not have paused on leaving menu');
        },

        'should set activeIndex to random number': function() {
            var mock = new Y.Mock(),
                oldRandom = Math.random,
                value = 0.4;

            // Switch Math.random with a mock during this test so we can check that it's
            // being called correctly.
            Y.Mock.expect(mock, {
                callCount: 1,
                method: 'fakeRandom',
                returns: value
            });
            Math.random = mock.fakeRandom;

            this._carousel.set('activeIndex', 'rand');
            Y.Assert.areEqual(
                1,
                this._carousel.get('activeIndex'),
                'activeIndex should be set to the return value of the random function'
            );

            Y.Mock.verify(mock);

            // Restore the original Math.random function as the test ends.
            Math.random = oldRandom;
        },

        'should be able to change animation time': function() {
            this._carousel.set('animationTime', 1);
            Y.Assert.areEqual(
                1,
                this._carousel.animation.get('duration'),
                'Animation duration should have been updated to the new value'
            );
        },

        'should switch the item selector': function() {
            var contentBox = this._carousel.get('contentBox');

            contentBox.setHTML('<span></span><span></span>');
            this._carousel.set('itemSelector', '> span');

            this._carousel.next();
            Y.Assert.areEqual(
                1,
                this._carousel.get('activeIndex'),
                'The second item should have been selected'
            );

            this._carousel.next();
            Y.Assert.areEqual(
                0,
                this._carousel.get('activeIndex'),
                'There are only 2 items now, so the next item should be 0'
            );
        },

        'should work with a custom menu': function() {
            var customMenu = Y.one('#customMenu');

            this._carousel.set('nodeMenu', customMenu);
            this._carousel.set('nodeMenuItemSelector', '.test-menu-item');

            // This shouldn't throw an exception due to trying to
            // update the missing play button.
            this._carousel.set('playing', false);

            // This shouldn't throw an exception due to clicking
            // on a non carousel button inside the menu.
            customMenu.one('.test-menu-extra').simulate('click');

            // This shouldn't throw an exception due to trying to
            // update the missing item button.
            this._carousel.set('playing', true);
            this.waitForNext(function() {
                Y.Assert.pass('No exceptions were thrown');
            });
        },

        'should be able to start the carousel already paused': function() {
            this._carousel.destroy();
            this.createCarousel({
                contentBox: '#content',
                height: 300,
                playing: false,
                width: 940
            });

            this.assertPaused();
        },

        'should render the menu outside of the carousel': function() {
            var boundingBox = this._carousel.get('boundingBox');

            Y.Assert.isFalse(
                boundingBox.hasClass('carousel-outside-menu'),
                'Should not have the carousel-outside-menu class'
            );

            this._carousel.set('nodeMenuPosition', 'outside');

            Y.Assert.isTrue(
                boundingBox.hasClass('carousel-outside-menu'),
                'Should have the carousel-outside-menu class'
            );
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['aui-carousel', 'node-base', 'node-event-simulate', 'test']
});
