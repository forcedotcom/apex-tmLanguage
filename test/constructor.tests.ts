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

  describe('Constructors', () => {
    it('instance constructor with no parameters', () => {
      const input = Input.InClass(`TestClass() { }`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Identifiers.MethodName('TestClass'),
        Token.Punctuation.OpenParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('public instance constructor with no parameters', () => {
      const input = Input.InClass(`public TestClass() { }`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Identifiers.MethodName('TestClass'),
        Token.Punctuation.OpenParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('public instance constructor with one parameter', () => {
      const input = Input.InClass(`public TestClass(Integer x) { }`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Identifiers.MethodName('TestClass'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('x'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('public instance constructor with one ref parameter', () => {
      const input = Input.InClass(`public TestClass(Object x) { }`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Identifiers.MethodName('TestClass'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Object,
        Token.Identifiers.ParameterName('x'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('instance constructor with two parameters', () => {
      const input = Input.InClass(`
TestClass(String x, Integer y)
{
}`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Identifiers.MethodName('TestClass'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.String,
        Token.Identifiers.ParameterName('x'),
        Token.Punctuation.Comma,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('y'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('static constructor no parameters', () => {
      const input = Input.InClass(`TestClass() { }`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Identifiers.MethodName('TestClass'),
        Token.Punctuation.OpenParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('Open multiline comment in front of parameter highlights properly (issue omnisharp-vscode#861)', () => {
      const input = Input.InClass(`
WaitHandle(Task self)
{
    this.task = self;
}
`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Identifiers.MethodName('WaitHandle'),
        Token.Punctuation.OpenParen,
        Token.Type('Task'),
        Token.Identifiers.ParameterName('self'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.This,
        Token.Punctuation.Accessor,
        Token.Variables.Property('task'),
        Token.Operators.Assignment,
        Token.Variables.ReadWrite('self'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('closing parenthesis of parameter list on next line', () => {
      const input = Input.InClass(`
public C(
    String s
    )
{
}`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Identifiers.MethodName('C'),
        Token.Punctuation.OpenParen,

        Token.PrimitiveType.String,
        Token.Identifiers.ParameterName('s'),

        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('closing parenthesis of parameter list on next line (issue #88)', () => {
      const input = Input.InClass(`
public AccountController(
    UserManager<User> userManager,
    SignInManager<User> signInManager,
    ILogger<AccountController> logger
    )
{
}`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Identifiers.MethodName('AccountController'),
        Token.Punctuation.OpenParen,

        Token.Type('UserManager'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Type('User'),
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.ParameterName('userManager'),
        Token.Punctuation.Comma,

        Token.Type('SignInManager'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Type('User'),
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.ParameterName('signInManager'),
        Token.Punctuation.Comma,

        Token.Type('ILogger'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Type('AccountController'),
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.ParameterName('logger'),

        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });
  });
});
