/*---------------------------------------------------------------------------------------------
 *  Copyright (c) 2018 Salesforce. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe('Grammar', () => {
  before(() => {
    should();
  });

  describe('Apex Trigger', () => {
    it('before insert before update Account trigger', async () => {
      const input = Input.FromText(`trigger myAccountTrigger on Account (before insert, after update) {
        // Your code here
        if(true) {}
}`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Trigger,
        Token.Identifiers.TriggerName('myAccountTrigger'),
        Token.Keywords.Triggers.On,
        Token.Type('Account'),
        Token.Punctuation.OpenParen,
        Token.Keywords.Triggers.Before,
        Token.Keywords.Triggers.OperatorName('insert'),
        Token.Punctuation.Comma,
        Token.Keywords.Triggers.After,
        Token.Keywords.Triggers.OperatorName('update'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Comment.LeadingWhitespace('        '),
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text(' Your code here'),
        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Literals.Boolean.True,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('context variables specific to triggers used in methods', async () => {
      const input = Input.InMethod(
        `if (Trigger.isBefore && Trigger.isInsert) {}`
      );
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Support.Class.Trigger,
        Token.Punctuation.Accessor,
        Token.Support.Type.TriggerText('isBefore'),
        Token.Operators.Logical.And,
        Token.Support.Class.Trigger,
        Token.Punctuation.Accessor,
        Token.Support.Type.TriggerText('isInsert'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('context variables specific to triggers', async () => {
      const input = Input.InTrigger(
        `if (Trigger.isBefore && Trigger.isInsert) {}`
      );
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Support.Class.Trigger,
        Token.Punctuation.Accessor,
        Token.Support.Type.TriggerText('isBefore'),
        Token.Operators.Logical.And,
        Token.Support.Class.Trigger,
        Token.Punctuation.Accessor,
        Token.Support.Type.TriggerText('isInsert'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('triggers language specific functions', async () => {
      const input = Input.InTrigger(`Trigger.newMap.keySet();`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.Trigger,
        Token.Punctuation.Accessor,
        Token.Support.Type.TriggerText('newMap'),
        Token.Punctuation.Accessor,
        Token.Support.Function.TriggerText('keySet'),
        Token.Punctuation.OpenParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon
      ]);
    });

    it('triggers language specific functions - complex scenario', async () => {
      const input = Input.InTrigger(
        `Trigger.newMap.get(q.opportunity__c).addError('Cannot delete quote');`
      );
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.Trigger,
        Token.Punctuation.Accessor,
        Token.Support.Type.TriggerText('newMap'),
        Token.Punctuation.Accessor,
        Token.Support.Function.TriggerText('get'),
        Token.Punctuation.OpenParen,
        Token.Variables.Object('q'),
        Token.Punctuation.Accessor,
        Token.Variables.Property('opportunity__c'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.Accessor,
        Token.Support.Function.TriggerText('addError'),
        Token.Punctuation.OpenParen,
        Token.Punctuation.String.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('Cannot delete quote'),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon
      ]);
    });

    it('SOQL in triggers', async () => {
      const input = Input.InTrigger(
        `Contact[] cons = [SELECT LastName FROM Contact WHERE AccountId IN :Trigger.new];`
      );
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Type('Contact'),
        Token.Punctuation.OpenBracket,
        Token.Punctuation.CloseBracket,
        Token.Identifiers.LocalName('cons'),
        Token.Operators.Assignment,
        Token.Punctuation.OpenBracket,
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('LastName'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('Contact'),
        Token.Keywords.Queries.Where,
        Token.Keywords.Queries.FieldName('AccountId'),
        Token.Keywords.Queries.OperatorName('IN'),
        Token.Operators.Conditional.Colon,
        Token.Support.Class.Trigger,
        Token.Punctuation.Accessor,
        Token.Support.Type.TriggerText('new'),
        Token.Punctuation.CloseBracket,
        Token.Punctuation.Semicolon
      ]);
    });

    it('SOQL in triggers using methods in clauses', async () => {
      const input = Input.InTrigger(
        `Contact[] cons = [SELECT LastName FROM Contact WHERE AccountId IN :keys('w')];`
      );
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Type('Contact'),
        Token.Punctuation.OpenBracket,
        Token.Punctuation.CloseBracket,
        Token.Identifiers.LocalName('cons'),
        Token.Operators.Assignment,
        Token.Punctuation.OpenBracket,
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('LastName'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('Contact'),
        Token.Keywords.Queries.Where,
        Token.Keywords.Queries.FieldName('AccountId'),
        Token.Keywords.Queries.OperatorName('IN'),
        Token.Operators.Conditional.Colon,
        Token.Identifiers.MethodName('keys'),
        Token.Punctuation.OpenParen,
        Token.Punctuation.String.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('w'),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseBracket,
        Token.Punctuation.Semicolon
      ]);
    });

    it('SOQL in triggers using objects in clauses', async () => {
      const input = Input.InTrigger(
        `Contact[] cons = [SELECT LastName FROM Contact WHERE AccountId IN :myObject.keys('w')];`
      );
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Type('Contact'),
        Token.Punctuation.OpenBracket,
        Token.Punctuation.CloseBracket,
        Token.Identifiers.LocalName('cons'),
        Token.Operators.Assignment,
        Token.Punctuation.OpenBracket,
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('LastName'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('Contact'),
        Token.Keywords.Queries.Where,
        Token.Keywords.Queries.FieldName('AccountId'),
        Token.Keywords.Queries.OperatorName('IN'),
        Token.Operators.Conditional.Colon,
        Token.Variables.Object('myObject'),
        Token.Punctuation.Accessor,
        Token.Identifiers.MethodName('keys'),
        Token.Punctuation.OpenParen,
        Token.Punctuation.String.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('w'),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseBracket,
        Token.Punctuation.Semicolon
      ]);
    });
  });
});
