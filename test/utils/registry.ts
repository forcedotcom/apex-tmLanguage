import * as path from 'path';
import * as fs from 'fs';
import * as vscodeTM from 'vscode-textmate';

const grammarPaths = {
  'apex': path.resolve(__dirname, '../../../grammars/apex.tmLanguage'),
};

export class TMRegistry {
    public grammars: {[key: string]: vscodeTM.IGrammar};
    public registry: vscodeTM.Registry;
    constructor() {
        this.grammars = {};
        this.registry = new vscodeTM.Registry();
    }

    loadGrammar(scopeName) {
        const grammarPath = grammarPaths[scopeName];
        if (this.grammars[scopeName]) {
            return new Promise<vscodeTM.IGrammar>((resolve, reject) => {
                resolve(this.grammars[scopeName]);
            });
        }
        return new Promise<vscodeTM.IGrammar>((resolve, reject) => {
            const content = fs.readFileSync(grammarPath);
            const rawGrammar = vscodeTM.parseRawGrammar(content.toString());
            this.registry.addGrammar(rawGrammar).then(ig => {
                resolve(this.grammars[scopeName] = ig);
            })
        });
    } 
  }