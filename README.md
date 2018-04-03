## Development

To **build and test** install Node.js do the following:

* Run `npm install` to install any dependencies.
* Run `gulp` to build and run tests.

Output grammars are output in the `grammars\` dirctory.

On Windows you may see a node-gyp error - [follow the instrutions here to resolve it](https://github.com/nodejs/node-gyp/blob/master/README.md).

## Supported outputs

* `grammars\apex.tmLanguage.cson` - for Atom
* `grammars\apex.tmLanguage` - TextMate grammar (XML plist)


## Releasing

Tags on this repo get automatically published as a GitHub release and an NPM package through Travis CI.

## Attribution
This repository was copied from [https://github.com/dotnet/csharp-tmLanguage](https://github.com/dotnet/csharp-tmLanguage)