/*
 * Copyright (c) 2013, Liferay Inc. All rights reserved.
 * Code licensed under the BSD License:
 * https://github.com/liferay/alloy-ui/blob/master/LICENSE.md
 *
 * @author Zeno Rocha <zeno.rocha@liferay.com>
 * @author Eduardo Lundgren <eduardo.lundgren@liferay.com>
 */

var TASK = {
    name: 'api-build',
    description: 'Build the API Docs locally.'
};

// -- Dependencies -------------------------------------------------------------
var async = require('async');
var command = require('command');
var path = require('path');

// -- Task ---------------------------------------------------------------------
module.exports = function(grunt) {
    grunt.registerTask(TASK.name, TASK.description, function() {
        var done = this.async();

        grunt.applyCliConfig(TASK.name);

        async.series([
            function(mainCallback) {
                    exports._buildYuidoc(mainCallback);
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

    exports._buildYuidoc = function(mainCallback) {
        var auiVersion = grunt.config([TASK.name, 'aui-version']);
        var configFile = path.join(grunt.config([TASK.name, 'theme']), 'yuidoc.json');
        var sourceDir = grunt.config([TASK.name, 'src']);
        var destinationDir = grunt.config([TASK.name, 'dist']);

        var commandArgs = [];
        commandArgs.push('-c', configFile, '-o', destinationDir, '--project-version', auiVersion);

        command.open(sourceDir)
            .on('stdout', command.writeTo(process.stdout))
            .on('stderr', command.writeTo(process.stderr))
            .exec('yuidoc', commandArgs)
            .then(function() {
                mainCallback();
            });
    };
};
