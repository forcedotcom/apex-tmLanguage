const fs = require('fs');
const path = require('path');
const js_yaml = require('js-yaml');
const plist = require('plist');

const inputGrammar = 'src/apex.tmLanguage.yml';
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

  // Read and parse YAML
  const text = fs.readFileSync(inputGrammar);
  const jsonData = js_yaml.load(text);

  // Convert to plist
  const plistData = plist.build(jsonData);

  // Write the output file
  fs.writeFileSync(path.join(grammarsDirectory, 'apex.tmLanguage'), plistData);
  console.log('Successfully built TextMate grammar');
} catch (err) {
  handleError(err);
}
