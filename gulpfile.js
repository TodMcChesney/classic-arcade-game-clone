const gulp = require('gulp');
const browserSync = require('browser-sync');

/** Running dev tasks from CLI
* 'npm run gulp' (Runs browserSync and watches for changes)
*/

// browserSync
gulp.task('browserSync', () =>
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
);

// gulp (Set default 'gulp' task to run browserSync and watch for changes)
gulp.task('default', ['browserSync'], () => {
    gulp.watch('js/*.js', browserSync.reload);
    gulp.watch('css/style.css', browserSync.reload);
    gulp.watch('index.html', browserSync.reload);
    gulp.watch('images/*.png', browserSync.reload);
});
