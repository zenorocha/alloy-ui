/*
 * Copyright (c) 2013, Liferay Inc. All rights reserved.
 * Code licensed under the BSD License:
 * https://github.com/liferay/alloy-ui/blob/master/LICENSE.md
 *
 * @author Zeno Rocha <zeno.rocha@liferay.com>
 * @author Eduardo Lundgren <eduardo.lundgren@liferay.com>
 */

var TASK = {
    name: 'watch',
    description: 'Build and watch for any changes'
};

// -- Dependencies -------------------------------------------------------------
var async = require('async');
var command = require('command');

// -- Task ---------------------------------------------------------------------
module.exports = function(grunt) {
    grunt.registerTask(TASK.name, TASK.description, function() {
        var done = this.async();

        grunt.applyCliConfig(TASK.name);

        async.series([
            function(mainCallback) {
                    exports._setShifterArgs(mainCallback);
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

    exports._setShifterArgs = function(mainCallback) {
        var args = [];
        var cwd = grunt.config([TASK.name, 'src']);

        args.push('--replace-yuivar=' + grunt.config([TASK.name, 'replace-yuivar']));
        args.push('--replace-version=' + grunt.config([TASK.name, 'replace-version']));
        args.push('--watch');

        exports._runShifter(mainCallback, args, cwd);
    };

    exports._runShifter = function(mainCallback, args, cwd) {
        command.open(cwd)
            .on('stdout', command.writeTo(process.stdout))
            .on('stderr', command.writeTo(process.stderr))
            .exec('shifter', args)
            .then(function() {
                mainCallback();
            });
    };
};
