const fs = require('fs');
const path = require('path');
const js_yaml = require('js-yaml');
const plist = require('plist');

const inputGrammar = 'src/apex.tmLanguage.yml';
const inputSoqlGrammarTemplate = 'src/soql.tmLanguage.template.yml';
const grammarsDirectory = 'grammars/';

function handleError(err) {
  console.error(err.toString());
  process.exit(-1);
}

try {
  // Create grammars directory if it doesn't exist
  if (!fs.existsSync(grammarsDirectory)) {
    fs.mkdirSync(grammarsDirectory);
  }

  // Read and parse both grammars
  const soqlGrammar = js_yaml.load(fs.readFileSync(inputSoqlGrammarTemplate));
  const apexGrammar = js_yaml.load(fs.readFileSync(inputGrammar));

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

  // Convert to plist and write
  const plistData = plist.build(soqlGrammar);
  fs.writeFileSync(path.join(grammarsDirectory, 'soql.tmLanguage'), plistData);
  console.log('Successfully built SOQL grammar');
} catch (err) {
  handleError(err);
}
