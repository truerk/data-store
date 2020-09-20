const gulp = require('gulp');
const svgSprite = require('gulp-svg-sprite');

config = {
    shape: {
        spacing: { // Add padding
            padding: 2
        }
    },
    mode: {
        view: { // Activate the «view» mode
            bust: true,
            render: {
                css: true // Activate Sass output (with default options)
            }
        },
    }
};

gulp.task('sprite', function () {
    return gulp.src('../src/assets/icons/*.svg')
        .pipe(svgSprite(config))
        .pipe(gulp.dest('../src/assets/sprite'));
});
