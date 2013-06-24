var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  var gruntPagesConfig = JSON.parse(grunt.template.process(grunt.file.read('cabin.json'), { data: {templateLang: 'jade'}})).gruntPages;

  grunt.initConfig({
    watch: {
      options: {
        livereload: true
      },
      compass: {
        files: ['src/styles/{,*/}*'],
        tasks: ['compass:server']
      },
      pages: {
        files: ['src/pages/**/*', 'posts/{,*/}*', 'src/layouts/{,*/}*'],
        tasks: ['pages']
      }
    },
    pages: gruntPagesConfig,
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              // These dir names have to be hardcoded
              mountFolder(connect, 'dist'),
              mountFolder(connect, 'src')
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:9000'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            'dist/*',
            // This is for making a subtree repo don't delete
            '!dist/.git*'
          ]
        }]
      },
      server: 'dist'
    },
    compass: {
      options: {
        sassDir: 'src/styles',
        cssDir: 'dist/styles',
        imagesDir: 'src/images',
        relativeAssets: true
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    // Put files not handled in other tasks here
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'src',
          dest: 'dist',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            'images/**',
            'styles/fonts/*',
            'styles/*.css'
          ]
        }]
      }
    },
    simplemocha: {
      options: {
        globals: ['should'],
        timeout: 6000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'nyan'
      },
      all: {
        src: ['test/*.js']
      }
    }
  });

  grunt.registerTask('server', function (target) {

    grunt.task.run([
      'clean:server',
      'compass:server',
      'copy',
      'pages',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'compass:dist',
    'pages',
    'copy'
  ]);

  grunt.registerTask('test', [
    'simplemocha'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};
