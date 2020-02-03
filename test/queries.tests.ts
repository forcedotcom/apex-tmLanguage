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

  describe('Queries', () => {
    it('simple query inside of brackets', () => {
      const input = Input.InMethod(
        `List<User> lUsers = [SELECT Id, Name  FROM User ];`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Type('List'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Type('User'),
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.LocalName('lUsers'),
        Token.Operators.Assignment,
        Token.Punctuation.OpenBracket,
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Punctuation.Comma,
        Token.Keywords.Queries.FieldName('Name'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('User'),
        Token.Punctuation.CloseBracket,
        Token.Punctuation.Semicolon
      ]);
    });

    it('simple query inside of brackets with multiple fields', () => {
      const input = Input.InMethod(
        `List<User> lUsers = [SELECT Id, Custom_Field__c, Profile.Id, CreatedDate FROM User];`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Type('List'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Type('User'),
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.LocalName('lUsers'),
        Token.Operators.Assignment,
        Token.Punctuation.OpenBracket,
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Punctuation.Comma,
        Token.Keywords.Queries.FieldName('Custom_Field__c'),
        Token.Punctuation.Comma,
        Token.Keywords.Queries.FieldName('Profile.Id'),
        Token.Punctuation.Comma,
        Token.Keywords.Queries.FieldName('CreatedDate'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('User'),
        Token.Punctuation.CloseBracket,
        Token.Punctuation.Semicolon
      ]);
    });

    it('simple query inside of brackets with multiple fields and where clause', () => {
      const input = Input.InMethod(
        `List<User> lUsers = [SELECT Id, Custom_Field__c, Profile.Id, CreatedDate FROM User WHERE Id = '10'];`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Type('List'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Type('User'),
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.LocalName('lUsers'),
        Token.Operators.Assignment,
        Token.Punctuation.OpenBracket,
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Punctuation.Comma,
        Token.Keywords.Queries.FieldName('Custom_Field__c'),
        Token.Punctuation.Comma,
        Token.Keywords.Queries.FieldName('Profile.Id'),
        Token.Punctuation.Comma,
        Token.Keywords.Queries.FieldName('CreatedDate'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('User'),
        Token.Keywords.Queries.Where,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Operators.Assignment,
        Token.Punctuation.String.Begin,
        Token.Literals.String('10'),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseBracket,
        Token.Punctuation.Semicolon
      ]);
    });

    it('complex query', () => {
      const input = Input.InMethod(
        `List<User> lUsers = [SELECT Id, Custom_Field__c, (SELECT Id FROM account), Profile.Id, CreatedDate FROM User WHERE Id = '10'];`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Type('List'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Type('User'),
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.LocalName('lUsers'),
        Token.Operators.Assignment,
        Token.Punctuation.OpenBracket,
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Punctuation.Comma,
        Token.Keywords.Queries.FieldName('Custom_Field__c'),
        Token.Punctuation.Comma,
        Token.Punctuation.OpenParen,
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('account'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.Comma,
        Token.Keywords.Queries.FieldName('Profile.Id'),
        Token.Punctuation.Comma,
        Token.Keywords.Queries.FieldName('CreatedDate'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('User'),
        Token.Keywords.Queries.Where,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Operators.Assignment,
        Token.Punctuation.String.Begin,
        Token.Literals.String('10'),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseBracket,
        Token.Punctuation.Semicolon
      ]);
    });

    it('order by', () => {
      const input = Input.InMethod(
        `List<User> lUsers = [SELECT Id FROM account ORDER BY SomeField__c];`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Type('List'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Type('User'),
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.LocalName('lUsers'),
        Token.Operators.Assignment,
        Token.Punctuation.OpenBracket,
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('account'),
        Token.Keywords.Queries.OrderBy,
        Token.Keywords.Queries.FieldName('SomeField__c'),
        Token.Punctuation.CloseBracket,
        Token.Punctuation.Semicolon
      ]);
    });

    it('order by ascending', () => {
      const input = Input.InMethod(
        `List<User> lUsers = [SELECT Id FROM account ORDER BY SomeField__c ASC];`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Type('List'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Type('User'),
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.LocalName('lUsers'),
        Token.Operators.Assignment,
        Token.Punctuation.OpenBracket,
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('account'),
        Token.Keywords.Queries.OrderBy,
        Token.Keywords.Queries.FieldName('SomeField__c'),
        Token.Keywords.Queries.Ascending,
        Token.Punctuation.CloseBracket,
        Token.Punctuation.Semicolon
      ]);
    });

    it('order by descending nulls last', () => {
      const input = Input.InMethod(
        `List<User> lUsers = [SELECT Id FROM account ORDER BY Name DESC NULLS last];`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Type('List'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Type('User'),
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.LocalName('lUsers'),
        Token.Operators.Assignment,
        Token.Punctuation.OpenBracket,
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('account'),
        Token.Keywords.Queries.OrderBy,
        Token.Keywords.Queries.FieldName('Name'),
        Token.Keywords.Queries.Descending,
        Token.Keywords.Queries.NullsLast,
        Token.Punctuation.CloseBracket,
        Token.Punctuation.Semicolon
      ]);
    });

    it('simple query inside of brackets with where & in clause', () => {
      const input = Input.InMethod(
        `List<User> lUsers = [SELECT Id FROM User WHERE Id IN :variable];`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Type('List'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Type('User'),
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.LocalName('lUsers'),
        Token.Operators.Assignment,
        Token.Punctuation.OpenBracket,
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('User'),
        Token.Keywords.Queries.Where,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Keywords.Queries.OperatorName('IN'),
        Token.Operators.Conditional.Colon,
        Token.Identifiers.LocalName('variable'),
        Token.Punctuation.CloseBracket,
        Token.Punctuation.Semicolon
      ]);
    });

    it('where clause with parameter grouping', () => {
      const input = Input.InMethod(
        `SELECT Id FROM Subscription__c WHERE (Contract__c IN :contractIds OR Contract__c = 'Name')`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('Subscription__c'),
        Token.Keywords.Queries.Where,
        Token.Punctuation.OpenParen,
        Token.Keywords.Queries.FieldName('Contract__c'),
        Token.Keywords.Queries.OperatorName('IN'),
        Token.Operators.Conditional.Colon,
        Token.Identifiers.LocalName('contractIds'),
        Token.Keywords.Queries.OperatorName('OR'),
        Token.Keywords.Queries.FieldName('Contract__c'),
        Token.Operators.Assignment,
        Token.Punctuation.String.Begin,
        Token.Literals.String('Name'),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen
      ]);
    });

    it('where clause with nested parameter grouping', () => {
      const input = Input.InMethod(
        `SELECT Id FROM Subscription__c WHERE (Contract__c IN :contractIds OR (Contract__c = 'Name' AND Price__c = 20))`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('Subscription__c'),
        Token.Keywords.Queries.Where,
        Token.Punctuation.OpenParen,
        Token.Keywords.Queries.FieldName('Contract__c'),
        Token.Keywords.Queries.OperatorName('IN'),
        Token.Operators.Conditional.Colon,
        Token.Identifiers.LocalName('contractIds'),
        Token.Keywords.Queries.OperatorName('OR'),
        Token.Punctuation.OpenParen,
        Token.Keywords.Queries.FieldName('Contract__c'),
        Token.Operators.Assignment,
        Token.Punctuation.String.Begin,
        Token.Literals.String('Name'),
        Token.Punctuation.String.End,
        Token.Keywords.Queries.OperatorName('AND'),
        Token.Keywords.Queries.FieldName('Price__c'),
        Token.Operators.Assignment,
        Token.Literals.Numeric.Decimal('20'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseParen
      ]);
    });

    it('query with multiple operators after where clause', () => {
      const input = Input.InMethod(
        `SELECT Id FROM Contact WHERE Name LIKE 'A%' AND MailingState='California'`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('Contact'),
        Token.Keywords.Queries.Where,
        Token.Keywords.Queries.FieldName('Name'),
        Token.Keywords.Queries.OperatorName('LIKE'),
        Token.Punctuation.String.Begin,
        Token.Literals.String('A%'),
        Token.Punctuation.String.End,
        Token.Keywords.Queries.OperatorName('AND'),
        Token.Keywords.Queries.FieldName('MailingState'),
        Token.Operators.Assignment,
        Token.Punctuation.String.Begin,
        Token.Literals.String('California'),
        Token.Punctuation.String.End
      ]);
    });

    it('query with datetime constant usage', () => {
      const input = Input.InMethod(
        `SELECT Name FROM Account WHERE CreatedDate > 2011-04-26T10:00:00-08:00`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Name'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('Account'),
        Token.Keywords.Queries.Where,
        Token.Keywords.Queries.FieldName('CreatedDate'),
        Token.Operators.Relational.GreaterThan,
        Token.Literals.Numeric.DateTimeUTC('2011-04-26T10:00:00-08:00')
      ]);
    });

    it('query using soql methods on conditional syntax', () => {
      const input = Input.InMethod(
        `SELECT Amount FROM Opportunity WHERE CALENDAR_YEAR(CreatedDate) = 2011`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Amount'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('Opportunity'),
        Token.Keywords.Queries.Where,
        Token.Keywords.Queries.QueryMethod('CALENDAR_YEAR'),
        Token.Punctuation.OpenParen,
        Token.Keywords.Queries.FieldName('CreatedDate'),
        Token.Punctuation.CloseParen,
        Token.Operators.Assignment,
        Token.Literals.Numeric.Decimal('2011')
      ]);
    });

    it('query using soql methods for translation', () => {
      const input = Input.InMethod(
        `SELECT Company, toLabel(Recordtype.Name) FROM Lead`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Company'),
        Token.Punctuation.Comma,
        Token.Keywords.Queries.QueryMethod('toLabel'),
        Token.Punctuation.OpenParen,
        Token.Keywords.Queries.FieldName('Recordtype.Name'),
        Token.Punctuation.CloseParen,
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('Lead')
      ]);
    });

    it('query using soql methods for translation', () => {
      const input = Input.InMethod(
        `SELECT Id, MSP1__c FROM CustObj__c WHERE MSP1__c INCLUDES ('AAA;BBB','CCC')`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Punctuation.Comma,
        Token.Keywords.Queries.FieldName('MSP1__c'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('CustObj__c'),
        Token.Keywords.Queries.Where,
        Token.Keywords.Queries.FieldName('MSP1__c'),
        Token.Keywords.Queries.QueryMethod('INCLUDES'),
        Token.Punctuation.OpenParen,
        Token.Punctuation.String.Begin,
        Token.Literals.String('AAA;BBB'),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.String.Begin,
        Token.Literals.String('CCC'),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen
      ]);
    });

    it('Filtering on Polymorphic Relationship Fields', () => {
      const input = Input.InMethod(
        `SELECT Id FROM Event WHERE What.Type NOT IN ('Account', 'Opportunity')`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('Event'),
        Token.Keywords.Queries.Where,
        Token.Keywords.Queries.FieldName('What.Type'),
        Token.Keywords.Queries.OperatorName('NOT IN'),
        Token.Punctuation.OpenParen,
        Token.Punctuation.String.Begin,
        Token.Literals.String('Account'),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.String.Begin,
        Token.Literals.String('Opportunity'),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen
      ]);
    });

    it('Filtering using date literals', () => {
      const input = Input.InMethod(
        `SELECT Id FROM Account WHERE CreatedDate = LAST_90_DAYS`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('Account'),
        Token.Keywords.Queries.Where,
        Token.Keywords.Queries.FieldName('CreatedDate'),
        Token.Operators.Assignment,
        Token.Keywords.Queries.DateLiteral('LAST_90_DAYS')
      ]);
    });

    it('Filtering using date literals', () => {
      const input = Input.InMethod(
        `SELECT Id FROM Opportunity WHERE CloseDate > LAST_N_FISCAL_YEARS:3`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('Opportunity'),
        Token.Keywords.Queries.Where,
        Token.Keywords.Queries.FieldName('CloseDate'),
        Token.Operators.Relational.GreaterThan,
        Token.Keywords.Queries.DateLiteral('LAST_N_FISCAL_YEARS:3')
      ]);
    });

    it('USING SCOPE: Get all account that belong to you', () => {
      const input = Input.InMethod(`SELECT Id FROM Account USING SCOPE Mine`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('Account'),
        Token.Keywords.Queries.UsingScope('USING SCOPE Mine')
      ]);
    });

    it('filter using LIMIT & OFFSET', () => {
      const input = Input.InMethod(
        `SELECT Id FROM Discontinued_Merchandise__c LIMIT 100 OFFSET 20`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('Discontinued_Merchandise__c'),
        Token.Keywords.Queries.OperatorName('LIMIT'),
        Token.Literals.Numeric.Decimal('100'),
        Token.Keywords.Queries.OperatorName('OFFSET'),
        Token.Literals.Numeric.Decimal('20')
      ]);
    });

    it('group by rollup', () => {
      const input = Input.InMethod(
        `SELECT Status, LeadSource, COUNT(Name) cnt FROM Lead GROUP BY ROLLUP(Status, LeadSource)`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Status'),
        Token.Punctuation.Comma,
        Token.Keywords.Queries.FieldName('LeadSource'),
        Token.Punctuation.Comma,
        Token.Keywords.Queries.QueryMethod('COUNT'),
        Token.Punctuation.OpenParen,
        Token.Keywords.Queries.FieldName('Name'),
        Token.Punctuation.CloseParen,
        Token.Keywords.Queries.FieldName('cnt'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('Lead'),
        Token.Keywords.Queries.QueryMethod('GROUP BY ROLLUP'),
        Token.Punctuation.OpenParen,
        Token.Keywords.Queries.FieldName('Status'),
        Token.Punctuation.Comma,
        Token.Keywords.Queries.FieldName('LeadSource'),
        Token.Punctuation.CloseParen
      ]);
    });

    it('soql function has another soql function as parameter', () => {
      const input = Input.InMethod(
        `SELECT CreatedDate FROM Opportunity GROUP BY HOUR_IN_DAY(convertTimezone(CreatedDate))`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('CreatedDate'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('Opportunity'),
        Token.Keywords.Queries.OperatorName('GROUP BY'),
        Token.Keywords.Queries.QueryMethod('HOUR_IN_DAY'),
        Token.Punctuation.OpenParen,
        Token.Keywords.Queries.QueryMethod('convertTimezone'),
        Token.Punctuation.OpenParen,
        Token.Keywords.Queries.FieldName('CreatedDate'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseParen
      ]);
    });

    it('simple query inside of brackets with where & in clause', () => {
      const input = Input.InMethod(`SELECT Id FROM User WHERE Id IN :variable`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('User'),
        Token.Keywords.Queries.Where,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Keywords.Queries.OperatorName('IN'),
        Token.Operators.Conditional.Colon,
        Token.Identifiers.LocalName('variable')
      ]);
    });
  });
});
