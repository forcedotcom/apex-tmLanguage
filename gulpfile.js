const gulp = require('gulp');
const mocha = require('gulp-mocha');
const json2cson = require('gulp-json2cson');
const yaml = require('gulp-yaml');
const ts = require('gulp-typescript');
const js_yaml = require('js-yaml');
const plist = require('plist');
const fs = require('fs');
const path = require('path');

const inputGrammar = 'src/apex.tmLanguage.yml';
const inputSoqlGrammarTemplate = 'src/soql.tmLanguage.template.yml';
const grammarsDirectory = 'grammars/';
const jsOut = 'out/';

function handleError(err) {
  console.log(err.toString());
  process.exit(-1);
}

gulp.task('buildTmLanguage', function (done) {
  const text = fs.readFileSync(inputGrammar);
  const jsonData = js_yaml.load(text);
  const plistData = plist.build(jsonData);

  if (!fs.existsSync(grammarsDirectory)) {
    fs.mkdirSync(grammarsDirectory);
  }

  fs.writeFileSync(path.join(grammarsDirectory, 'apex.tmLanguage'), plistData);
  done();
});

gulp.task('buildAtom', function () {
  return gulp
    .src(inputGrammar)
    .pipe(yaml())
    .pipe(json2cson())
    .pipe(gulp.dest(grammarsDirectory))
    .on('error', handleError);
});

gulp.task('buildSoqlTmLanguage', function (done) {
  const soqlGrammar = js_yaml.load(fs.readFileSync(inputSoqlGrammarTemplate));
  const apexGrammar = js_yaml.load(fs.readFileSync(inputGrammar));

  if (!fs.existsSync(grammarsDirectory)) {
    fs.mkdirSync(grammarsDirectory);
  }

  // Merge the repository of rules from Apex grammar
  soqlGrammar['repository'] = Object.assign(
    {},
    apexGrammar.repository,
    soqlGrammar['repository']
  );

  // Remove the comments rule SOQL query expression
  const apexGrammarSoqlExpressionPatterns =
    apexGrammar['repository']['soql-query-expression']['patterns'];
  soqlGrammar['repository']['soql-query-expression']['patterns'] =
    apexGrammarSoqlExpressionPatterns.filter(
      (pattern) => pattern.include !== '#comment'
    );

  fs.writeFileSync(
    path.join(grammarsDirectory, 'soql.tmLanguage'),
    plist.build(soqlGrammar)
  );
  done();
});

gulp.task('compile', function () {
  const tsProject = ts.createProject('./tsconfig.json');
  return tsProject
    .src()
    .pipe(tsProject())
    .pipe(gulp.dest(jsOut + 'test'));
});

gulp.task(
  'test',
  gulp.series(['compile'], () => {
    return gulp
      .src(jsOut + 'test/**/*.tests.js')
      .pipe(mocha())
      .on('error', handleError);
  })
);

gulp.task(
  'default',
  gulp.series(
    ['buildAtom', 'buildTmLanguage', 'buildSoqlTmLanguage'],
    function (done) {
      done();
    }
  )
);
