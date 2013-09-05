module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	env: {
	  dev: {
		NODE_ENV: 'DEVELOPMENT'
	  },
	  build: {
		NODE_ENV: 'PRODUCTION'
	  }
	},
	preprocess: {
	  index: {
		  src: '_index.html',
		  dest: 'index.html'
	  }
	},
	concat: {
	  js: {
		options: {
			separator: ';\n\n'
		},
		src: ['js/**/*.js'],
		dest: 'build/<%= pkg.name %>.js'
	  }
	},
	uglify: {
	  options: {
		banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
	  },
	  dist: {
		files: {
		  'build/<%= pkg.name %>.js': ['<%= concat.js.dest %>']
		}
	  }
	}
  });

  // Load the plugins.
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('dev', ['env:dev', 'preprocess']);
  grunt.registerTask('build', ['env:build', 'preprocess', 'concat', 'uglify']);
  grunt.registerTask('default', ['dev']);
};