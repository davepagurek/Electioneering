
var path = require("path");

module.exports = function(grunt) {

  var rubyChild = null;
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      everything: {
        files: {
          "public/stylesheets/app.css": "stylesheets/app.scss"
        }
      },
    },
    watch: {
      css: {
        files: ['stylesheets/*.scss'],
        tasks: ['sass:everything']
      },
      ruby: {
        files: ['server.rb'],
        tasks: ['runserver']
      },
      map: {
        files: ['script/mapgen.rb'],
        tasks: ['genmap']
      }
    },

    webpack: {
      everything: {
        context: path.join(__dirname, "javascripts/"),
        // entry: grunt.file.expand({cwd: path.join(__dirname, "javascripts/")}, "*.js").reduce(function(map, filename){
        //   var basename = filename.split(".")[0];
        //   map[basename] = "./" + filename.split(".")[0];
        //   return map;
        // }, {}),
        entry: path.join(__dirname, "javascripts/app.js"),
        output: {
          filename: "app.js",
          path: path.join(__dirname, "public/javascripts/")
        },
        devtool: "#source-map",
        debug: true,
        watch: true,
        module: {
          loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
          ]
        },
      }
    },
  });

  grunt.registerTask('runserver', 'Run the sinatra server', function() {

    if (rubyChild) {
      rubyChild.kill();
    }
    rubyChild = grunt.util.spawn({
      cmd: "ruby",
      args: ['server.rb'],
      opts: {stdio: 'inherit'},
    })

  });

  grunt.registerTask('genmap', 'Generate a new map', function() {
    grunt.util.spawn({
      cmd: "ruby",
      args: ['script/mapgen.rb'],
      opts: {stdio: 'inherit'},
    })
  });

  process.on('exit', function(){
    if (rubyChild) {
      rubyChild.kill();
    }
  })

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['webpack:everything', 'sass', 'runserver', 'watch']);

};
