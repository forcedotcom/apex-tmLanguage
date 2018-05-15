/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe('Grammar', () => {
  before(() => should());

  describe('Locals', () => {
    it('declaration', () => {
      const input = Input.InMethod(`Integer x;`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.PrimitiveType.Integer,
        Token.Identifiers.LocalName('x'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('declaration with initializer', () => {
      const input = Input.InMethod(`Integer x = 42;`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.PrimitiveType.Integer,
        Token.Identifiers.LocalName('x'),
        Token.Operators.Assignment,
        Token.Literals.Numeric.Decimal('42'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('multiple declarators', () => {
      const input = Input.InMethod(`Integer x, y;`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.PrimitiveType.Integer,
        Token.Identifiers.LocalName('x'),
        Token.Punctuation.Comma,
        Token.Identifiers.LocalName('y'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('multiple declarators with initializers', () => {
      const input = Input.InMethod(`Integer x = 19, y = 23;`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.PrimitiveType.Integer,
        Token.Identifiers.LocalName('x'),
        Token.Operators.Assignment,
        Token.Literals.Numeric.Decimal('19'),
        Token.Punctuation.Comma,
        Token.Identifiers.LocalName('y'),
        Token.Operators.Assignment,
        Token.Literals.Numeric.Decimal('23'),
        Token.Punctuation.Semicolon
      ]);
    });
  });
});
