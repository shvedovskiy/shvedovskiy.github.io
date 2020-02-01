const gulp = require('gulp');
const del = require('del');
const run = require('run-sequence');
const g = require('gulp-load-plugins')({
  pattern: ['gulp-*']
});

const conf = {
  paths: {
    src: 'src',
    dist: 'dist',
    css: [
      'src/css/normalize.css',
      'src/css/fonts.css',
      'src/css/main.css',
      '!node_modules/**/*.css'
    ],
    html: [
      'src/*.html',
      '!node_modules/**/*.html'
    ],
    js: [
      'src/js/*.js',
      '!node_modules/**/*.js'
    ],
    assets: [
      'src/assets/**/*'
    ]
  },
  browsers: [
    'last 2 Chrome versions',
    'last 2 Edge versions',
    'last 2 Firefox versions',
    'Safari >= 8',
    'iOS >= 8',
    'IE 11'
  ]
};

gulp.task('css', () =>
  gulp.src(conf.paths.css)
    .pipe(g.importCss())
    .pipe(g.autoprefixer({
      browsers: conf.browsers,
      cascade: false
    }))
    .pipe(g.concatCss('main.css'))
    .pipe(g.cleanCss({
      compatibility: '*',
      rebase: false
    }))
    .pipe(gulp.dest(conf.paths.dist))
);

gulp.task('html', () =>
  gulp.src(conf.paths.html)
    .pipe(g.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(gulp.dest(conf.paths.dist))
);

gulp.task('js', () =>
  gulp.src(conf.paths.js)
    .pipe(g.uglify())
    .pipe(gulp.dest(conf.paths.dist))
);

gulp.task('assets', () =>
  gulp.src(conf.paths.assets, { base: conf.paths.src })
    .pipe(gulp.dest(conf.paths.dist))
);


gulp.task('clean', cb =>
  del([
    conf.paths.dist
  ], { force: true }, cb)
);

gulp.task('watch', () => {
  gulp.watch(conf.paths.css, () => {
    run('css');
  });
  gulp.watch(conf.paths.html, () => {
    run('html');
  });
  gulp.watch(conf.paths.js, () => {
    run('js');
  });
  gulp.watch(conf.paths.assets, () => {
    run('assets');
  });
});

gulp.task('prepare', cb => {
  run(['css', 'html', 'js', 'assets'], cb);
});

gulp.task('build', ['clean'], cb => {
  run('prepare', cb);
});

gulp.task('default', ['watch']);
