module.exports = {

  paths: {
    "public": 'public',
    "watched": ['app', 'vendor']
  },

  files: {
    javascripts: {
      joinTo: {
        'js/app.js': /^app/,
        'js/vendor.js': [
          /^vendor/,
          // external libs
          // angular
          'node_modules/modernizr/modernizr.js',
          'node_modules/jquery/dist/jquery.js',
          'node_modules/lodash/dist/lodash.js',
          'node_modules/bootstrap/dist/js/bootstrap.js'
        ]
      },
      order: {
        before: [
          'node_modules/angular/angular.js',
          'node_modules/angular-resource/angular-resource.js',
          'node_modules/angular-sanitize/angular-sanitize.js',
          'node_modules/angular-ui-router/release/angular-ui-router.js',
          'node_modules/ocModal/dist/ocModal.min.js'
        ]
      }
    },
    stylesheets: {
      joinTo: {
        'css/app.css': /^app/,
        'css/vendor.css': [
          /^vendor/,
          // external libs
          // angular
          'node_modules/bootstrap/dist/css/bootstrap.css'
        ],
      },
      order: {
        before: []
      }
    }
  },

  plugins: {
    babel: { presets: ['es2015'] },
    less: { dumpLineNumbers: 'comments' },
    ng_annotate: {
      pattern: /^app/
    },
    autoprefixer: {
      browsers: [
        "last 2 version",
        "> 1%", // browsers with > 1% usage
        "ie >= 9"
      ],
      cascade: false
    },
    // browserSync: {
    //   notify: false
    // }
  },

  server: {
    port: 3030,
    notify: false,
    logLevel: "debug"
  },

  conventions: {
    assets: /app(\\|\/)assets(\\|\/)/
  },

  sourceMaps: true
};


