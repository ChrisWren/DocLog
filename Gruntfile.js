var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  var cabin = grunt.file.readJSON('cabin.json');

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
    pages: cabin.gruntPages,
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
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'src')
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              // Cant use cabinConfig variables here
              mountFolder(connect, 'dist')
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
            '.tmp',
            'dist/*',
            // This is for making a subtree repo don't delete
            '!dist/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    compass: {
      options: {
        sassDir: 'src/styles',
        cssDir: '.tmp/styles',
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
          dest: '.tmp',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            'images/{,*/}*.{webp,gif}',
            'styles/fonts/*',
            'styles/*.css'
          ]
        }]
      }
    }
  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

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

  grunt.registerTask('default', [
    'build'
  ]);
};
