/**
 * Copy files and folders.
 *
 * ---------------------------------------------------------------
 *
 * # dev task config
 * Copies all directories and files, exept coffescript and less fiels, from the sails
 * assets folder into the .tmp/public directory.
 *
 * # build task config
 * Copies all directories nd files from the .tmp/public directory into a www directory.
 *
 * For usage docs see:
 *     https://github.com/gruntjs/grunt-contrib-copy
 */
module.exports = {
  dev: {
    files: [{
      expand: true,
      cwd: './assets',
      src: ['**/*.!(coffee|less)'],
      dest: '.tmp/public'
    },
    {
      expand: true,
      cwd: './node_modules/video.js/dist',
      src: ['*.min*', '*.swf'],
      dest: '.tmp/public/libraries'
    },
    {
      expand: true,
      cwd: './node_modules/sails.io.js-dist',
      src: ['*.js'],
      dest: '.tmp/public/libraries'
    }]
  },
  build: {
    files: [{
      expand: true,
      cwd: '.tmp/public',
      src: ['**/*'],
      dest: 'www'
    }]
  }
};
