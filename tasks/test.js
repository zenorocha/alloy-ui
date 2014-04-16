/*
 * Copyright (c) 2013, Liferay Inc. All rights reserved.
 * Code licensed under the BSD License:
 * https://github.com/liferay/alloy-ui/blob/master/LICENSE.md
 *
 * @author Zeno Rocha <zeno.rocha@liferay.com>
 * @author Eduardo Lundgren <eduardo.lundgren@liferay.com>
 * @author Bruno Basto <bruno.basto@liferay.com>
 */

var TASK = {
    name: 'test',
    description: 'Run unit tests using Yeti'
};

// -- Requires -----------------------------------------------------------------
var async = require('async');
var cp = require('child_process');

// -- Globals ------------------------------------------------------------------
var ROOT = process.cwd();

module.exports = function(grunt) {
    grunt.registerTask(TASK.name, TASK.description, function() {
        var done = this.async();

        async.series([
            function(mainCallback) {
                    exports._setGruntConfig(mainCallback);
            },
            function(mainCallback) {
                    exports._runYeti(mainCallback);
            }],
            function(err) {
                if (err) {
                    done(false);
                }
                else {
                    done();
                }
            }
        );
    });

    exports._setGruntConfig = function(mainCallback) {
        var options = grunt.option.flags();

        options.forEach(function(option) {
            var key;
            var value;
            var valueIndex;

            // Normalize option
            option = option.replace(/^--(no-)?/, '');

            valueIndex = option.lastIndexOf('=');

            // String parameter
            if (valueIndex !== -1) {
                key = option.substring(0, valueIndex);
                value = option.substring(valueIndex + 1);
            }
            // Boolean parameter
            else {
                key = option;
                value = grunt.option(key);
            }

            grunt.config([TASK.name, key], value);
        });

        mainCallback();
    };

    exports._runYeti = function(mainCallback) {
        var browser,
            server,
            yeti;

        server = cp.spawn(
            'yeti',
            ['--server']
        );

        setTimeout(function() {
            browser = cp.spawn(
                'open',
                ['-jg', 'http://localhost:9000/']
            );
        }, 2000)

        setTimeout(function() {
            yeti = cp.spawn(
                'yeti',
                [],
                {
                    cwd: ROOT,
                    stdio: 'inherit'
                }
            );

            yeti.on('exit', function() {
                browser.kill();

                server.kill();

                mainCallback();
            });
        }, 3000);
    };
};
