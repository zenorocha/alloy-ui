/*
 * Darwin has a low limit for file descriptors (256 per process) by default.
 *
 * Increase it for this process to avoid an EMFILE error when opening lots of
 * files for releasing packages, compressing, etc.
 *
 * This is a temporary fix while node >= 0.12 isn't out as it is already fixed
 * properly in the core.
 *
 * @param treeshold {Number}
 *
 * Reference: https://github.com/wearefractal/vinyl-fs/issues/14
 *
 */
 module.exports.increaseDarwinLowFileDescriptorsLimit = function fix(treeshold) {
    var current,
        posix;

    if (process.platform === 'darwin') {
        posix = require('posix');

        current = posix.getrlimit('nofile').soft;

        if (current !== null && current < treeshold) {
            posix.setrlimit('nofile', {
                soft: treeshold,
                hard: null
            });
        }
    }
};
