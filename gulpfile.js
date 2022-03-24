const fs = require('fs')
const path = require('path')
const gulp = require('gulp')
const cssmin = require('gulp-cssmin')
const prefixer = require('gulp-autoprefixer')
const less = require('gulp-sass')
const sass = require('gulp-less')
const htmlmin = require('gulp-htmlmin')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const del = require('del')
const server = require('gulp-webserver')

const cssHandle = () => {
	return gulp.src('./src/css/*.css')
		.pipe(prefixer())
		.pipe(cssmin())
		.pipe(gulp.dest('./dist/css'))
}
const sassHandle = () => {
	return gulp.src('./src/scss/*.scss')
		.pipe(sass())
		.pipe(prefixer())
		.pipe(cssmin())
		.pipe(gulp.dest('./dist/css'))
}
const lessHandle = () => {
	return gulp.src('./src/less/*.less')
		.pipe(less())
		.pipe(prefixer())
		.pipe(cssmin())
		.pipe(gulp.dest('./dist/css'))
}

const htmlHandle = () => {
	return gulp.src('./public/*.html')
		.pipe(htmlmin({
				'collapseWhitespace': true,
				'removeAttributeQuotes': true,
				'collapseBooleanAttributes': true,
				'removeComments': true,
				'minifyCss': true,
				'minifyJs': true
			})
				.pipe(gulp.dest('./dist/public'))
		)
}

const jsHandle = () => {
	return gulp.src('./src/js/*.js')
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js'))
}

const libHandle = () => {
	return gulp.src('./src/lib/**')
		.pipe(gulp.dest('./dist/lib'))
}

const imgHandle = () => {
	return gulp.src('./src/img/*.{png,jpg,gif,ico}')
		.pipe(gulp.dest('./dist/img'))
}

const fontsHandle = () => {
	return gulp.src('./fonts/**')
		.pipe(gulp.dest('./dist/fonts'))
}

const delHandle = () => {
	if (fs.existsSync(path.dirname(path.resolve(__dirname, './dist')))) {
		return del('./dist');
	}
}

const watchHandle = () => {
	gulp.watch('./public/*.html', htmlHandle)
	gulp.watch('./src/css/*.css', cssHandle)
	gulp.watch('./src/less/*.less', lessHandle)
	gulp.watch('./src/scss/*.scss', sassHandle)
	gulp.watch('./src/js/*.js', jsHandle)
	gulp.watch('./src/lib/*.js', libHandle)
	gulp.watch('./src/img/**', imgHandle)
	gulp.watch('./src/fonts/**', fontsHandle)
}

const webHandle = () => {
	return gulp.src('./dist')
		.pipe(server({
			port: 9999,
			open: '/public/index.html',
			livereload: true
		}))
}

module.exports.default = gulp.series(
	delHandle,
	gulp.parallel(
		htmlHandle,
		cssHandle,
		lessHandle,
		sassHandle,
		jsHandle,
		libHandle,
		imgHandle,
		fontsHandle
	),
	webHandle,
	watchHandle
)
