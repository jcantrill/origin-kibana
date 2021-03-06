module.exports = function (grunt) {
  
  var releaseBase = 'origin-kibana-';
  var releaseTag = 'v' + grunt.file.readJSON('package.json').version;
  var releaseFile = releaseBase + releaseTag  + ".tgz";
    
  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),
    less: {
      production: {
        paths : [
          "lib/components/patternfly/fonts"
        ],
        src: '**/main.less',
        expand: true,
        ext: '.css',
        options: {
          sourceMap: false
        }
      }
    },
    copy: {
      dist: {
        options: {
          timestamp: true
        },
        files: [
          {
            expand: true,
            cwd: 'lib/',
            src: ['**/*', '!**/*.less','!**/fonts/**','!**/fa-fonts/**'],
            dest: 'dist/',
            filter: 'isFile'
          },
          {
            expand: true,
            flatten: true,
            cwd: 'bower_components/patternfly/dist/fonts',
            src: '**',
            dest: 'dist/styles/fonts/'
          },
          {
            expand: true,
            flatten: true,
            cwd: 'bower_components/patternfly/components/font-awesome/fonts',
            src: '**',
            dest: 'dist/styles/fa-fonts/'
          }
        ]
      }
    },
    clean: ['dist', releaseBase + '*'],
    compress: {
      options: {
        pretty: true,
        archive: releaseFile,
        mode: 'tgz'
      },
      files: {
        expand: true,
        cwd: 'dist',
        src: '**/*',
        dest: '.',
      }
    },
    'github-release' : {
      files : {
        src: [releaseFile]
      },
      options: {
        repository: 'openshift/origin-kibana',
        auth : {
          user: process.env.GITHUB_USERNAME,
          password: process.env.GITHUB_PASSWORD
        },
        release : {
          tag_name: releaseTag,
          name: releaseTag,
          prerelease: false
        }
      }
    }
    
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-github-releaser');

  grunt.registerTask('default', ['clean','less','copy']);
  grunt.registerTask('release', ['default', 'compress','github-release']);
};
