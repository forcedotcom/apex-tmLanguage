/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Modifications Copyright (c) 2018 Salesforce.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe('Grammar', () => {
  before(() => {
    should();
  });

  describe('Type names', () => {
    it('built-in type - object', async () => {
      const input = Input.InClass(`Object x;`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.PrimitiveType.Object,
        Token.Identifiers.FieldName('x'),
        Token.Punctuation.Semicolon,
      ]);
    });

    it('generic type - List<Integer>', async () => {
      const input = Input.InClass(`List<Integer> x;`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Type('List'),
        Token.Punctuation.TypeParameters.Begin,
        Token.PrimitiveType.Integer,
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.FieldName('x'),
        Token.Punctuation.Semicolon,
      ]);
    });

    it('generic type with multiple parameters - Dictionary<Integer, Integer>', async () => {
      const input = Input.InClass(`Dictionary<Integer, Integer> x;`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Type('Dictionary'),
        Token.Punctuation.TypeParameters.Begin,
        Token.PrimitiveType.Integer,
        Token.Punctuation.Comma,
        Token.PrimitiveType.Integer,
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.FieldName('x'),
        Token.Punctuation.Semicolon,
      ]);
    });

    it('qualified generic type - System.Collections.Generic.List<Integer>', async () => {
      const input = Input.InClass(
        `System.Collections.Generic.List<Integer> x;`
      );
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.TypeText('Collections'),
        Token.Punctuation.Accessor,
        Token.Support.Class.TypeText('Generic'),
        Token.Punctuation.Accessor,
        Token.Support.Class.TypeText('List'),
        Token.Punctuation.TypeParameters.Begin,
        Token.PrimitiveType.Integer,
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.FieldName('x'),
        Token.Punctuation.Semicolon,
      ]);
    });

    it('nullable type - int', async () => {
      const input = Input.InClass(`Integer x;`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.PrimitiveType.Integer,
        Token.Identifiers.FieldName('x'),
        Token.Punctuation.Semicolon,
      ]);
    });

    it('Id type (lowercase d) - Apex is case-insensitive', async () => {
      const input = Input.InClass(`Id recordId;`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.PrimitiveType.ID,
        Token.Identifiers.FieldName('recordId'),
        Token.Punctuation.Semicolon,
      ]);
    });

    it('ID type (uppercase D) - Apex is case-insensitive', async () => {
      const input = Input.InClass(`ID recordId;`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        { text: 'ID', type: 'keyword.type.apex' },
        Token.Identifiers.FieldName('recordId'),
        Token.Punctuation.Semicolon,
      ]);
    });

    it('Id in generic type parameter', async () => {
      const input = Input.InClass(`Map<Id, Account> accounts;`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Type('Map'),
        Token.Punctuation.TypeParameters.Begin,
        Token.PrimitiveType.ID,
        Token.Punctuation.Comma,
        Token.Type('Account'),
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.FieldName('accounts'),
        Token.Punctuation.Semicolon,
      ]);
    });

    it('ID in generic type parameter', async () => {
      const input = Input.InClass(`Map<ID, Account> accounts;`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Type('Map'),
        Token.Punctuation.TypeParameters.Begin,
        { text: 'ID', type: 'keyword.type.apex' },
        Token.Punctuation.Comma,
        Token.Type('Account'),
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.FieldName('accounts'),
        Token.Punctuation.Semicolon,
      ]);
    });
  });
});
