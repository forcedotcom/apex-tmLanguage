/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Modifications Copyright (c) 2018 Salesforce.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe('Grammar', () => {
  before(() => { should(); });

  describe('Operators', () => {
    it('unary +', () => {
      const input = Input.InClass(
        `public static Integer opMethodName(Integer value) { return +value; }`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.Integer,
        Token.Identifiers.MethodName('opMethodName'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('value'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Return,
        Token.Operators.Arithmetic.Addition,
        Token.Variables.ReadWrite('value'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('unary -', () => {
      const input = Input.InClass(
        `public static Integer opMethodName(Integer value) { return -value; }`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.Integer,
        Token.Identifiers.MethodName('opMethodName'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('value'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Return,
        Token.Operators.Arithmetic.Subtraction,
        Token.Variables.ReadWrite('value'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('unary !', () => {
      const input = Input.InClass(
        `public static Boolean opMethodName(Integer value) { return !(value == 0); }`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.Boolean,
        Token.Identifiers.MethodName('opMethodName'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('value'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Return,
        Token.Operators.Logical.Not,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite('value'),
        Token.Operators.Relational.Equals,
        Token.Literals.Numeric.Decimal('0'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('unary ++', () => {
      const input = Input.InClass(
        `public static Integer opMethodName(Integer value) { return ++value; }`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.Integer,
        Token.Identifiers.MethodName('opMethodName'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('value'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Return,
        Token.Operators.Increment,
        Token.Variables.ReadWrite('value'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('unary --', () => {
      const input = Input.InClass(
        `public static Integer opMethodName(Integer value) { return --value; }`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.Integer,
        Token.Identifiers.MethodName('opMethodName'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('value'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Return,
        Token.Operators.Decrement,
        Token.Variables.ReadWrite('value'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('binary not equal', () => {
      const input = Input.InClass(
        `public static Boolean opMethodName(Integer value) { return value != 0; }`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.Boolean,
        Token.Identifiers.MethodName('opMethodName'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('value'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Return,
        Token.Variables.ReadWrite('value'),
        Token.Operators.Relational.NotEqual,
        Token.Literals.Numeric.Decimal('0'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('binary equals', () => {
      const input = Input.InClass(
        `public static Boolean opMethodName(Integer value) { return value == 0; }`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.Boolean,
        Token.Identifiers.MethodName('opMethodName'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('value'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Return,
        Token.Variables.ReadWrite('value'),
        Token.Operators.Relational.Equals,
        Token.Literals.Numeric.Decimal('0'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('binary +', () => {
      const input = Input.InClass(
        `public static Integer opMethodName(Integer x, Integer y) { return x + y; }`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.Integer,
        Token.Identifiers.MethodName('opMethodName'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('x'),
        Token.Punctuation.Comma,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('y'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Return,
        Token.Variables.ReadWrite('x'),
        Token.Operators.Arithmetic.Addition,
        Token.Variables.ReadWrite('y'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('binary -', () => {
      const input = Input.InClass(
        `public static Integer opMethodName(Integer x, Integer y) { return x - y; }`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.Integer,
        Token.Identifiers.MethodName('opMethodName'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('x'),
        Token.Punctuation.Comma,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('y'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Return,
        Token.Variables.ReadWrite('x'),
        Token.Operators.Arithmetic.Subtraction,
        Token.Variables.ReadWrite('y'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('binary *', () => {
      const input = Input.InClass(
        `public static Integer opMethodName(Integer x, Integer y) { return x * y; }`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.Integer,
        Token.Identifiers.MethodName('opMethodName'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('x'),
        Token.Punctuation.Comma,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('y'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Return,
        Token.Variables.ReadWrite('x'),
        Token.Operators.Arithmetic.Multiplication,
        Token.Variables.ReadWrite('y'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('binary /', () => {
      const input = Input.InClass(
        `public static Integer opMethodName(Integer x, Integer y) { return x / y; }`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.Integer,
        Token.Identifiers.MethodName('opMethodName'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('x'),
        Token.Punctuation.Comma,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('y'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Return,
        Token.Variables.ReadWrite('x'),
        Token.Operators.Arithmetic.Division,
        Token.Variables.ReadWrite('y'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('binary &', () => {
      const input = Input.InClass(
        `public static Integer opMethodName(Integer x, Integer y) { return x & y; }`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.Integer,
        Token.Identifiers.MethodName('opMethodName'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('x'),
        Token.Punctuation.Comma,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('y'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Return,
        Token.Variables.ReadWrite('x'),
        Token.Operators.Bitwise.And,
        Token.Variables.ReadWrite('y'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('binary |', () => {
      const input = Input.InClass(
        `public static Integer opMethodName(Integer x, Integer y) { return x | y; }`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.Integer,
        Token.Identifiers.MethodName('opMethodName'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('x'),
        Token.Punctuation.Comma,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('y'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Return,
        Token.Variables.ReadWrite('x'),
        Token.Operators.Bitwise.Or,
        Token.Variables.ReadWrite('y'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('binary <<', () => {
      const input = Input.InClass(
        `public static Integer opMethodName(Integer x, Integer y) { return x << y; }`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.Integer,
        Token.Identifiers.MethodName('opMethodName'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('x'),
        Token.Punctuation.Comma,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('y'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Return,
        Token.Variables.ReadWrite('x'),
        Token.Operators.Bitwise.ShiftLeft,
        Token.Variables.ReadWrite('y'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('binary >>', () => {
      const input = Input.InClass(
        `public static Integer opMethodName(Integer x, Integer y) { return x >> y; }`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.Integer,
        Token.Identifiers.MethodName('opMethodName'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('x'),
        Token.Punctuation.Comma,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('y'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Return,
        Token.Variables.ReadWrite('x'),
        Token.Operators.Bitwise.ShiftRight,
        Token.Variables.ReadWrite('y'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('binary >', () => {
      const input = Input.InClass(
        `public static Boolean opMethodName(Integer x, Integer y) { return x > y; }`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.Boolean,
        Token.Identifiers.MethodName('opMethodName'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('x'),
        Token.Punctuation.Comma,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('y'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Return,
        Token.Variables.ReadWrite('x'),
        Token.Operators.Relational.GreaterThan,
        Token.Variables.ReadWrite('y'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('binary <', () => {
      const input = Input.InClass(
        `public static Boolean opMethodName(Integer x, Integer y) { return x < y; }`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.Boolean,
        Token.Identifiers.MethodName('opMethodName'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('x'),
        Token.Punctuation.Comma,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('y'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Return,
        Token.Variables.ReadWrite('x'),
        Token.Operators.Relational.LessThan,
        Token.Variables.ReadWrite('y'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('binary >=', () => {
      const input = Input.InClass(
        `public static Boolean opMethodName(Integer x, Integer y) { return x >= y; }`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.Boolean,
        Token.Identifiers.MethodName('opMethodName'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('x'),
        Token.Punctuation.Comma,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('y'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Return,
        Token.Variables.ReadWrite('x'),
        Token.Operators.Relational.GreaterThanOrEqual,
        Token.Variables.ReadWrite('y'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('binary <=', () => {
      const input = Input.InClass(
        `public static Boolean opMethodName(Integer x, Integer y) { return x <= y; }`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.Boolean,
        Token.Identifiers.MethodName('opMethodName'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('x'),
        Token.Punctuation.Comma,
        Token.PrimitiveType.Integer,
        Token.Identifiers.ParameterName('y'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Return,
        Token.Variables.ReadWrite('x'),
        Token.Operators.Relational.LessThanOrEqual,
        Token.Variables.ReadWrite('y'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });
  });
});
