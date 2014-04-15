/*
 * Copyright (c) 2013, Liferay Inc. All rights reserved.
 * Code licensed under the BSD License:
 * https://github.com/liferay/alloy-ui/blob/master/LICENSE.md
 *
 * @author Zeno Rocha <zeno.rocha@liferay.com>
 * @author Eduardo Lundgren <eduardo.lundgren@liferay.com>
 */

var TASK = {
    name: 'api-watch',
    description: 'Run the API Docs locally and watch for any changes.'
};

// -- Dependencies -------------------------------------------------------------
var async = require('async');
var command = require('command');
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
                    exports._runYuidoc(mainCallback);
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

    exports._runYuidoc = function(mainCallback) {
        var auiVersion = grunt.config([TASK.name, 'aui-version']);
        var configFile = path.join(grunt.config([TASK.name, 'theme']), 'yuidoc.json');
        var sourceDirs = grunt.config([TASK.name, 'src']);

        var commandArgs = [];

        sourceDirs.forEach(function(srcDir) {
            commandArgs.push(srcDir);
        });

        commandArgs.push('-c', configFile, '--project-version', auiVersion, '--server');

        command.open(ROOT)
            .on('stdout', command.writeTo(process.stdout))
            .on('stderr', command.writeTo(process.stderr))
            .exec('yuidoc', commandArgs)
            .then(function() {
                mainCallback();
            });
    };
};
