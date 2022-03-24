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
	return gulp
		.src('./src/css/*.css')
		.pipe(prefixer())
		.pipe(cssmin())
		.pipe(gulp.dest('./dist/css'))
}
const sassHandle = () => {
	return gulp
		.src('./src/scss/*.scss')
		.pipe(sass())
		.pipe(prefixer())
		.pipe(cssmin())
		.pipe(gulp.dest('./dist/css'))
}
const lessHandle = () => {
	return gulp
		.src('./src/less/*.less')
		.pipe(less())
		.pipe(prefixer())
		.pipe(cssmin())
		.pipe(gulp.dest('./dist/css'))
}

const htmlHandle = () => {
	return (
		gulp
			.src('./public/*.html')
			// 压缩html需要配置压缩的参数
			.pipe(
				htmlmin({
					collapseWhitespace: true, //压缩空格
					removeAttributeQuotes: true, //移除属性的引号
					collapseBooleanAttributes: true, //把值为布尔值的属性简写
					removeComments: true, //移除注释
					minifyCSS: true, //把页面里面的style标签里面的css样式也去空格
					minifyJS: true, //把页面里的script标签里面的js代码给去空格
				})
			)
			.pipe(gulp.dest('./dist/pages'))
	)
}

const jsHandle = () => {
	return gulp
		.src('./src/js/*.js')
		.pipe(
			babel({
				presets: ['@babel/env'],
			})
		)
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js'))
}

const libHandle = () => {
	return gulp.src('./src/lib/**').pipe(gulp.dest('./dist/lib'))
}

const imgHandle = () => {
	return gulp.src('./src/img/*.{png,jpg,gif,ico}').pipe(gulp.dest('./dist/img'))
}

const fontsHandle = () => {
	return gulp.src('./fonts/**').pipe(gulp.dest('./dist/fonts'))
}

const delHandle = () => {
	if (fs.existsSync(path.dirname(path.resolve(__dirname, './dist')))) {
		return del('./dist')
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
	return gulp.src('./dist').pipe(
		server({
			port: 9999,
			open: '/pages/index.html',
			livereload: true,
			proxies: [
				{
					source: '/weather',
					target: 'https://way.jd.com/jisuapi/weather',
				},
			],
		})
	)
}

exports.default = gulp.series(
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
