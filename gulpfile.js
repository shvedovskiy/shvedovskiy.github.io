const {series, parallel, watch, src, dest} = require('gulp');
const browserSync = require('browser-sync').create();
const del = require('del');
const htmlMin = require('gulp-htmlmin');
const gulpIf = require('gulp-if');
const inject = require('gulp-inject');
const postcss = require('gulp-postcss');
const postcssImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const eventStream = require('event-stream');

const isProduction = process.env.NODE_ENV === 'production';
const conf = {
  paths: {
    src: 'src',
    dist: 'dist',
    html: 'src/**/*.html',
    css: 'src/**/*.css',
    cssEntry: 'src/styles/index.css',
    js: 'src/**/*.js',
    jsEntry: 'src/scripts/main.js',
    assets: 'src/assets/**/*',
  },
  browsers: [
    'last 2 versions',
    'not dead',
    '> 0.5%',
  ],
};
const postCSSConfig = [
  postcssImport(),
  postcssPresetEnv({
    browsers: conf.browsers,
  }),
  isProduction && cssnano({
    preset: ['default', {
      mergeIdents: true,
      reduceIdents: true,
    }]
  }),
].filter(Boolean);

function clean() {
  return del(conf.paths.dist, {force: true});
}

function index(cb) {
  const css = src(conf.paths.cssEntry)
    .pipe(postcss(postCSSConfig));

  const js = src(conf.paths.jsEntry)
    .pipe(gulpIf(isProduction, terser({
      toplevel: true,
    })));

  src(conf.paths.html)
    .pipe(inject(eventStream.merge(css, js), {
      transform(filepath, file) {
        if (filepath.endsWith('.css')) {
          return `<style>${file.contents.toString('utf8')}</style>`;
        } else if (filepath.endsWith('.js')) {
          return `<script>${file.contents.toString('utf8')}</script>`;
        }
      },
    }))
    .pipe(gulpIf(isProduction, htmlMin({
      collapseBooleanAttributes: true,
      collapseInlineTagWhitespace: false,
      collapseWhitespace: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
    })))
    .pipe(dest(conf.paths.dist));
  cb();
}

function assets(cb) {
  src(conf.paths.assets, { base: conf.paths.src })
    .pipe(dest(conf.paths.dist))
    .pipe(browserSync.stream());
  cb();
}

function serve() {
  browserSync.init({
    open: false,
    notify: false,
    server: conf.paths.dist,
  });
  watch([conf.paths.html, conf.paths.css, conf.paths.js], index).on('change', browserSync.reload);
  watch(conf.paths.assets, assets);
}

exports.serve = series(clean, parallel(index, assets), serve);
exports.default = series(clean, parallel(index, assets));
