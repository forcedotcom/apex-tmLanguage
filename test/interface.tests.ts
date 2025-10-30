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

  describe('Interfaces', () => {
    it('simple interface', async () => {
      const input = `interface IFoo { }`;
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Interface,
        Token.Identifiers.InterfaceName('IFoo'),
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
      ]);
    });

    it('interface inheritance', async () => {
      const input = `
interface IFoo { }
interface IBar extends IFoo { }
`;

      const tokens = await tokenize(input);

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
        Token.Punctuation.CloseBrace,
      ]);
    });

    it('generic interface', async () => {
      const input = `interface IFoo<T1, T2> { }`;
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Interface,
        Token.Identifiers.InterfaceName('IFoo'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Identifiers.TypeParameterName('T1'),
        Token.Punctuation.Comma,
        Token.Identifiers.TypeParameterName('T2'),
        Token.Punctuation.TypeParameters.End,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
      ]);
    });

    it('interface extends another interface', async () => {
      const input = `public interface MyInterface2 extends MyInterface {}`;
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Interface,
        Token.Identifiers.InterfaceName('MyInterface2'),
        Token.Keywords.Extends,
        Token.Identifiers.ExtendsName('MyInterface'),
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
      ]);
    });

    it('interface extends namespace-qualified type (issue #50)', async () => {
      const input = Input.FromText(`interface MyInterface extends System.IComparable {}`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Interface,
        Token.Identifiers.InterfaceName('MyInterface'),
        Token.Keywords.Extends,
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.TypeText('IComparable'),
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
      ]);
    });
  });
});
