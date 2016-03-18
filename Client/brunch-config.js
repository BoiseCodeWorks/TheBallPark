module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'vendor.js': /^(?!app)/,
        'app.js': /^app/
      }
    },
    stylesheets: {
      joinTo: 'app.css',
      order:{
        before:[
          'app/styles.app.less'
        ]
      }
    }
  },

  plugins: {
    babel: {presets: ['es2015']},
    less:{dumpLineNumbers: 'comments'}
  }
};
