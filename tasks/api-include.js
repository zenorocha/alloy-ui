/*
 * Copyright (c) 2013, Liferay Inc. All rights reserved.
 * Code licensed under the BSD License:
 * https://github.com/liferay/alloy-ui/blob/master/LICENSE.md
 *
 * @author Zeno Rocha <zeno.rocha@liferay.com>
 */

var TASK = {
    name: 'api-include',
    description: 'Import code examples from a repository to the API Docs.'
};

// -- Dependencies -------------------------------------------------------------
var async = require('async');
var fs = require('fs');
var path = require('path');

// -- Globals ------------------------------------------------------------------

// -- Task ---------------------------------------------------------------------
module.exports = function(grunt) {
    grunt.registerMultiTask(TASK.name, TASK.description, function() {
        var done = this.async();
        var files = this.files[0].src;
        var target = this.target;

        grunt.applyCliConfig(TASK.name, target);

        async.series([
            function(mainCallback) {
                exports._replaceInclude(mainCallback, target, files);
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

    exports._replaceInclude = function(mainCallback, target, files) {
        files.forEach(function(file) {
            // Read file
            var fileContent = fs.readFileSync(file, 'utf8');

            // Find @include
            var tokens = fileContent.match(/@include [^\s]+/g);

            if (tokens) {
                grunt.log.write('Replacing @include token in: ' + file.cyan + '\n');

                tokens.forEach(function(token) {
                    // Get local path from remote url
                    var replacedToken = token.replace(/http:\/\/alloyui.com/g,
                        path.resolve(grunt.config([TASK.name, target, 'repo']), 'src/documents'));

                    // Extract local path
                    var remoteUrl = token.split(' ')[1];
                    var includeFilePath = replacedToken.split(' ')[1];

                    // Read files from alloyui.com
                    var includeFileContent = fs.readFileSync(includeFilePath, 'utf8');

                    // Wrap content in Markdown markup
                    includeFileContent = '@example\n```\n' + includeFileContent + '\n```';

                    // Replace @include with @example, and remote url with include file content
                    fileContent = fileContent.replace(token, includeFileContent);
                });

                // Save file
                fs.writeFileSync(file, fileContent, 'utf8');
            }
        });

        mainCallback();
    };
};