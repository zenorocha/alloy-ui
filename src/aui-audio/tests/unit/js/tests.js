YUI.add('aui-audio-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-audio');

    suite.add(new Y.Test.Case({
        name: 'Audio Tests',

        init: function() {
            this._container = Y.one('#container');
        },

        setUp: function() {
            this.createAudio({
                boundingBox: '#audio',
                oggUrl: 'assets/zelda.ogg',
                url: 'assets/zelda.mp3'
            });
        },

        tearDown: function() {
            this._audio && this._audio.destroy();
        },

        createAudio: function(config) {
            var content = Y.Node.create('<div id="audio"></div>');

            this._container.append(content);
            this._audio = new Y.Audio(config).render();
        },

        'should start play on `play` function call': function() {
            var audio = this._audio,
                audioTag = Y.one('audio');

            audio.play();
            Y.Assert.isFalse(audioTag.get('paused'));
        },

        'should pause on `pause` function call': function() {
            var audio = this._audio,
                audioTag = Y.one('audio');

            audio.play();
            Y.Assert.isFalse(audioTag.get('paused'));
            audio.pause();
            Y.Assert.isTrue(audioTag.get('paused'));
        },

        'should load a song': function() {
            var audio = this._audio,
                audioTag = Y.one('audio'),
                srcMp3 = 'assets/bc.mp3',
                srcOgg = 'assets/bc.ogg';

            audio.set('url', srcMp3);
            audio.set('oggUrl', srcOgg);
            audio.load();
            Y.Assert.isTrue(audioTag.get('currentSrc').indexOf(srcMp3) > -1 ||
                audioTag.get('currentSrc').indexOf(srcOgg) > -1);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['aui-audio', 'test']
});
