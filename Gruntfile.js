// Generated on 2014-11-21 using generator-sillypog 1.0.1

module.exports = function(grunt){

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		env: {
			dev: { NODE_ENV: 'DEVELOPMENT'},
			prod: { NODE_ENV: 'PRODUCTION'}
		},
		jshint: {
			all: [
				'package.json',
				'Gruntfile.js',
				'src/js/*.js'
			],
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			}
		},
		sass: {
			dist: {
				files: { 'build/css/<%= _.slugify(pkg.name) %>.css': 'src/scss/<%= _.slugify(pkg.name) %>.scss'}
			}
		},
		clean: ['build'],
		copy: {
			main: {
				files: [
					{cwd: 'src/assets', src:['**/*.*'], dest:'build/', expand:true},
					{src:'bower_components/jquery/jquery.min.js', dest:'build/jquery.min.js'},
					{src:'src/favicon.ico', dest:'build/favicon.ico'}
				]
			}
		},
		asset_packager: {
			options: {
				index: 'src/index.html',
				dest: 'build'
			},
			build: {
				files: [
					{ src: ['src/asset_packages/**/*.pkg'], expand: true }
				]
			}
		},
		watch: {
			files: ['src/**'],
			tasks: ['dev']
		},
		connect: {
			server: {
				options: {
					port: 9001,
					keepalive: true,
					hostname: '',
					base: 'build'
				}
			} 
		}
	});

	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Default task(s).
	grunt.registerTask('common', ['sass', 'asset_packager', 'copy:main']);

	grunt.registerTask('dev', ['env:dev', 'jshint', 'common']);
	grunt.registerTask('prod', ['env:prod', 'clean', 'common']);

	grunt.registerTask('default', ['dev']);
};
