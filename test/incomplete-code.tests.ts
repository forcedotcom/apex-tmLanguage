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

  describe('Incomplete code', () => {
    it("Don't eat the next lines if there isn't a semicolon (issue #15)", async () => {
      const input = Input.InClass(`
private String _color
public ColorTest(String white)
{
    _color = white;
}
`);

      let tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Private,
        Token.PrimitiveType.String,
        Token.Identifiers.PropertyName('_color'),
        Token.Keywords.Modifiers.Public,
        Token.Identifiers.MethodName('ColorTest'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.String,
        Token.Identifiers.ParameterName('white'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Variables.ReadWrite('_color'),
        Token.Operators.Assignment,
        Token.Variables.ReadWrite('white'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });
  });
});
