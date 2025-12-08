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

  describe('Statements', () => {
    describe('Do', () => {
      it('single-line do..while loop', async () => {
        const input = Input.InMethod(`do { } while (true);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.Do,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Keywords.Control.While,
          Token.Punctuation.OpenParen,
          Token.Literals.Boolean.True,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });
    });

    describe('While', () => {
      it('single-line while loop', async () => {
        const input = Input.InMethod(`while (true) { }`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.While,
          Token.Punctuation.OpenParen,
          Token.Literals.Boolean.True,
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
        ]);
      });
    });

    describe('If', () => {
      it('single-line if with embedded statement', async () => {
        const input = Input.InMethod(`if (true) return;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.If,
          Token.Punctuation.OpenParen,
          Token.Literals.Boolean.True,
          Token.Punctuation.CloseParen,
          Token.Keywords.Control.Return,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('single-line if with operator and statement', async () => {
        const input = Input.InMethod(`if (true || Trigger.isBefore) return;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.If,
          Token.Punctuation.OpenParen,
          Token.Literals.Boolean.True,
          Token.Operators.Logical.Or,
          Token.Support.Class.Trigger,
          Token.Punctuation.Accessor,
          Token.Support.Type.TriggerText('isBefore'),
          Token.Punctuation.CloseParen,
          Token.Keywords.Control.Return,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('single-line if with embedded method call', async () => {
        const input = Input.InMethod(`if (true) Do();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.If,
          Token.Punctuation.OpenParen,
          Token.Literals.Boolean.True,
          Token.Punctuation.CloseParen,
          Token.Identifiers.MethodName('Do'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('single-line if with block', async () => {
        const input = Input.InMethod(`if (true) { Do(); }`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.If,
          Token.Punctuation.OpenParen,
          Token.Literals.Boolean.True,
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,
          Token.Identifiers.MethodName('Do'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
          Token.Punctuation.CloseBrace,
        ]);
      });

      it('if with embedded statement', async () => {
        const input = Input.InMethod(`
if (true)
    Do();
`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.If,
          Token.Punctuation.OpenParen,
          Token.Literals.Boolean.True,
          Token.Punctuation.CloseParen,
          Token.Identifiers.MethodName('Do'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('if with block', async () => {
        const input = Input.InMethod(`
if (true)
{
    Do();
}`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.If,
          Token.Punctuation.OpenParen,
          Token.Literals.Boolean.True,
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,
          Token.Identifiers.MethodName('Do'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
          Token.Punctuation.CloseBrace,
        ]);
      });

      it('if-else with embedded statements', async () => {
        const input = Input.InMethod(`
if (true)
    Do();
else
    Dont();
`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.If,
          Token.Punctuation.OpenParen,
          Token.Literals.Boolean.True,
          Token.Punctuation.CloseParen,
          Token.Identifiers.MethodName('Do'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
          Token.Keywords.Control.Else,
          Token.Identifiers.MethodName('Dont'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('if-else with blocks', async () => {
        const input = Input.InMethod(`
if (true)
{
    Do();
}
else
{
    Dont();
}`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.If,
          Token.Punctuation.OpenParen,
          Token.Literals.Boolean.True,
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,
          Token.Identifiers.MethodName('Do'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
          Token.Punctuation.CloseBrace,
          Token.Keywords.Control.Else,
          Token.Punctuation.OpenBrace,
          Token.Identifiers.MethodName('Dont'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
          Token.Punctuation.CloseBrace,
        ]);
      });

      it('if-elseif with embedded statements', async () => {
        const input = Input.InMethod(`
if (true)
    Do();
else if (false)
    Dont();
`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.If,
          Token.Punctuation.OpenParen,
          Token.Literals.Boolean.True,
          Token.Punctuation.CloseParen,
          Token.Identifiers.MethodName('Do'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
          Token.Keywords.Control.Else,
          Token.Keywords.Control.If,
          Token.Punctuation.OpenParen,
          Token.Literals.Boolean.False,
          Token.Punctuation.CloseParen,
          Token.Identifiers.MethodName('Dont'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('if-elseif with blocks', async () => {
        const input = Input.InMethod(`
if (true)
{
    Do();
}
else if (false)
{
    Dont();
}`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.If,
          Token.Punctuation.OpenParen,
          Token.Literals.Boolean.True,
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,
          Token.Identifiers.MethodName('Do'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
          Token.Punctuation.CloseBrace,
          Token.Keywords.Control.Else,
          Token.Keywords.Control.If,
          Token.Punctuation.OpenParen,
          Token.Literals.Boolean.False,
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,
          Token.Identifiers.MethodName('Dont'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
          Token.Punctuation.CloseBrace,
        ]);
      });

      it('if statement inside while statment with continue and break', async () => {
        const input = Input.InMethod(`
while (i < 10)
{
    ++i;
    if (true) continue;
    break;
}`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.While,
          Token.Punctuation.OpenParen,
          Token.Variables.ReadWrite('i'),
          Token.Operators.Relational.LessThan,
          Token.Literals.Numeric.Decimal('10'),
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,
          Token.Operators.Increment,
          Token.Variables.ReadWrite('i'),
          Token.Punctuation.Semicolon,
          Token.Keywords.Control.If,
          Token.Punctuation.OpenParen,
          Token.Literals.Boolean.True,
          Token.Punctuation.CloseParen,
          Token.Keywords.Control.Continue,
          Token.Punctuation.Semicolon,
          Token.Keywords.Control.Break,
          Token.Punctuation.Semicolon,
          Token.Punctuation.CloseBrace,
        ]);
      });
    });

    describe('Try', () => {
      it('try-finally', async () => {
        const input = Input.InMethod(`
try
{
}
finally
{
}`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.Try,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Keywords.Control.Finally,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
        ]);
      });

      it('try-catch', async () => {
        const input = Input.InMethod(`
try
{
}
catch
{
}`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.Try,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Keywords.Control.Catch,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
        ]);
      });

      it('try-catch-finally', async () => {
        const input = Input.InMethod(`
try
{
}
catch
{
}
finally
{
}`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.Try,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Keywords.Control.Catch,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Keywords.Control.Finally,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
        ]);
      });

      it('try-catch with exception type', async () => {
        const input = Input.InMethod(`
try
{
}
catch (Exception)
{
}`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.Try,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Keywords.Control.Catch,
          Token.Punctuation.OpenParen,
          Token.Support.Class.Text('Exception'),
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
        ]);
      });

      it('try-catch with exception type and identifier', async () => {
        const input = Input.InMethod(`
try
{
}
catch (Exception ex)
{
}`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.Try,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Keywords.Control.Catch,
          Token.Punctuation.OpenParen,
          Token.Support.Class.Text('Exception'),
          Token.Identifiers.LocalName('ex'),
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
        ]);
      });

      it('try-finally followed by statement', async () => {
        const input = Input.InMethod(`
try
{
}
finally
{
}
Integer x;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.Try,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.Keywords.Control.Finally,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
          Token.PrimitiveType.Integer,
          Token.Identifiers.LocalName('x'),
          Token.Punctuation.Semicolon,
        ]);
      });
    });
  });
});
