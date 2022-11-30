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

  describe('Locals', () => {
    it('declaration', async () => {
      const input = Input.InMethod(`Integer x;`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.PrimitiveType.Integer,
        Token.Identifiers.LocalName('x'),
        Token.Punctuation.Semicolon,
      ]);
    });

    it('declaration with initializer', async () => {
      const input = Input.InMethod(`Integer x = 42;`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.PrimitiveType.Integer,
        Token.Identifiers.LocalName('x'),
        Token.Operators.Assignment,
        Token.Literals.Numeric.Decimal('42'),
        Token.Punctuation.Semicolon,
      ]);
    });

    it('multiple declarators', async () => {
      const input = Input.InMethod(`Integer x, y;`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.PrimitiveType.Integer,
        Token.Identifiers.LocalName('x'),
        Token.Punctuation.Comma,
        Token.Identifiers.LocalName('y'),
        Token.Punctuation.Semicolon,
      ]);
    });

    it('multiple declarators with initializers', async () => {
      const input = Input.InMethod(`Integer x = 19, y = 23;`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.PrimitiveType.Integer,
        Token.Identifiers.LocalName('x'),
        Token.Operators.Assignment,
        Token.Literals.Numeric.Decimal('19'),
        Token.Punctuation.Comma,
        Token.Identifiers.LocalName('y'),
        Token.Operators.Assignment,
        Token.Literals.Numeric.Decimal('23'),
        Token.Punctuation.Semicolon,
      ]);
    });
  });
});
