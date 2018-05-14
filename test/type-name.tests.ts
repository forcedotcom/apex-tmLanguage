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

    it('qualified name - System.Object', () => {
      const input = Input.InClass(`System.Object x;`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Type('System'),
        Token.Punctuation.Accessor,
        Token.PrimitiveType.Object,
        Token.Identifiers.FieldName('x'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('tuple type - (Integer, Integer)', () => {
      const input = Input.InClass(`(Integer, Integer) x;`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Punctuation.Comma,
        Token.PrimitiveType.Integer,
        Token.Punctuation.CloseParen,
        Token.Identifiers.FieldName('x'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('tuple type with element names - (Integer i, Integer j)', () => {
      const input = Input.InClass(`(Integer i, Integer j) x;`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.TupleElementName('i'),
        Token.Punctuation.Comma,
        Token.PrimitiveType.Integer,
        Token.Identifiers.TupleElementName('j'),
        Token.Punctuation.CloseParen,
        Token.Identifiers.FieldName('x'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('nested tuple type - (Integer, (Integer, Integer))', () => {
      const input = Input.InClass(`(Integer, (Integer, Integer)) x;`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Punctuation.Comma,
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Punctuation.Comma,
        Token.PrimitiveType.Integer,
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseParen,
        Token.Identifiers.FieldName('x'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('nested tuple type with element names - (Integer i, (Integer j, Integer k))', () => {
      const input = Input.InClass(`(Integer i, (Integer j, Integer k)) x;`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.TupleElementName('i'),
        Token.Punctuation.Comma,
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.TupleElementName('j'),
        Token.Punctuation.Comma,
        Token.PrimitiveType.Integer,
        Token.Identifiers.TupleElementName('k'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseParen,
        Token.Identifiers.FieldName('x'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('nullable tuple type - (Integer, Integer)?', () => {
      const input = Input.InClass(`(Integer, Integer)? x;`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Punctuation.Comma,
        Token.PrimitiveType.Integer,
        Token.Punctuation.CloseParen,
        Token.Punctuation.QuestionMark,
        Token.Identifiers.FieldName('x'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('array tuple type - (Integer, Integer)[]', () => {
      const input = Input.InClass(`(Integer, Integer)[] x;`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Punctuation.Comma,
        Token.PrimitiveType.Integer,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBracket,
        Token.Punctuation.CloseBracket,
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

    it('generic type with tuple - List<(Integer, Integer)>', () => {
      const input = Input.InClass(`List<(Integer, Integer)> x;`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Type('List'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Punctuation.Comma,
        Token.PrimitiveType.Integer,
        Token.Punctuation.CloseParen,
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.FieldName('x'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('generic type with tuple with element names - List<(Integer i, Integer j)>', () => {
      const input = Input.InClass(`List<(Integer i, Integer j)> x;`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Type('List'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.TupleElementName('i'),
        Token.Punctuation.Comma,
        Token.PrimitiveType.Integer,
        Token.Identifiers.TupleElementName('j'),
        Token.Punctuation.CloseParen,
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
        Token.Type('System'),
        Token.Punctuation.Accessor,
        Token.Type('Collections'),
        Token.Punctuation.Accessor,
        Token.Type('Generic'),
        Token.Punctuation.Accessor,
        Token.Type('List'),
        Token.Punctuation.TypeParameters.Begin,
        Token.PrimitiveType.Integer,
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.FieldName('x'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('generic type with nested type - List<Integer>.Enumerator', () => {
      const input = Input.InClass(`List<Integer>.Enumerator x;`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Type('List'),
        Token.Punctuation.TypeParameters.Begin,
        Token.PrimitiveType.Integer,
        Token.Punctuation.TypeParameters.End,
        Token.Punctuation.Accessor,
        Token.Type('Enumerator'),
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
