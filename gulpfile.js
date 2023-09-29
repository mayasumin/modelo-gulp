//Imports
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

//Functions 

/* Compila o sass, adiciona o autoprefixed e da refresh na página
    gulp.scr diz em qual pasta ele vai pegar os arquivos pra converter
    outputStyle comprime o que é convertido
    autoprefixer define as versões do browser que os prefixos serão válidos
    gulp.dest diz o destino dos arquivos convertidos 
    stream: não atualiza a página, só injeta css nela*/
function compileSass() {
    return gulp.src('styles/scss/*.scss')
        .pipe(sass({outputStyle : 'compressed'}))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false,
        }))
        .pipe(gulp.dest('styles/css/'))
        .pipe(browserSync.stream());
}


function pluginsCSS() {
    return gulp.src('./styles/css/lib/*.css')
    .pipe(concat('plugins.css'))
    .pipe(gulp.dest('styles/css/'))
    .pipe(browserSync.stream());
}

/* concatena os arquivos js, usa o babel pra transformar o js pra versões anteriores, mimetiza ele e da refresh */
function concatJS() {
    return gulp.src('js/scripts/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js/'))
        .pipe(browserSync.stream());
}

/* concatena as lib */
function pluginsJS() {
    return gulp.src(['./js/lib/aos.min.js','./js/lib/swiper.min.js'])
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream());
}

/* cria o servidor local */
function browser() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
}

/* Fica olhando se tem alguma alteração nos arquivos Sass e nos html. Reload atualiza a página*/
function watch() {
    gulp.watch('styles/scss/*.scss', compileSass);
    gulp.watch('styles/css/lib/*.css', pluginsCSS);
    gulp.watch('*.html').on('change', browserSync.reload);
    gulp.watch('js/scripts/*js', concatJS);
    gulp.watch('js/lib/*.js', pluginsJS);
}

//Tasks
gulp.task('sass', compileSass);
gulp.task('watch', watch)
gulp.task('browser-sync', browser);
gulp.task('concatjs', concatJS);
gulp.task('pluginjs', pluginsJS);
gulp.task('plugincss', pluginsCSS)

//task principal
gulp.task('default', gulp.parallel('watch', 'browser-sync', 'sass', 'plugincss', 'concatjs', 'pluginjs'));