# Salesforce Apex Language Grammar

[![CircleCI](https://circleci.com/gh/forcedotcom/apex-tmLanguage.svg?style=svg)](https://circleci.com/gh/forcedotcom/apex-tmLanguage)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Introduction

This repository contains the source code for generating the language grammar files for Salesforce's Apex.

## Disclaimer

Development and setup of this project has not been tested for Windows OS. You may see a node-gyp error - [follow the instrutions here to resolve it](https://github.com/nodejs/node-gyp/blob/master/README.md).

## Development

To **build and test** install Node.js do the following:

- Run `npm install` to install any dependencies.
- Run `gulp` to build.
- Run `npm run test` to run tests.

Output grammars are output in the `grammars/` directory.

To see the token changes from within the Salesforce VS Code Extensions:

1. Copy the `apex.tmLanguage` results into `../salesforcedx-vscode/packages/salesforcedx-vscode-apex/node_modules/@salesforce/apex-tmlanguage/grammars/apex.tmLanguage`.
2. From the `Command Palette` select `Developer: Inspect Editor Tokens and Scopes`.

### Adding grammar rules

Token structure is based off of [Textmate's Language Grammar guidelines](https://manual.macromates.com/en/language_grammars)

### Tests for SOQL grammar

For the standalone SOQL grammar, tests are executed with [vscode-tmgrammar-tests](https://github.com/PanAeon/vscode-tmgrammar-test).

    test/soql/
    |-- simple_account.soql "Manually" created test cases
    |-- ...
    `-- snapshots/          "Snapshot-based" test cases
        |-- example-*.soql
        |-- example-*.soql.snap
        `-- ...

The difference between manual vs. snapshot tests is that the latter are auto-generated and can be updated with command `vscode-tmgrammar-snap -u`. They are useful to quickly see the output of applying the grammar and catch regressions.

The example-\* queries were taken from [Example SELECT clauses](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql_select_examples.htm).

## Supported outputs

- `grammars/apex.tmLanguage.cson` - for Atom
- `grammars/apex.tmLanguage` - TextMate grammar (XML plist)
- `grammars/soql.tmLanguage` - TextMate grammar (XML plist) for standalone SOQL files

## Releasing

Tags on this repo get automatically published as a GitHub release and an NPM package through Travis CI.

## Attribution

This repository was copied from [https://github.com/dotnet/csharp-tmLanguage](https://github.com/dotnet/csharp-tmLanguage)
