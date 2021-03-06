/**
 * Autoinsert script tags (or other filebased tags) in an html file.
 *
 * ---------------------------------------------------------------
 *
 * Automatically inject <script> tags for javascript files and <link> tags
 * for css files.  Also automatically links an output file containing precompiled
 * templates using a <script> tag.
 *
 * For usage docs see:
 * 		https://github.com/Zolmeister/grunt-sails-linker
 *
 */
module.exports = {
	devJs: {
		options: {
			startTag: '<!--SCRIPTS-->',
			endTag: '<!--SCRIPTS END-->',
			fileTmpl: '<script src="%s"></script>',
			appRoot: '.tmp/public'
		},
		files: {
			'.tmp/public/**/*.html': ['.tmp/public/concat/production.js'],
			'views/**/*.html': ['.tmp/public/concat/production.js'],
			'views/**/*.ejs': ['.tmp/public/concat/production.js']
		}
	},

	devJsRelative: {
		options: {
			startTag: '<!--SCRIPTS-->',
			endTag: '<!--SCRIPTS END-->',
			fileTmpl: '<script src="%s"></script>',
			appRoot: '.tmp/public',
			relative: true
		},
		files: {
			'.tmp/public/**/*.html': ['.tmp/public/concat/production.js'],
			'views/**/*.html': ['.tmp/public/concat/production.js'],
			'views/**/*.ejs': ['.tmp/public/concat/production.js']
		}
	},

	prodJs: {
		options: {
			startTag: '<!--SCRIPTS-->',
			endTag: '<!--SCRIPTS END-->',
			fileTmpl: '<script src="%s"></script>',
			appRoot: '.tmp/public'
		},
		files: {
			'.tmp/public/**/*.html': ['.tmp/public/min/production.min.js'],
			'views/**/*.html': ['.tmp/public/min/production.min.js'],
			'views/**/*.ejs': ['.tmp/public/min/production.min.js']
		}
	},

	prodJsRelative: {
		options: {
			startTag: '<!--SCRIPTS-->',
			endTag: '<!--SCRIPTS END-->',
			fileTmpl: '<script src="%s"></script>',
			appRoot: '.tmp/public',
			relative: true
		},
		files: {
			'.tmp/public/**/*.html': ['.tmp/public/min/production.min.js'],
			'views/**/*.html': ['.tmp/public/min/production.min.js'],
			'views/**/*.ejs': ['.tmp/public/min/production.min.js']
		}
	},

	devStyles: {
		options: {
			startTag: '<!--STYLES-->',
			endTag: '<!--STYLES END-->',
			fileTmpl: '<link rel="stylesheet" href="%s">',
			appRoot: '.tmp/public'
		},

		files: {
			'.tmp/public/**/*.html': ['.tmp/public/concat/production.css'],
			'views/**/*.html': ['.tmp/public/concat/production.css'],
			'views/**/*.ejs': ['.tmp/public/concat/production.css']
		}
	},

	devStylesRelative: {
		options: {
			startTag: '<!--STYLES-->',
			endTag: '<!--STYLES END-->',
			fileTmpl: '<link rel="stylesheet" href="%s">',
			appRoot: '.tmp/public',
			relative: true
		},

		files: {
			'.tmp/public/**/*.html': ['.tmp/public/concat/production.css'],
			'views/**/*.html': ['.tmp/public/concat/production.css'],
			'views/**/*.ejs': ['.tmp/public/concat/production.css']
		}
	},

	prodStyles: {
		options: {
			startTag: '<!--STYLES-->',
			endTag: '<!--STYLES END-->',
			fileTmpl: '<link rel="stylesheet" href="%s">',
			appRoot: '.tmp/public'
		},
		files: {
			'.tmp/public/index.html': ['.tmp/public/min/production.min.css'],
			'views/**/*.html': ['.tmp/public/min/production.min.css'],
			'views/**/*.ejs': ['.tmp/public/min/production.min.css']
		}
	},

	prodStylesRelative: {
		options: {
			startTag: '<!--STYLES-->',
			endTag: '<!--STYLES END-->',
			fileTmpl: '<link rel="stylesheet" href="%s">',
			appRoot: '.tmp/public',
			relative: true
		},
		files: {
			'.tmp/public/index.html': ['.tmp/public/min/production.min.css'],
			'views/**/*.html': ['.tmp/public/min/production.min.css'],
			'views/**/*.ejs': ['.tmp/public/min/production.min.css']
		}
	},

	// Bring in JST template object
	devTpl: {
		options: {
			startTag: '<!--TEMPLATES-->',
			endTag: '<!--TEMPLATES END-->',
			fileTmpl: '<script type="text/javascript" src="%s"></script>',
			appRoot: '.tmp/public'
		},
		files: {
			'.tmp/public/index.html': ['.tmp/public/jst.js'],
			'views/**/*.html': ['.tmp/public/jst.js'],
			'views/**/*.ejs': ['.tmp/public/jst.js']
		}
	}
};
