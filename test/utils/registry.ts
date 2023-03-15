import * as path from 'path';
import * as fs from 'fs';
import * as vscodeTM from 'vscode-textmate';
import * as oniguruma from 'vscode-oniguruma';

const grammarPaths = {
  apex: path.resolve(__dirname, '../../../grammars/apex.tmLanguage'),
  soql: path.resolve(__dirname, '../../../grammars/soql.tmLanguage'),
};

const wasmBin = fs.readFileSync(
  path.resolve(
    process.cwd(),
    './node_modules/vscode-oniguruma/release/onig.wasm'
  )
).buffer;

const onigLibPromise = oniguruma.loadWASM(wasmBin).then(() => {
  return {
    createOnigScanner(patterns) {
      return new oniguruma.OnigScanner(patterns);
    },
    createOnigString(s) {
      return new oniguruma.OnigString(s);
    },
  };
});

export class TMRegistry {
  public grammars: { [key: string]: vscodeTM.IGrammar };
  public registry: vscodeTM.Registry;

  constructor() {
    this.grammars = {};
    this.registry = new vscodeTM.Registry({
      onigLib: onigLibPromise,
      loadGrammar: (scopeName) => this.loadGrammar(scopeName),
    });
  }

  loadGrammar(scopeName): Promise<any> {
    const grammarPath = grammarPaths[scopeName];
    if (this.grammars[scopeName]) {
      return new Promise<vscodeTM.IGrammar>((resolve, reject) => {
        resolve(this.grammars[scopeName]);
      });
    }
    return new Promise<vscodeTM.IGrammar>((resolve, reject) => {
      const content = fs.readFileSync(grammarPath);
      const rawGrammar = vscodeTM.parseRawGrammar(content.toString());
      this.registry.addGrammar(rawGrammar).then((ig) => {
        resolve((this.grammars[scopeName] = ig));
      });
    });
  }
}
