/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Modifications Copyright (c) 2018 Salesforce.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Token } from './utils/tokenize';

describe('Grammar', () => {
  before(() => should());

  describe('Interfaces', () => {
    it('simple interface', () => {
      const input = `interface IFoo { }`;
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Interface,
        Token.Identifiers.InterfaceName('IFoo'),
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('interface inheritance', () => {
      const input = `
interface IFoo { }
interface IBar extends IFoo { }
`;

      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Interface,
        Token.Identifiers.InterfaceName('IFoo'),
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
        Token.Keywords.Interface,
        Token.Identifiers.InterfaceName('IBar'),
        Token.Keywords.Extends,
        Token.Identifiers.ExtendsName('IFoo'),
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('generic interface', () => {
      const input = `interface IFoo<T1, T2> { }`;
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Interface,
        Token.Identifiers.InterfaceName('IFoo'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Identifiers.TypeParameterName('T1'),
        Token.Punctuation.Comma,
        Token.Identifiers.TypeParameterName('T2'),
        Token.Punctuation.TypeParameters.End,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('interface extends another interface', () => {
      const input = `public interface MyInterface2 extends MyInterface {}`;
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Interface,
        Token.Identifiers.InterfaceName('MyInterface2'),
        Token.Keywords.Extends,
        Token.Identifiers.ExtendsName('MyInterface'),
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });
  });
});
