/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Grammar", () => {
    before(() => should());

    describe("Indexers", () => {
        it("declaration", () => {

            const input = Input.InClass(`
public String this[Integer index]
{
    get { return index.ToString(); }
}`);

            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.PrimitiveType.String,
                Token.Keywords.This,
                Token.Punctuation.OpenBracket,
                Token.PrimitiveType.Integer,
                Token.Identifiers.ParameterName("index"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Control.Return,
                Token.Variables.Object("index"),
                Token.Punctuation.Accessor,
                Token.Identifiers.MethodName("ToString"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("explicitly-implemented interface member", () => {

            const input = Input.InClass(`String IFoo<String>.this[Integer index];`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Type("IFoo"),
                Token.Punctuation.TypeParameters.Begin,
                Token.PrimitiveType.String,
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.Accessor,
                Token.Keywords.This,
                Token.Punctuation.OpenBracket,
                Token.PrimitiveType.Integer,
                Token.Identifiers.ParameterName("index"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.Semicolon]);
        });

        it("declaration in interface", () => {

            const input = Input.InInterface(`String this[Integer index] { get; set; }`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Keywords.This,
                Token.Punctuation.OpenBracket,
                Token.PrimitiveType.Integer,
                Token.Identifiers.ParameterName("index"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Keywords.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("declaration in interface (read-only)", () => {

            const input = Input.InInterface(`String this[Integer index] { get; }`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Keywords.This,
                Token.Punctuation.OpenBracket,
                Token.PrimitiveType.Integer,
                Token.Identifiers.ParameterName("index"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("declaration in interface (write-only)", () => {

            const input = Input.InInterface(`String this[Integer index] { set; }`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Keywords.This,
                Token.Punctuation.OpenBracket,
                Token.PrimitiveType.Integer,
                Token.Identifiers.ParameterName("index"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("parameters with default values (issue #30)", () => {
            const input = Input.InClass(`
Integer this[String p = null] { }
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Integer,
                Token.Keywords.This,
                Token.Punctuation.OpenBracket,
                Token.PrimitiveType.String,
                Token.Identifiers.ParameterName("p"),
                Token.Operators.Assignment,
                Token.Literals.Null,
                Token.Punctuation.CloseBracket,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("closing bracket of parameter list on next line", () => {
            const input = Input.InClass(`
String this[
    Integer index
    ]
{
}`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Keywords.This,
                Token.Punctuation.OpenBracket,

                Token.PrimitiveType.Integer,
                Token.Identifiers.ParameterName("index"),

                Token.Punctuation.CloseBracket,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("closing bracket of parameter list on next line with attribute", () => {
            const input = Input.InClass(`
String this[
    [In] Integer index
    ]
{
}`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Keywords.This,
                Token.Punctuation.OpenBracket,

                Token.Punctuation.OpenBracket,
                Token.Type("In"),
                Token.Punctuation.CloseBracket,

                Token.PrimitiveType.Integer,
                Token.Identifiers.ParameterName("index"),

                Token.Punctuation.CloseBracket,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });
    });
});
