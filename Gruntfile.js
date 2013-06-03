var cabinConfig = {
  src: 'src',
  dev: '.tmp',
  dist: 'dist'
};

var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    cabin: cabinConfig,
    watch: {
      options: {
        livereload: true
      },
      compass: {
        files: ['<%= cabin.src %>/styles/{,*/}*'],
        tasks: ['compass:server']
      },
      pages: {
        files: ['src/pages/**/*', 'posts/{,*/}*', 'src/layouts/{,*/}*'],
        tasks: ['pages']
      }
    },
    pages: {
      posts: {
        src: 'posts',
        dest: '<%= cabin.dev %>',
        layout: '<%= cabin.src%>/layouts/post.jade',
        url: ':title'
      }
    },
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
            '<%= cabin.dev %>',
            '<%= cabin.dist %>/*',
            // This is for making a subtree repo don't delete
            '!<%= cabin.dist %>/.git*'
          ]
        }]
      },
      server: '<%= cabin.dev %>'
    },
    compass: {
      options: {
        sassDir: '<%= cabin.src %>/styles',
        cssDir: '<%= cabin.dev %>/styles',
        imagesDir: '<%= cabin.src %>/images',
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
          cwd: '<%= cabin.src %>',
          dest: '<%= cabin.dev %>',
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
