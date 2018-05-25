/*---------------------------------------------------------------------------------------------
 *  Copyright (c) 2018 Salesforce. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe('Grammar', () => {
  before(() => should());

  describe('Annotation', () => {
    it('annotation on methods', () => {
      const input = Input.InClass(`@deprecated
  // This method is deprecated. Use myOptimizedMethod(String a, String b) instead.
  global void myMethod(String a) {
}`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.AnnotationName('@deprecated'),
        Token.Comment.LeadingWhitespace('  '),
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text(
          ' This method is deprecated. Use myOptimizedMethod(String a, String b) instead.'
        ),
        Token.Keywords.Modifiers.Global,
        Token.PrimitiveType.Void,
        Token.Identifiers.MethodName('myMethod'),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.String,
        Token.Identifiers.ParameterName('a'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('annotation with one parameter', () => {
      const input = Input.InClass(`@future (callout=true)
public static void doCalloutFromFuture() {
}`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.AnnotationName('@future'),
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite('callout'),
        Token.Operators.Assignment,
        Token.Literals.Boolean.True,
        Token.Punctuation.CloseParen,
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.Void,
        Token.Identifiers.MethodName('doCalloutFromFuture'),
        Token.Punctuation.OpenParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('annotation on class', () => {
      const input = Input.FromText(`@isTest
public             class MyTestClass { }`);

      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.AnnotationName('@isTest'),
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Class,
        Token.Identifiers.ClassName('MyTestClass'),
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('annotation with multiple parameters', () => {
      const input = Input.FromText(
        `@InvocableMethod(label='Insert Accounts' description='Inserts new accounts.')`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.AnnotationName('@InvocableMethod'),
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite('label'),
        Token.Operators.Assignment,
        Token.Punctuation.String.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('Insert Accounts'),
        Token.Punctuation.String.End,
        Token.Variables.ReadWrite('description'),
        Token.Operators.Assignment,
        Token.Punctuation.String.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('Inserts new accounts.'),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen
      ]);
    });

    it('annotation with multiple parameters on field', () => {
      const input = Input.InClass(`@InvocableMethod(label='Insert Accounts' description='Inserts new accounts.' required=false)
      global ID leadId;
`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.AnnotationName('@InvocableMethod'),
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite('label'),
        Token.Operators.Assignment,
        Token.Punctuation.String.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('Insert Accounts'),
        Token.Punctuation.String.End,
        Token.Variables.ReadWrite('description'),
        Token.Operators.Assignment,
        Token.Punctuation.String.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('Inserts new accounts.'),
        Token.Punctuation.String.End,
        Token.Variables.ReadWrite('required'),
        Token.Operators.Assignment,
        Token.Literals.Boolean.False,
        Token.Punctuation.CloseParen,
        Token.Keywords.Modifiers.Global,
        Token.PrimitiveType.ID,
        Token.Identifiers.FieldName('leadId'),
        Token.Punctuation.Semicolon
      ]);
    });
  });
});
