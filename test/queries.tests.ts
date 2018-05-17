import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe('Grammar', () => {
  before(() => should());

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
        Token.Keywords.Queries.In,
        Token.Operators.Conditional.Colon,
        Token.Keywords.Queries.FieldName('variable'),
        Token.Punctuation.CloseBracket,
        Token.Punctuation.Semicolon
      ]);
    });
  });
});
