/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */



// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
  'components/animate.css/animate.min.css',
  'styles/**/*.css',
  '!styles/vjs-embed.css'
];

var dependenciesToInject = [
  // Load sails.io before everything else
  'js/dependencies/sails.io.js',

  // Global libraries
  'components/lodash/dist/lodash.min.js',
  'components/moment/min/moment.min.js',

  // Angular dependencies
  'components/angular-ui-router/release/angular-ui-router.min.js',
  'components/angular-bootstrap/ui-bootstrap-tpls.min.js',
  'components/angulartics/dist/angulartics.min.js',
  'components/angulartics/dist/angulartics-ga.min.js',
  'components/angular-http-auth/src/http-auth-interceptor.js',
  'components/angular-google-maps/dist/angular-google-maps.min.js',
  'components/angular-translate/angular-translate.min.js',
  'components/angular-translate-loader-partial/angular-translate-loader-partial.min.js',
  'components/angular-sails-bind/dist/angular-sails-bind.min.js',
  'components/angular-wizard/dist/angular-wizard.min.js',

  // jQuery dependencies
  'components/jquery-throttle-debounce/jquery.ba-throttle-debounce.min.js',

  // User interface
  'components/angular-moment/angular-moment.min.js',
  'components/angular-rickshaw/rickshaw.js',
  'components/angular-svg-round-progressbar/roundProgress.min.js',
  'components/d3/d3.min.js',
  'components/medium-editor/dist/js/medium-editor.min.js',
  'components/ng-file-upload/angular-file-upload.min.js',
  'components/ng-file-upload/angular-file-upload-shim.min.js',
  'components/ng-tags-input/ng-tags-input.min.js',
  'components/rickshaw/rickshaw.min.js',

  // Media player elements
  'components/videojs/dist/video-js/video.js',
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [
  'js/configuration/*.js',
  'js/controllers/*.js',
  'js/filters/*.js',
  'js/**/*.js',
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
  'templates/**/*.html'
];

var mapFilesToInject = function(path) {
  return '.tmp/public/' + path;
};

// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(mapFilesToInject);
module.exports.dependenciesToInject = dependenciesToInject.map(mapFilesToInject);
module.exports.jsFilesToInject = jsFilesToInject.map(mapFilesToInject);
module.exports.templateFilesToInject = templateFilesToInject.map(mapFilesToInject);
