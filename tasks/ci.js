var capsList = require('../capabilities.json'),
    async = require('async'),
    gulp = require('gulp'),
    path = require('path'),
    CWD = path.join(process.env.INIT_CWD, 'src'),
    spawn = require('spawn-local-bin'),
    run = require('run-sequence');

function escape(string) {
    return string.replace(/([;=])/g, '\\$1');
}

function getCapabilities(raw) {
    var prop,
        properties = '';

    for (prop in raw) {
        if (raw.hasOwnProperty(prop)) {
            properties += escape(prop) + '=' + escape(raw[prop]) + ';';
        }
    }

    return properties;
}

gulp.task('ci-browsers', function (callback) {
    async.mapSeries(capsList, function (capabilities, res) {
        var cmd = 'yeti',
            caps = getCapabilities(capabilities),
            args = ['--wd-url', process.env.SELENIUM_HOST, '--caps', caps];

        spawn(cmd, args, CWD)
            .on('exit', function(code) {
                if (code !== 0) {
                    console.error('Test failed with \'' + caps);
                }

                res(null, code);
            });
    }, function (err, result) {
        var success = result.filter(function (each) {
            return each !== 0;
        }).length === 0;

        if (!success) {
            console.error('Some tests failed.');
            process.nextTick(function () {
                process.exit(1);
            });
        }

        callback();
    });
});
