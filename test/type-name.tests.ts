/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe('Grammar', () => {
  before(() => should());

  describe('Type names', () => {
    it('built-in type - object', () => {
      const input = Input.InClass(`Object x;`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.PrimitiveType.Object,
        Token.Identifiers.FieldName('x'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('generic type - List<Integer>', () => {
      const input = Input.InClass(`List<Integer> x;`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Type('List'),
        Token.Punctuation.TypeParameters.Begin,
        Token.PrimitiveType.Integer,
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.FieldName('x'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('generic type with multiple parameters - Dictionary<Integer, Integer>', () => {
      const input = Input.InClass(`Dictionary<Integer, Integer> x;`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Type('Dictionary'),
        Token.Punctuation.TypeParameters.Begin,
        Token.PrimitiveType.Integer,
        Token.Punctuation.Comma,
        Token.PrimitiveType.Integer,
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.FieldName('x'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('qualified generic type - System.Collections.Generic.List<Integer>', () => {
      const input = Input.InClass(
        `System.Collections.Generic.List<Integer> x;`
      );
      const tokens = tokenize(input);

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
        Token.Punctuation.Semicolon
      ]);
    });

    it('nullable type - int', () => {
      const input = Input.InClass(`Integer x;`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.PrimitiveType.Integer,
        Token.Identifiers.FieldName('x'),
        Token.Punctuation.Semicolon
      ]);
    });
  });
});
