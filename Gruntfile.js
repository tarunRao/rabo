'use strict';

module.exports  = function(grunt) {
    require('jit-grunt')(grunt);

  grunt.initConfig({
    watch: {
      files: "src/assets/styles/*.less",
      task: ["less"],
      options: {
          nospawn: true
        }
    },
    less: {
      build: {
        options: {
          paths: ["src/assets/styles"],
          //yuicompress: true
        },
        files: [{
          expand: true,
          cwd: "src/assets/styles",
          src: ["*.less"],
          dest: "src/assets/css/",
          ext: ".css"
        }]
      }
    }
  });

    //grunt.loadNpmTasks("grunt-contrib-less");
    //grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("default", ["less", "watch"]);
}
