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

  describe('Switch Statements', () => {
      it('simple switch', () => {
        const input = Input.InMethod(`
switch on(param) {
  when 'A'{
    // some comment.
  } when 'B' {
    System.debug('test');
  }
}`);
        const tokens = tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Switch.Switch,
          Token.Keywords.Switch.On,
          Token.Punctuation.OpenParen,
          Token.Variables.ReadWrite('param'),
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,
          Token.Keywords.Switch.When,
          Token.Punctuation.String.Begin,
          Token.Literals.String('A'),
          Token.Punctuation.String.End,
          Token.Punctuation.OpenBrace,
          Token.Comment.LeadingWhitespace('    '),
          Token.Comment.SingleLine.Start,
          Token.Comment.SingleLine.Text(' some comment.'),
          Token.Punctuation.CloseBrace,

          Token.Keywords.Switch.When,
          Token.Punctuation.String.Begin,
          Token.Literals.String('B'),
          Token.Punctuation.String.End,
          Token.Punctuation.OpenBrace,
          Token.Support.Class.System,
          Token.Punctuation.Accessor,
          Token.Support.Class.FunctionText('debug'),
          Token.Punctuation.OpenParen,
          Token.XmlDocComments.String.SingleQuoted.Begin,
          Token.XmlDocComments.String.SingleQuoted.Text('test'),
          Token.XmlDocComments.String.SingleQuoted.End,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
          Token.Punctuation.CloseBrace,
          // when else
          /*Token.Punctuation.OpenBrace,
          Token.Support.Class.System,
          Token.Punctuation.Accessor,
          Token.Support.Class.FunctionText('debug'),
          Token.Punctuation.OpenParen,
          Token.XmlDocComments.String.SingleQuoted.Begin,
          Token.XmlDocComments.String.SingleQuoted.Text('test'),
          Token.XmlDocComments.String.SingleQuoted.End,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
          Token.Punctuation.CloseBrace,*/
          Token.Punctuation.CloseBrace
        ]);
      });
  });
});
