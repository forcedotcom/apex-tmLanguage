/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Grammar", () => {
    before(() => should());

    describe("Methods", () => {
        it("single-line declaration with no parameters", () => {
            const input = Input.InClass(`void Foo() { }`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Void,
                Token.Identifiers.MethodName("Foo"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("declaration with two parameters", () => {
            const input = Input.InClass(`
Integer Add(Integer x, Integer y)
{
    return x + y;
}`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Integer,
                Token.Identifiers.MethodName("Add"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Integer,
                Token.Identifiers.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Integer,
                Token.Identifiers.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Control.Return,
                Token.Variables.ReadWrite("x"),
                Token.Operators.Arithmetic.Addition,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("explicitly-implemented interface member", () => {
            const input = Input.InClass(`String IFoo<String>.toString();`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Type("IFoo"),
                Token.Punctuation.TypeParameters.Begin,
                Token.PrimitiveType.String,
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.Accessor,
                Token.Identifiers.MethodName("toString"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("declaration in interface", () => {
            const input = Input.InInterface(`String GetString();`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifiers.MethodName("GetString"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("declaration in interface with parameters", () => {
            const input = Input.InInterface(`String GetString(String format, params Object[] args);`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifiers.MethodName("GetString"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.String,
                Token.Identifiers.ParameterName("format"),
                Token.Punctuation.Comma,
                Token.Keywords.Modifiers.Params,
                Token.PrimitiveType.Object,
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Identifiers.ParameterName("args"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("public override", () => {
            const input = Input.InClass(`public override M() { }`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Override,
                Token.Identifiers.MethodName("M"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("public virtual", () => {
            const input = Input.InClass(`public virtual M() { }`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Virtual,
                Token.Identifiers.MethodName("M"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("extension method", () => {
            const input = Input.InClass(`public void M(this Object o) { }`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.PrimitiveType.Void,
                Token.Identifiers.MethodName("M"),
                Token.Punctuation.OpenParen,
                Token.Keywords.Modifiers.This,
                Token.PrimitiveType.Object,
                Token.Identifiers.ParameterName("o"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("commented parameters are highlighted properly (issue omnisharp-vscode#802)", () => {
            const input = Input.InClass(`public void methodWithParametersCommented(Integer p1, /*Integer p2*/, Integer p3) {}`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.PrimitiveType.Void,
                Token.Identifiers.MethodName("methodWithParametersCommented"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Integer,
                Token.Identifiers.ParameterName("p1"),
                Token.Punctuation.Comma,
                Token.Comment.MultiLine.Start,
                Token.Comment.MultiLine.Text("Integer p2"),
                Token.Comment.MultiLine.End,
                Token.Punctuation.Comma,
                Token.PrimitiveType.Integer,
                Token.Identifiers.ParameterName("p3"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("return type is highlighted properly in interface (issue omnisharp-vscode#830)", () => {
            const input = `
public interface test
{
    Task test1(List<String> blah);
    Task test<T>(List<T> blah);
}`;
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Interface,
                Token.Identifiers.InterfaceName("test"),
                Token.Punctuation.OpenBrace,
                Token.Type("Task"),
                Token.Identifiers.MethodName("test1"),
                Token.Punctuation.OpenParen,
                Token.Type("List"),
                Token.Punctuation.TypeParameters.Begin,
                Token.PrimitiveType.String,
                Token.Punctuation.TypeParameters.End,
                Token.Identifiers.ParameterName("blah"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,
                Token.Type("Task"),
                Token.Identifiers.MethodName("test"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Identifiers.TypeParameterName("T"),
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.OpenParen,
                Token.Type("List"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Type("T"),
                Token.Punctuation.TypeParameters.End,
                Token.Identifiers.ParameterName("blah"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("shadowed methods are highlighted properly (issue omnisharp-vscode#1084)", () => {
            const input = Input.InClass(`
private new void foo1() //Correct highlight
{
}

new void foo2() //Function name not highlighted
{
}
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Private,
                Token.Keywords.Modifiers.New,
                Token.PrimitiveType.Void,
                Token.Identifiers.MethodName("foo1"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Correct highlight"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keywords.Modifiers.New,
                Token.PrimitiveType.Void,
                Token.Identifiers.MethodName("foo2"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Function name not highlighted"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("comment at end of line does not change highlights - 1 (issue omnisharp-vscode#1091)", () => {
            const input = Input.InClass(`
public abstract void Notify(PlayerId playerId, ISessionResponse response); //the
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Abstract,
                Token.PrimitiveType.Void,
                Token.Identifiers.MethodName("Notify"),
                Token.Punctuation.OpenParen,
                Token.Type("PlayerId"),
                Token.Identifiers.ParameterName("playerId"),
                Token.Punctuation.Comma,
                Token.Type("ISessionResponse"),
                Token.Identifiers.ParameterName("response"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("the")
            ]);
        });

        it("comment at end of line does not change highlights - 2 (issue omnisharp-vscode#1091)", () => {
            const input = Input.InClass(`
public abstract void Notify(PlayerId playerId, ISessionResponse response); //the
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Abstract,
                Token.PrimitiveType.Void,
                Token.Identifiers.MethodName("Notify"),
                Token.Punctuation.OpenParen,
                Token.Type("PlayerId"),
                Token.Identifiers.ParameterName("playerId"),
                Token.Punctuation.Comma,
                Token.Type("ISessionResponse"),
                Token.Identifiers.ParameterName("response"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("the")
            ]);
        });

        it("comment at end of line does not change highlights - 3 (issue omnisharp-vscode#1091)", () => {
            const input = Input.InClass(`
public abstract void Notify(PlayerId playerId, ISessionResponse response); //the a
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Abstract,
                Token.PrimitiveType.Void,
                Token.Identifiers.MethodName("Notify"),
                Token.Punctuation.OpenParen,
                Token.Type("PlayerId"),
                Token.Identifiers.ParameterName("playerId"),
                Token.Punctuation.Comma,
                Token.Type("ISessionResponse"),
                Token.Identifiers.ParameterName("response"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("the a")
            ]);
        });

        it("parameters with default values (issue #30)", () => {
            const input = Input.InClass(`
void M(String p = null) { }
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Void,
                Token.Identifiers.MethodName("M"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.String,
                Token.Identifiers.ParameterName("p"),
                Token.Operators.Assignment,
                Token.Literals.Null,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("closing parenthesis of parameter list on next line", () => {
            const input = Input.InClass(`
void M(
    String s
    )
{
}`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Void,
                Token.Identifiers.MethodName("M"),
                Token.Punctuation.OpenParen,

                Token.PrimitiveType.String,
                Token.Identifiers.ParameterName("s"),

                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("parameters with multi-dimensional arrays (issue #86)", () => {
            const input = Input.InClass(`
public void LinearRegression(Double[,] samples, Double[] standardDeviations, Integer variables){
    Integer info;
    alglib.linearmodel linearmodel;
    alglib.lrreport ar;`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.PrimitiveType.Void,
                Token.Identifiers.MethodName("LinearRegression"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Double,
                Token.Punctuation.OpenBracket,
                Token.Punctuation.Comma,
                Token.Punctuation.CloseBracket,
                Token.Identifiers.ParameterName("samples"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Double,
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Identifiers.ParameterName("standardDeviations"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Integer,
                Token.Identifiers.ParameterName("variables"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.PrimitiveType.Integer,
                Token.Identifiers.LocalName("info"),
                Token.Punctuation.Semicolon,
                Token.Type("alglib"),
                Token.Punctuation.Accessor,
                Token.Type("linearmodel"),
                Token.Identifiers.LocalName("linearmodel"),
                Token.Punctuation.Semicolon,
                Token.Type("alglib"),
                Token.Punctuation.Accessor,
                Token.Type("lrreport"),
                Token.Identifiers.LocalName("ar"),
                Token.Punctuation.Semicolon,
            ]);
        });
    });
});
