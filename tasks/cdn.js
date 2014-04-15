/*
 * Copyright (c) 2013, Liferay Inc. All rights reserved.
 * Code licensed under the BSD License:
 * https://github.com/liferay/alloy-ui/blob/master/LICENSE.md
 *
 * @author Zeno Rocha <zeno.rocha@liferay.com>
 * @author Eduardo Lundgren <eduardo.lundgren@liferay.com>
 */

var TASK = {
    name: 'cdn',
    description: 'Define some CDN configurations into build/aui directory.'
};

// -- Dependencies -------------------------------------------------------------
var async = require('async');
var fs = require('fs-extra');
var path = require('path');

// -- Globals ------------------------------------------------------------------
var ROOT = process.cwd();

// -- Task ---------------------------------------------------------------------
module.exports = function(grunt) {
    grunt.registerTask(TASK.name, TASK.description, function() {
        var done = this.async();

        grunt.applyCliConfig(TASK.name);

        async.series([
            function(mainCallback) {
                    exports._setYuiConfig(mainCallback);
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

    exports._setYuiConfig = function(mainCallback) {
        var combine = grunt.config([TASK.name, 'combine']),
            comboBase = grunt.config([TASK.name, 'comboBase']),
            filter = grunt.config([TASK.name, 'filter']),
            root = grunt.config([TASK.name, 'root']);

        var auiBuildDir = path.join(ROOT, 'build', 'aui'),
            files = [];

        files.push(path.join(auiBuildDir, 'aui.js'));
        files.push(path.join(auiBuildDir, 'aui-min.js'));
        files.push(path.join(auiBuildDir, 'aui-debug.js'));

        files.forEach(function(file) {
            fs.appendFile(
                file, '\nYUI_config = {' +
                'combine:' + combine + ',' +
                'filter:"' + filter + '",' +
                'comboBase:"' + comboBase + '",' +
                'root:"' + root + '"' +
                '};');
        });

        mainCallback();
    };
};
