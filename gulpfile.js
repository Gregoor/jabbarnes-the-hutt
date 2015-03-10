var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglifyjs');

gulp.task('default', function () {
	return browserify({
			entries: './src/jabbarnes-the-hutt.js',
			debug: true
		})
		.transform(babelify)
		.bundle()
		.pipe(source('output.js'))
		.pipe(gulp.dest('dist'));
});