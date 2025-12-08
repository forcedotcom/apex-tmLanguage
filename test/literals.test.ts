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

  describe('Literals', () => {
    describe('Booleans', () => {
      it('true', async () => {
        const input = Input.InClass(`Boolean x = true;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Boolean,
          Token.Identifiers.FieldName('x'),
          Token.Operators.Assignment,
          Token.Literals.Boolean.True,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('false', async () => {
        const input = Input.InClass(`Boolean x = false;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Boolean,
          Token.Identifiers.FieldName('x'),
          Token.Operators.Assignment,
          Token.Literals.Boolean.False,
          Token.Punctuation.Semicolon,
        ]);
      });
    });

    describe('Chars', () => {
      it('empty', async () => {
        const input = Input.InMethod(`String x = '';`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.String,
          Token.Identifiers.LocalName('x'),
          Token.Operators.Assignment,
          Token.Punctuation.String.Begin,
          Token.Punctuation.String.End,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('letter', async () => {
        const input = Input.InMethod(`String x = 'a';`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.String,
          Token.Identifiers.LocalName('x'),
          Token.Operators.Assignment,
          Token.Punctuation.String.Begin,
          Token.Literals.String('a'),
          Token.Punctuation.String.End,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('escaped single quote', async () => {
        const input = Input.InMethod(`String x = '\\'';`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.String,
          Token.Identifiers.LocalName('x'),
          Token.Operators.Assignment,
          Token.Punctuation.String.Begin,
          Token.Literals.CharacterEscape("\\'"),
          Token.Punctuation.String.End,
          Token.Punctuation.Semicolon,
        ]);
      });
    });

    describe('Numbers', () => {
      it('decimal zero', async () => {
        const input = Input.InClass(`Integer x = 0;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Integer,
          Token.Identifiers.FieldName('x'),
          Token.Operators.Assignment,
          Token.Literals.Numeric.Decimal('0'),
          Token.Punctuation.Semicolon,
        ]);
      });

      it('hexadecimal zero', async () => {
        const input = Input.InClass(`Integer x = 0x0;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Integer,
          Token.Identifiers.FieldName('x'),
          Token.Operators.Assignment,
          Token.Literals.Numeric.Hexadecimal('0x0'),
          Token.Punctuation.Semicolon,
        ]);
      });

      it('binary zero', async () => {
        const input = Input.InClass(`Integer x = 0b0;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Integer,
          Token.Identifiers.FieldName('x'),
          Token.Operators.Assignment,
          Token.Literals.Numeric.Binary('0b0'),
          Token.Punctuation.Semicolon,
        ]);
      });

      it('Double zero', async () => {
        const input = Input.InClass(`Double x = 0.0;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Double,
          Token.Identifiers.FieldName('x'),
          Token.Operators.Assignment,
          Token.Literals.Numeric.Decimal('0.0'),
          Token.Punctuation.Semicolon,
        ]);
      });
    });

    describe('Strings', () => {
      it('simple', async () => {
        const input = Input.InClass(`String test = 'hello world!';`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.String,
          Token.Identifiers.FieldName('test'),
          Token.Operators.Assignment,
          Token.Punctuation.String.Begin,
          Token.Literals.String('hello world!'),
          Token.Punctuation.String.End,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('escaped double-quote', async () => {
        const input = Input.InClass(`String test = 'hello \\"world!\\"';`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.String,
          Token.Identifiers.FieldName('test'),
          Token.Operators.Assignment,
          Token.Punctuation.String.Begin,
          Token.Literals.String('hello '),
          Token.Literals.CharacterEscape('\\"'),
          Token.Literals.String('world!'),
          Token.Literals.CharacterEscape('\\"'),
          Token.Punctuation.String.End,
          Token.Punctuation.Semicolon,
        ]);
      });
    });
  });
});
