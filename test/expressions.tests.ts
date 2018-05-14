/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Grammar", () => {
    before(() => should());

    describe("Expressions", () => {
        describe("Object creation", () => {
            it("with argument multiplication (issue #82)", () => {
                const input = Input.InMethod(`
Object newPoint = new Vector(point.x * z, 0);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Identifiers.LocalName("newPoint"),
                    Token.Operators.Assignment,
                    Token.Keywords.Control.New,
                    Token.Type("Vector"),
                    Token.Punctuation.OpenParen,
                    Token.Variables.Object("point"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("x"),
                    Token.Operators.Arithmetic.Multiplication,
                    Token.Variables.ReadWrite("z"),
                    Token.Punctuation.Comma,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Anonymous Objects", () => {
            it("simple - on single line", () => {
                const input = Input.InMethod(`Object x = new { ID = 42 };`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Keywords.Control.New,
                    Token.Punctuation.OpenBrace,
                    Token.Variables.ReadWrite("ID"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("simple - on multiple lines", () => {
                const input = Input.InMethod(`
Object x = new
{
    ID = 42
};`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Keywords.Control.New,
                    Token.Punctuation.OpenBrace,
                    Token.Variables.ReadWrite("ID"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("nested - on single line", () => {
                const input = Input.InMethod(`Object x = new { y = new { ID = 42 } };`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Keywords.Control.New,
                    Token.Punctuation.OpenBrace,
                    Token.Variables.ReadWrite("y"),
                    Token.Operators.Assignment,
                    Token.Keywords.Control.New,
                    Token.Punctuation.OpenBrace,
                    Token.Variables.ReadWrite("ID"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("nested - on multiple lines", () => {
                const input = Input.InMethod(`
Object x = new
{
    y = new
    {
        ID = 42
    }
};`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Keywords.Control.New,
                    Token.Punctuation.OpenBrace,
                    Token.Variables.ReadWrite("y"),
                    Token.Operators.Assignment,
                    Token.Keywords.Control.New,
                    Token.Punctuation.OpenBrace,
                    Token.Variables.ReadWrite("ID"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Arithmetic", () => {
            it("mixed relational and arithmetic operators", () => {
                const input = Input.InMethod(`b = this.i != 1 + (2 - 3);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Variables.ReadWrite("b"),
                    Token.Operators.Assignment,
                    Token.Keywords.This,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("i"),
                    Token.Operators.Relational.NotEqual,
                    Token.Literals.Numeric.Decimal("1"),
                    Token.Operators.Arithmetic.Addition,
                    Token.Punctuation.OpenParen,
                    Token.Literals.Numeric.Decimal("2"),
                    Token.Operators.Arithmetic.Subtraction,
                    Token.Literals.Numeric.Decimal("3"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Await", () => {
            it("at statement level", () => {
                const input = Input.InMethod(`await M();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Await,
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("in assignment", () => {
                const input = Input.InMethod(`Object x = await M();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Keywords.Await,
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("passed as argument", () => {
                const input = Input.InMethod(`M1(await M2());`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M1"),
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Await,
                    Token.Identifiers.MethodName("M2"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("statement level (issue #83)", () => {
                const input = Input.InMethod(`await x;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Await,
                    Token.Variables.ReadWrite("x"),
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Casts", () => {
            it("cast to built-in type in assignment", () => {
                const input = Input.InMethod(`Object o = (Object)42;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.CloseParen,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("cast to generic type in assignment", () => {
                const input = Input.InMethod(`Object o = (C<Integer>)42;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Punctuation.OpenParen,
                    Token.Type("C"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Integer,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.CloseParen,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("cast to tuple type in assignment", () => {
                const input = Input.InMethod(`Object t = ((Integer x, Integer y))o;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Identifiers.LocalName("t"),
                    Token.Operators.Assignment,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Integer,
                    Token.Identifiers.TupleElementName("x"),
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.Integer,
                    Token.Identifiers.TupleElementName("y"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Variables.ReadWrite("o"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("passed to invocation", () => {
                const input = Input.InMethod(`M((Integer)42);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Integer,
                    Token.Punctuation.CloseParen,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("chained cast passed to invocation", () => {
                const input = Input.InMethod(`M((Integer)(Object)42);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Integer,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Object,
                    Token.Punctuation.CloseParen,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("as cast of identifier", () => {
                const input = Input.InMethod(`Object x = o as List<Lazy<String>>;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Variables.ReadWrite("o"),
                    Token.Keywords.As,
                    Token.Type("List"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Type("Lazy"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.String,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("as cast of invocation", () => {
                const input = Input.InMethod(`Object x = M() as List<Lazy<String>>;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Keywords.As,
                    Token.Type("List"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Type("Lazy"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.String,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("is cast of identifier", () => {
                const input = Input.InMethod(`Object x = o is List<Lazy<String>>;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Variables.ReadWrite("o"),
                    Token.Keywords.Is,
                    Token.Type("List"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Type("Lazy"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.String,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("is cast of invocation", () => {
                const input = Input.InMethod(`Object x = M() is List<Lazy<String>>;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Keywords.Is,
                    Token.Type("List"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Type("Lazy"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.String,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Conditional Operator", () => {
            it("in assignment", () => {
                const input = Input.InMethod(`Integer y = x ? 19 : 23;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Integer,
                    Token.Identifiers.LocalName("y"),
                    Token.Operators.Assignment,
                    Token.Variables.ReadWrite("x"),
                    Token.Operators.Conditional.QuestionMark,
                    Token.Literals.Numeric.Decimal("19"),
                    Token.Operators.Conditional.Colon,
                    Token.Literals.Numeric.Decimal("23"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("passed as argument", () => {
                const input = Input.InMethod(`M(x ? 19 : 23);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Variables.ReadWrite("x"),
                    Token.Operators.Conditional.QuestionMark,
                    Token.Literals.Numeric.Decimal("19"),
                    Token.Operators.Conditional.Colon,
                    Token.Literals.Numeric.Decimal("23"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Element Access", () => {
            it("no arguments", () => {
                const input = Input.InMethod(`Object o = P[];`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Variables.Property("P"),
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("one argument", () => {
                const input = Input.InMethod(`Object o = P[42];`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Variables.Property("P"),
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("two arguments", () => {
                const input = Input.InMethod(`Object o = P[19, 23];`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Variables.Property("P"),
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("19"),
                    Token.Punctuation.Comma,
                    Token.Literals.Numeric.Decimal("23"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("member with element access", () => {
                const input = Input.InMethod(`Object a = b.c[0];`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("b"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("c"),
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("member with two element accesses", () => {
                const input = Input.InMethod(`Object a = b.c[19][23];`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("b"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("c"),
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("19"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("23"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("member with two element accesses and another member", () => {
                const input = Input.InMethod(`Object a = b.c[19][23].d;`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("b"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("c"),
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("19"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("23"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("d"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("member with two element accesses and an invocation", () => {
                const input = Input.InMethod(`Object a = b.c[19][23].d();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("b"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("c"),
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("19"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("23"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("d"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("read/write array element", () => {
                const input = Input.InMethod(`
Object[] a1 = {(null), (this.a), c};
a1[1] = ((this.a)); a1[2] = (c); a1[1] = (i);
`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.CloseBracket,
                    Token.Identifiers.LocalName("a1"),
                    Token.Operators.Assignment,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.OpenParen,
                    Token.Literals.Null,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Comma,
                    Token.Punctuation.OpenParen,
                    Token.Keywords.This,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("a"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Comma,
                    Token.Variables.ReadWrite("c"),
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.Semicolon,

                    Token.Variables.Property("a1"),
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("1"),
                    Token.Punctuation.CloseBracket,
                    Token.Operators.Assignment,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.OpenParen,
                    Token.Keywords.This,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("a"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Variables.Property("a1"),
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("2"),
                    Token.Punctuation.CloseBracket,
                    Token.Operators.Assignment,
                    Token.Punctuation.OpenParen,
                    Token.Variables.ReadWrite("c"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Variables.Property("a1"),
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("1"),
                    Token.Punctuation.CloseBracket,
                    Token.Operators.Assignment,
                    Token.Punctuation.OpenParen,
                    Token.Variables.ReadWrite("i"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                ]);
            });

            it("arithmetic expression with multiple element accesses 1 (issue #37)", () => {
                const input = Input.InMethod(`
Long total = data['bonusGame']['win'].AsLong * data['bonusGame']['betMult'].AsLong;
`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Long,
                    Token.Identifiers.LocalName("total"),
                    Token.Operators.Assignment,
                    Token.Variables.Property("data"),
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("bonusGame"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("win"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("AsLong"),
                    Token.Operators.Arithmetic.Multiplication,
                    Token.Variables.Property("data"),
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("bonusGame"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("betMult"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("AsLong"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("arithmetic expression with multiple element accesses 2 (issue #37)", () => {
                const input = Input.InMethod(`
total = data["bonusGame"]["win"].AsLong * data["bonusGame"]["betMult"].AsLong;
`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Variables.ReadWrite("total"),
                    Token.Operators.Assignment,
                    Token.Variables.Property("data"),
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.StringDoubleQuote.Begin,
                    Token.Literals.StringDoubleQuote("bonusGame"),
                    Token.Punctuation.StringDoubleQuote.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.StringDoubleQuote.Begin,
                    Token.Literals.StringDoubleQuote("win"),
                    Token.Punctuation.StringDoubleQuote.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("AsLong"),
                    Token.Operators.Arithmetic.Multiplication,
                    Token.Variables.Property("data"),
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.StringDoubleQuote.Begin,
                    Token.Literals.StringDoubleQuote("bonusGame"),
                    Token.Punctuation.StringDoubleQuote.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.StringDoubleQuote.Begin,
                    Token.Literals.StringDoubleQuote("betMult"),
                    Token.Punctuation.StringDoubleQuote.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("AsLong"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("arithmetic expression with multiple element accesses 3 (issue #37)", () => {
                const input = Input.InMethod(`
Long total = (data["bonusGame"]["win"].AsLong) * data["bonusGame"]["betMult"].AsLong;
`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Long,
                    Token.Identifiers.LocalName("total"),
                    Token.Operators.Assignment,
                    Token.Punctuation.OpenParen,
                    Token.Variables.Property("data"),
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.StringDoubleQuote.Begin,
                    Token.Literals.StringDoubleQuote("bonusGame"),
                    Token.Punctuation.StringDoubleQuote.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.StringDoubleQuote.Begin,
                    Token.Literals.StringDoubleQuote("win"),
                    Token.Punctuation.StringDoubleQuote.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("AsLong"),
                    Token.Punctuation.CloseParen,
                    Token.Operators.Arithmetic.Multiplication,
                    Token.Variables.Property("data"),
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.StringDoubleQuote.Begin,
                    Token.Literals.StringDoubleQuote("bonusGame"),
                    Token.Punctuation.StringDoubleQuote.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.StringDoubleQuote.Begin,
                    Token.Literals.StringDoubleQuote("betMult"),
                    Token.Punctuation.StringDoubleQuote.End,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("AsLong"),
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Invocations", () => {
            it("no arguments", () => {
                const input = Input.InMethod(`M();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("no arguments with space (issue #54)", () => {
                const input = Input.InMethod(`M ();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("one argument", () => {
                const input = Input.InMethod(`M(42);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("one argument with space (issue #54)", () => {
                const input = Input.InMethod(`M (42);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Literals.Numeric.Decimal("42"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("two arguments", () => {
                const input = Input.InMethod(`M(19, 23);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Literals.Numeric.Decimal("19"),
                    Token.Punctuation.Comma,
                    Token.Literals.Numeric.Decimal("23"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("two named arguments", () => {
                const input = Input.InMethod(`M(x: 19, y: 23);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.Colon,
                    Token.Literals.Numeric.Decimal("19"),
                    Token.Punctuation.Comma,
                    Token.Identifiers.ParameterName("y"),
                    Token.Punctuation.Colon,
                    Token.Literals.Numeric.Decimal("23"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("out argument", () => {
                const input = Input.InMethod(`M(out x);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Modifiers.Out,
                    Token.Variables.ReadWrite("x"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("in argument", () => {
                const input = Input.InMethod(`M(in x);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Keywords.Modifiers.In,
                    Token.Variables.ReadWrite("x"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("named out argument", () => {
                const input = Input.InMethod(`M(x: out y);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.Colon,
                    Token.Keywords.Modifiers.Out,
                    Token.Variables.ReadWrite("y"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("named in argument", () => {
                const input = Input.InMethod(`M(x: in y);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Identifiers.ParameterName("x"),
                    Token.Punctuation.Colon,
                    Token.Keywords.Modifiers.In,
                    Token.Variables.ReadWrite("y"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("generic with no arguments", () => {
                const input = Input.InMethod(`M<Integer>();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Integer,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("nested generic with no arguments", () => {
                const input = Input.InMethod(`M<T<Integer>>();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Type("T"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Integer,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("double-nested generic with no arguments", () => {
                const input = Input.InMethod(`M<T<U<Integer>>>();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Type("T"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Type("U"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Integer,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("member of generic with no arguments", () => {
                const input = Input.InMethod(`C<Integer>.M();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Variables.Object("C"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Integer,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("member of qualified generic with no arguments", () => {
                const input = Input.InMethod(`N.C<Integer>.M();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Variables.Object("N"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Object("C"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.Integer,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("store result of qualified method with no arguments", () => {
                const input = Input.InMethod(`Object o = N.C.M();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("N"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("C"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("qualified method with no arguments and space 1 (issue #54)", () => {
                const input = Input.InMethod(`N.C.M ();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Variables.Object("N"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("C"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("qualified method with no arguments and space 2 (issue #54)", () => {
                const input = Input.InMethod(`C.M ();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Variables.Object("C"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("store result of this.qualified method with no arguments", () => {
                const input = Input.InMethod(`Object o = this.C.M();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Identifiers.LocalName("o"),
                    Token.Operators.Assignment,
                    Token.Keywords.This,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("C"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("M"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("multiplicated parameters (issue #99)", () => {
                const input = Input.InMethod(`Multiply(n1 * n2);`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("Multiply"),
                    Token.Punctuation.OpenParen,
                    Token.Variables.ReadWrite("n1"),
                    Token.Operators.Arithmetic.Multiplication,
                    Token.Variables.ReadWrite("n2"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("chained method calls", () => {
                const input = Input.InMethod(`M1().M2();`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.Identifiers.MethodName("M1"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("M2"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Null-conditional Operator", () => {
            it("before element access", () => {
                const input = Input.InMethod(`Object a = b.c[0];`);
                const tokens = tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Object,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Variables.Object("b"),
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("c"),
                    Token.Punctuation.OpenBracket,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.Semicolon
                ]);
            });
        });
    });
});
