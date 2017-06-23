var grunt = require('grunt');

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-mocha-test');
grunt.loadNpmTasks('grunt-js-beautify');
grunt.initConfig({
  jshint: {
    options: {
      'node': true,
      'esversion': 6,
    },
    all: ['routes/**/*.js',
      'utils/**/*.js',
      'views/**/*.js',
      // 'public/**/*.js',
      'Gruntfile.js',
      'app.js',
      'config.js',
      'package.json'
    ],
  },
  js_beautify: {
    options: {
      "end_with_newline": true,
      "indent_size": 2,
      "indent_char": " ",
      "eol": "\n",
      "indent_with_tabs": false,
      "preserve_newlines": true,
      "max_preserve_newlines": 10,
      "jslint_happy": false,
    },
    files: ['routes/**/*.js',
      'utils/**/*.js',
      'views/**/*.js',
      'public/**/*.js',
      'Gruntfile.js',
      'app.js',
      'config.js',
      'package.json'
    ]
  },
  mochaTest: {
    test: {
      options: {
        reporter: 'spec',
        //captureFile: 'results.txt', // Optionally capture the reporter output to a file
        quiet: false, // Optionally suppress output to standard out (defaults to false)
        clearRequireCache: true // Optionally clear the require cache before running tests (defaults to false)
      },
      src: ['tests/**/*.js']
    }
  }
});

//grunt.registerTask('world', 'world task description', function() {
//    console.log('hello world');
//});

grunt.registerTask('doc', 'generates static markdown documentation', function () {
  require('mdoc').run({
    // configuration options (specified below)
    inputDir: 'docs',
    outputDir: 'dist'
  });
});

//grunt.registerTask('hello', 'say hello', function (name) {
//    if (!name || !name.length)
//        grunt.warn('you need to provide a name.');
//
//    console.log('hello ' + name);
//});

//grunt.registerTask('default', ['jshint', 'mochaTest', 'js_beautify:files:all']);
grunt.registerTask('default', ['jshint', 'js_beautify:files:all']);
grunt.registerTask('test', ['mochaTest']);
