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

  describe('Comments', () => {
    it('single-line comment', async () => {
      const input = `// foo`;
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text(' foo')
      ]);
    });

    it('single-line comment after whitespace', async () => {
      const input = `    // foo`;
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Comment.LeadingWhitespace('    '),
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text(' foo')
      ]);
    });

    it('single-line double comment (issue #100)', async () => {
      const input = `//// foo`;
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text('// foo')
      ]);
    });

    it('multi-line comment', async () => {
      const input = `/* foo */`;
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Comment.MultiLine.Start,
        Token.Comment.MultiLine.Text(' foo '),
        Token.Comment.MultiLine.End
      ]);
    });

    it('in class', async () => {
      const input = Input.InClass(`// foo`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text(' foo')
      ]);
    });

    it('in enum', async () => {
      const input = Input.InEnum(`// foo`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text(' foo')
      ]);
    });

    it('in interface', async () => {
      const input = Input.InInterface(`// foo`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text(' foo')
      ]);
    });

    it('in method', async () => {
      const input = Input.InMethod(`// foo`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text(' foo')
      ]);
    });

    it("comment should colorize if there isn't a space before it (issue omnisharp-vscode#225)", async () => {
      const input = Input.InClass(`
private String GetChar()//Метод возвращающий
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Private,
        Token.PrimitiveType.String,
        Token.Identifiers.MethodName('GetChar'),
        Token.Punctuation.OpenParen,
        Token.Punctuation.CloseParen,
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text('Метод возвращающий')
      ]);
    });

    it('comment out class declaration base type list - single line (issue #41)', async () => {
      const input = Input.FromText(`
public class CustomBootstrapper // : DefaultNancyBootstrapper
{
}
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Class,
        Token.Identifiers.ClassName('CustomBootstrapper'),
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text(' : DefaultNancyBootstrapper'),
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('comment out class declaration base type list - multi line (issue #41)', async () => {
      const input = Input.FromText(`
public class CustomBootstrapper /* : DefaultNancyBootstrapper */
{
}
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Class,
        Token.Identifiers.ClassName('CustomBootstrapper'),
        Token.Comment.MultiLine.Start,
        Token.Comment.MultiLine.Text(' : DefaultNancyBootstrapper '),
        Token.Comment.MultiLine.End,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('comment out interface declaration base type list - single line (issue #41)', async () => {
      const input = Input.FromText(`
public interface CustomBootstrapper // : DefaultNancyBootstrapper
{
}
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Interface,
        Token.Identifiers.InterfaceName('CustomBootstrapper'),
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text(' : DefaultNancyBootstrapper'),
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('comment out interface declaration base type list - multi line (issue #41)', async () => {
      const input = Input.FromText(`
public interface CustomBootstrapper /* : DefaultNancyBootstrapper */
{
}
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Interface,
        Token.Identifiers.InterfaceName('CustomBootstrapper'),
        Token.Comment.MultiLine.Start,
        Token.Comment.MultiLine.Text(' : DefaultNancyBootstrapper '),
        Token.Comment.MultiLine.End,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('comment out enum declaration base type list - single line (issue #41)', async () => {
      const input = Input.FromText(`
public enum CustomBootstrapper // : byte
{
}
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Enum,
        Token.Identifiers.EnumName('CustomBootstrapper'),
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text(' : byte'),
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('comment out enum declaration base type list - multi line (issue #41)', async () => {
      const input = Input.FromText(`
public enum CustomBootstrapper /* : byte */
{
}
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Enum,
        Token.Identifiers.EnumName('CustomBootstrapper'),
        Token.Comment.MultiLine.Start,
        Token.Comment.MultiLine.Text(' : byte '),
        Token.Comment.MultiLine.End,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('after property accessor (issue #50)', async () => {
      const input = Input.InClass(`
Integer P {
    get { return 42; } // comment1
    set { } // comment2
}`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.PrimitiveType.Integer,
        Token.Identifiers.PropertyName('P'),
        Token.Punctuation.OpenBrace,
        Token.Keywords.Get,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Return,
        Token.Literals.Numeric.Decimal('42'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text(' comment1'),
        Token.Keywords.Set,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text(' comment2'),
        Token.Punctuation.CloseBrace
      ]);
    });

    it('after try (issue #60)', async () => {
      const input = Input.InMethod(`
try //comment
{
}
finally
{
}
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Control.Try,
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text('comment'),
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
        Token.Keywords.Control.Finally,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('after finally (issue #60)', async () => {
      const input = Input.InMethod(`
try
{
}
finally //comment
{
}
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Control.Try,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
        Token.Keywords.Control.Finally,
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text('comment'),
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('after catch (issue #60)', async () => {
      const input = Input.InMethod(`
try
{
}
catch //comment
{
}
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Control.Try,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
        Token.Keywords.Control.Catch,
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text('comment'),
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('after catch with exception (issue #60)', async () => {
      const input = Input.InMethod(`
try
{
}
catch (Exception) //comment
{
}
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Control.Try,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
        Token.Keywords.Control.Catch,
        Token.Punctuation.OpenParen,
        Token.Support.Class.Text('Exception'),
        Token.Punctuation.CloseParen,
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text('comment'),
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('after exception filter (issue #60)', async () => {
      const input = Input.InMethod(`
try
{
}
catch (DataNotFoundException dnfe) //Only catch exceptions that are distinctly DataNotFoundException
{
}
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Control.Try,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
        Token.Keywords.Control.Catch,
        Token.Punctuation.OpenParen,
        Token.Type('DataNotFoundException'),
        Token.Identifiers.LocalName('dnfe'),
        Token.Punctuation.CloseParen,
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text(
          'Only catch exceptions that are distinctly DataNotFoundException'
        ),
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });
  });
});
