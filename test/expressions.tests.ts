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

  describe('Expressions', () => {
    describe('Object creation', () => {
      it('with argument multiplication (issue #82)', async () => {
        const input = Input.InMethod(`
Object newPoint = new Vector(point.x * z, 0);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Object,
          Token.Identifiers.LocalName('newPoint'),
          Token.Operators.Assignment,
          Token.Keywords.Control.New,
          Token.Type('Vector'),
          Token.Punctuation.OpenParen,
          Token.Variables.Object('point'),
          Token.Punctuation.Accessor,
          Token.Variables.Property('x'),
          Token.Operators.Arithmetic.Multiplication,
          Token.Variables.ReadWrite('z'),
          Token.Punctuation.Comma,
          Token.Literals.Numeric.Decimal('0'),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });
    });

    describe('Arithmetic', () => {
      it('mixed relational and arithmetic operators', async () => {
        const input = Input.InMethod(`b = this.i != 1 + (2 - 3);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variables.ReadWrite('b'),
          Token.Operators.Assignment,
          Token.Keywords.This,
          Token.Punctuation.Accessor,
          Token.Variables.Property('i'),
          Token.Operators.Relational.NotEqual,
          Token.Literals.Numeric.Decimal('1'),
          Token.Operators.Arithmetic.Addition,
          Token.Punctuation.OpenParen,
          Token.Literals.Numeric.Decimal('2'),
          Token.Operators.Arithmetic.Subtraction,
          Token.Literals.Numeric.Decimal('3'),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('mixed relational and arithmetic operators with safe navigator', async () => {
        const input = Input.InMethod(`b = this?.i != 1 + (2 - 3);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variables.ReadWrite('b'),
          Token.Operators.Assignment,
          Token.Keywords.This,
          Token.Operators.SafeNavigation,
          Token.Variables.Property('i'),
          Token.Operators.Relational.NotEqual,
          Token.Literals.Numeric.Decimal('1'),
          Token.Operators.Arithmetic.Addition,
          Token.Punctuation.OpenParen,
          Token.Literals.Numeric.Decimal('2'),
          Token.Operators.Arithmetic.Subtraction,
          Token.Literals.Numeric.Decimal('3'),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });
    });

    describe('Casts', () => {
      it('cast to built-in type in assignment', async () => {
        const input = Input.InMethod(`Object o = (Object)42;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Object,
          Token.Identifiers.LocalName('o'),
          Token.Operators.Assignment,
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.Object,
          Token.Punctuation.CloseParen,
          Token.Literals.Numeric.Decimal('42'),
          Token.Punctuation.Semicolon,
        ]);
      });

      it('cast to generic type in assignment', async () => {
        const input = Input.InMethod(`Object o = (C<Integer>)42;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Object,
          Token.Identifiers.LocalName('o'),
          Token.Operators.Assignment,
          Token.Punctuation.OpenParen,
          Token.Type('C'),
          Token.Punctuation.TypeParameters.Begin,
          Token.PrimitiveType.Integer,
          Token.Punctuation.TypeParameters.End,
          Token.Punctuation.CloseParen,
          Token.Literals.Numeric.Decimal('42'),
          Token.Punctuation.Semicolon,
        ]);
      });

      it('passed to invocation', async () => {
        const input = Input.InMethod(`M((Integer)42);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifiers.MethodName('M'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.Integer,
          Token.Punctuation.CloseParen,
          Token.Literals.Numeric.Decimal('42'),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('chained cast passed to invocation', async () => {
        const input = Input.InMethod(`M((Integer)(Object)42);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifiers.MethodName('M'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.Integer,
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenParen,
          Token.PrimitiveType.Object,
          Token.Punctuation.CloseParen,
          Token.Literals.Numeric.Decimal('42'),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });
    });

    describe('Conditional Operator', () => {
      it('in assignment', async () => {
        const input = Input.InMethod(`Integer y = x ? 19 : 23;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Integer,
          Token.Identifiers.LocalName('y'),
          Token.Operators.Assignment,
          Token.Variables.ReadWrite('x'),
          Token.Operators.Conditional.QuestionMark,
          Token.Literals.Numeric.Decimal('19'),
          Token.Operators.Conditional.Colon,
          Token.Literals.Numeric.Decimal('23'),
          Token.Punctuation.Semicolon,
        ]);
      });

      it('passed as argument', async () => {
        const input = Input.InMethod(`M(x ? 19 : 23);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifiers.MethodName('M'),
          Token.Punctuation.OpenParen,
          Token.Variables.ReadWrite('x'),
          Token.Operators.Conditional.QuestionMark,
          Token.Literals.Numeric.Decimal('19'),
          Token.Operators.Conditional.Colon,
          Token.Literals.Numeric.Decimal('23'),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('nested ternary expression (issue #43)', async () => {
        const input = Input.InMethod(`Integer result = x ? y ? 1 : 2 : 3;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Integer,
          Token.Identifiers.LocalName('result'),
          Token.Operators.Assignment,
          Token.Variables.ReadWrite('x'),
          Token.Operators.Conditional.QuestionMark,
          Token.Variables.ReadWrite('y'),
          Token.Operators.Conditional.QuestionMark,
          Token.Literals.Numeric.Decimal('1'),
          Token.Operators.Conditional.Colon,
          Token.Literals.Numeric.Decimal('2'),
          Token.Operators.Conditional.Colon,
          Token.Literals.Numeric.Decimal('3'),
          Token.Punctuation.Semicolon,
        ]);
      });

      it('ternary with method call (issue #43)', async () => {
        const input = Input.InMethod(
          `String s = x ? getValue() : getDefault();`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.String,
          Token.Identifiers.LocalName('s'),
          Token.Operators.Assignment,
          Token.Variables.ReadWrite('x'),
          Token.Operators.Conditional.QuestionMark,
          Token.Identifiers.MethodName('getValue'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Operators.Conditional.Colon,
          Token.Identifiers.MethodName('getDefault'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });
    });

    describe('Element Access', () => {
      it('no arguments', async () => {
        const input = Input.InMethod(`Object o = P[];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Object,
          Token.Identifiers.LocalName('o'),
          Token.Operators.Assignment,
          Token.Variables.Property('P'),
          Token.Punctuation.OpenBracket,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('one argument', async () => {
        const input = Input.InMethod(`Object o = P[42];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Object,
          Token.Identifiers.LocalName('o'),
          Token.Operators.Assignment,
          Token.Variables.Property('P'),
          Token.Punctuation.OpenBracket,
          Token.Literals.Numeric.Decimal('42'),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('two arguments', async () => {
        const input = Input.InMethod(`Object o = P[19, 23];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Object,
          Token.Identifiers.LocalName('o'),
          Token.Operators.Assignment,
          Token.Variables.Property('P'),
          Token.Punctuation.OpenBracket,
          Token.Literals.Numeric.Decimal('19'),
          Token.Punctuation.Comma,
          Token.Literals.Numeric.Decimal('23'),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('member with element access', async () => {
        const input = Input.InMethod(`Object a = b.c[0];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Object,
          Token.Identifiers.LocalName('a'),
          Token.Operators.Assignment,
          Token.Variables.Object('b'),
          Token.Punctuation.Accessor,
          Token.Variables.Property('c'),
          Token.Punctuation.OpenBracket,
          Token.Literals.Numeric.Decimal('0'),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('member with element access with safe navigator', async () => {
        const input = Input.InMethod(`Object a = b?.c[0];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Object,
          Token.Identifiers.LocalName('a'),
          Token.Operators.Assignment,
          Token.Variables.Object('b'),
          Token.Operators.SafeNavigation,
          Token.Variables.Property('c'),
          Token.Punctuation.OpenBracket,
          Token.Literals.Numeric.Decimal('0'),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('member with two element accesses', async () => {
        const input = Input.InMethod(`Object a = b.c[19][23];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Object,
          Token.Identifiers.LocalName('a'),
          Token.Operators.Assignment,
          Token.Variables.Object('b'),
          Token.Punctuation.Accessor,
          Token.Variables.Property('c'),
          Token.Punctuation.OpenBracket,
          Token.Literals.Numeric.Decimal('19'),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.OpenBracket,
          Token.Literals.Numeric.Decimal('23'),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('member with two element accesses with safe navigator', async () => {
        const input = Input.InMethod(`Object a = b?.c[19][23];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Object,
          Token.Identifiers.LocalName('a'),
          Token.Operators.Assignment,
          Token.Variables.Object('b'),
          Token.Operators.SafeNavigation,
          Token.Variables.Property('c'),
          Token.Punctuation.OpenBracket,
          Token.Literals.Numeric.Decimal('19'),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.OpenBracket,
          Token.Literals.Numeric.Decimal('23'),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('member with two element accesses and another member', async () => {
        const input = Input.InMethod(`Object a = b.c[19][23].d;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Object,
          Token.Identifiers.LocalName('a'),
          Token.Operators.Assignment,
          Token.Variables.Object('b'),
          Token.Punctuation.Accessor,
          Token.Variables.Property('c'),
          Token.Punctuation.OpenBracket,
          Token.Literals.Numeric.Decimal('19'),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.OpenBracket,
          Token.Literals.Numeric.Decimal('23'),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Accessor,
          Token.Variables.Property('d'),
          Token.Punctuation.Semicolon,
        ]);
      });

      it('member with two element accesses and another member with safe navigator', async () => {
        const input = Input.InMethod(`Object a = b.c[19][23]?.d;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Object,
          Token.Identifiers.LocalName('a'),
          Token.Operators.Assignment,
          Token.Variables.Object('b'),
          Token.Punctuation.Accessor,
          Token.Variables.Property('c'),
          Token.Punctuation.OpenBracket,
          Token.Literals.Numeric.Decimal('19'),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.OpenBracket,
          Token.Literals.Numeric.Decimal('23'),
          Token.Punctuation.CloseBracket,
          Token.Operators.SafeNavigation,
          Token.Variables.Property('d'),
          Token.Punctuation.Semicolon,
        ]);
      });

      it('member with two element accesses and an invocation', async () => {
        const input = Input.InMethod(`Object a = b.c[19][23].d();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Object,
          Token.Identifiers.LocalName('a'),
          Token.Operators.Assignment,
          Token.Variables.Object('b'),
          Token.Punctuation.Accessor,
          Token.Variables.Property('c'),
          Token.Punctuation.OpenBracket,
          Token.Literals.Numeric.Decimal('19'),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.OpenBracket,
          Token.Literals.Numeric.Decimal('23'),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Accessor,
          Token.Identifiers.MethodName('d'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('member with two element accesses and an invocation with safe navigator', async () => {
        const input = Input.InMethod(`Object a = b.c[19][23]?.d();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Object,
          Token.Identifiers.LocalName('a'),
          Token.Operators.Assignment,
          Token.Variables.Object('b'),
          Token.Punctuation.Accessor,
          Token.Variables.Property('c'),
          Token.Punctuation.OpenBracket,
          Token.Literals.Numeric.Decimal('19'),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.OpenBracket,
          Token.Literals.Numeric.Decimal('23'),
          Token.Punctuation.CloseBracket,
          Token.Operators.SafeNavigation,
          Token.Identifiers.MethodName('d'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('read/write array element', async () => {
        const input = Input.InMethod(`
Object[] a1 = {(null), (this.a), c};
a1[1] = ((this.a)); a1[2] = (c); a1[1] = (i);
`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Object,
          Token.Punctuation.OpenBracket,
          Token.Punctuation.CloseBracket,
          Token.Identifiers.LocalName('a1'),
          Token.Operators.Assignment,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.OpenParen,
          Token.Literals.Null,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Comma,
          Token.Punctuation.OpenParen,
          Token.Keywords.This,
          Token.Punctuation.Accessor,
          Token.Variables.Property('a'),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Comma,
          Token.Variables.ReadWrite('c'),
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon,

          Token.Variables.Property('a1'),
          Token.Punctuation.OpenBracket,
          Token.Literals.Numeric.Decimal('1'),
          Token.Punctuation.CloseBracket,
          Token.Operators.Assignment,
          Token.Punctuation.OpenParen,
          Token.Punctuation.OpenParen,
          Token.Keywords.This,
          Token.Punctuation.Accessor,
          Token.Variables.Property('a'),
          Token.Punctuation.CloseParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
          Token.Variables.Property('a1'),
          Token.Punctuation.OpenBracket,
          Token.Literals.Numeric.Decimal('2'),
          Token.Punctuation.CloseBracket,
          Token.Operators.Assignment,
          Token.Punctuation.OpenParen,
          Token.Variables.ReadWrite('c'),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
          Token.Variables.Property('a1'),
          Token.Punctuation.OpenBracket,
          Token.Literals.Numeric.Decimal('1'),
          Token.Punctuation.CloseBracket,
          Token.Operators.Assignment,
          Token.Punctuation.OpenParen,
          Token.Variables.ReadWrite('i'),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('arithmetic expression with multiple element accesses 1 (issue #37)', async () => {
        const input = Input.InMethod(`
Long total = data['bonusGame']['win'].AsLong * data['bonusGame']['betMult'].AsLong;
`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Long,
          Token.Identifiers.LocalName('total'),
          Token.Operators.Assignment,
          Token.Variables.Property('data'),
          Token.Punctuation.OpenBracket,
          Token.Punctuation.String.Begin,
          Token.Literals.String('bonusGame'),
          Token.Punctuation.String.End,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.OpenBracket,
          Token.Punctuation.String.Begin,
          Token.Literals.String('win'),
          Token.Punctuation.String.End,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Accessor,
          Token.Variables.Property('AsLong'),
          Token.Operators.Arithmetic.Multiplication,
          Token.Variables.Property('data'),
          Token.Punctuation.OpenBracket,
          Token.Punctuation.String.Begin,
          Token.Literals.String('bonusGame'),
          Token.Punctuation.String.End,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.OpenBracket,
          Token.Punctuation.String.Begin,
          Token.Literals.String('betMult'),
          Token.Punctuation.String.End,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Accessor,
          Token.Variables.Property('AsLong'),
          Token.Punctuation.Semicolon,
        ]);
      });
    });

    describe('Invocations', () => {
      it('no arguments', async () => {
        const input = Input.InMethod(`M();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifiers.MethodName('M'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('no arguments with space (issue #54)', async () => {
        const input = Input.InMethod(`M ();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifiers.MethodName('M'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('one argument', async () => {
        const input = Input.InMethod(`M(42);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifiers.MethodName('M'),
          Token.Punctuation.OpenParen,
          Token.Literals.Numeric.Decimal('42'),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('one argument with space (issue #54)', async () => {
        const input = Input.InMethod(`M (42);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifiers.MethodName('M'),
          Token.Punctuation.OpenParen,
          Token.Literals.Numeric.Decimal('42'),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('two arguments', async () => {
        const input = Input.InMethod(`M(19, 23);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifiers.MethodName('M'),
          Token.Punctuation.OpenParen,
          Token.Literals.Numeric.Decimal('19'),
          Token.Punctuation.Comma,
          Token.Literals.Numeric.Decimal('23'),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('two named arguments', async () => {
        const input = Input.InMethod(`M(x: 19, y: 23);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifiers.MethodName('M'),
          Token.Punctuation.OpenParen,
          Token.Identifiers.ParameterName('x'),
          Token.Punctuation.Colon,
          Token.Literals.Numeric.Decimal('19'),
          Token.Punctuation.Comma,
          Token.Identifiers.ParameterName('y'),
          Token.Punctuation.Colon,
          Token.Literals.Numeric.Decimal('23'),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('generic with no arguments', async () => {
        const input = Input.InMethod(`M<Integer>();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifiers.MethodName('M'),
          Token.Punctuation.TypeParameters.Begin,
          Token.PrimitiveType.Integer,
          Token.Punctuation.TypeParameters.End,
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('nested generic with no arguments', async () => {
        const input = Input.InMethod(`M<T<Integer>>();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifiers.MethodName('M'),
          Token.Punctuation.TypeParameters.Begin,
          Token.Type('T'),
          Token.Punctuation.TypeParameters.Begin,
          Token.PrimitiveType.Integer,
          Token.Punctuation.TypeParameters.End,
          Token.Punctuation.TypeParameters.End,
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('double-nested generic with no arguments', async () => {
        const input = Input.InMethod(`M<T<U<Integer>>>();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifiers.MethodName('M'),
          Token.Punctuation.TypeParameters.Begin,
          Token.Type('T'),
          Token.Punctuation.TypeParameters.Begin,
          Token.Type('U'),
          Token.Punctuation.TypeParameters.Begin,
          Token.PrimitiveType.Integer,
          Token.Punctuation.TypeParameters.End,
          Token.Punctuation.TypeParameters.End,
          Token.Punctuation.TypeParameters.End,
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('member of generic with no arguments', async () => {
        const input = Input.InMethod(`C<Integer>.M();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variables.Object('C'),
          Token.Punctuation.TypeParameters.Begin,
          Token.PrimitiveType.Integer,
          Token.Punctuation.TypeParameters.End,
          Token.Punctuation.Accessor,
          Token.Identifiers.MethodName('M'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('member of qualified generic with no arguments', async () => {
        const input = Input.InMethod(`N.C<Integer>.M();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variables.Object('N'),
          Token.Punctuation.Accessor,
          Token.Variables.Object('C'),
          Token.Punctuation.TypeParameters.Begin,
          Token.PrimitiveType.Integer,
          Token.Punctuation.TypeParameters.End,
          Token.Punctuation.Accessor,
          Token.Identifiers.MethodName('M'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('store result of qualified method with no arguments', async () => {
        const input = Input.InMethod(`Object o = N.C.M();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Object,
          Token.Identifiers.LocalName('o'),
          Token.Operators.Assignment,
          Token.Variables.Object('N'),
          Token.Punctuation.Accessor,
          Token.Variables.Property('C'),
          Token.Punctuation.Accessor,
          Token.Identifiers.MethodName('M'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('qualified method with no arguments and space 1 (issue #54)', async () => {
        const input = Input.InMethod(`N.C.M ();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variables.Object('N'),
          Token.Punctuation.Accessor,
          Token.Variables.Property('C'),
          Token.Punctuation.Accessor,
          Token.Identifiers.MethodName('M'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('qualified method with no arguments and space 2 (issue #54)', async () => {
        const input = Input.InMethod(`C.M ();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Variables.Object('C'),
          Token.Punctuation.Accessor,
          Token.Identifiers.MethodName('M'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('store result of this.qualified method with no arguments', async () => {
        const input = Input.InMethod(`Object o = this.C.M();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Object,
          Token.Identifiers.LocalName('o'),
          Token.Operators.Assignment,
          Token.Keywords.This,
          Token.Punctuation.Accessor,
          Token.Variables.Property('C'),
          Token.Punctuation.Accessor,
          Token.Identifiers.MethodName('M'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('multiplicated parameters (issue #99)', async () => {
        const input = Input.InMethod(`Multiply(n1 * n2);`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifiers.MethodName('Multiply'),
          Token.Punctuation.OpenParen,
          Token.Variables.ReadWrite('n1'),
          Token.Operators.Arithmetic.Multiplication,
          Token.Variables.ReadWrite('n2'),
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('chained method calls', async () => {
        const input = Input.InMethod(`M1().M2();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifiers.MethodName('M1'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Accessor,
          Token.Identifiers.MethodName('M2'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('chained method calls with safe navigator', async () => {
        const input = Input.InMethod(`M1()?.M2();`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Identifiers.MethodName('M1'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Operators.SafeNavigation,
          Token.Identifiers.MethodName('M2'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });
    });

    describe('Null-conditional Operator', () => {
      it('before element access', async () => {
        const input = Input.InMethod(`Object a = b.c[0];`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Object,
          Token.Identifiers.LocalName('a'),
          Token.Operators.Assignment,
          Token.Variables.Object('b'),
          Token.Punctuation.Accessor,
          Token.Variables.Property('c'),
          Token.Punctuation.OpenBracket,
          Token.Literals.Numeric.Decimal('0'),
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon,
        ]);
      });
    });
  });
});
