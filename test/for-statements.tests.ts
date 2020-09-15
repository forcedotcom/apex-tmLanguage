import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe('Grammar', () => {
  before(() => {
    should();
  });

  describe('For-Statements', () => {
    it('single-line for loop', async () => {
      const input = Input.InMethod(`for (Integer i = 0; i < 42; i++) { }`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Control.For,
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.LocalName('i'),
        Token.Operators.Assignment,
        Token.Literals.Numeric.Decimal('0'),
        Token.Punctuation.Semicolon,
        Token.Variables.ReadWrite('i'),
        Token.Operators.Relational.LessThan,
        Token.Literals.Numeric.Decimal('42'),
        Token.Punctuation.Semicolon,
        Token.Variables.ReadWrite('i'),
        Token.Operators.Increment,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('for loop with break', async () => {
      const input = Input.InMethod(`
for (Integer i = 0; i < 42; i++)
{
  break;
}`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Control.For,
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.LocalName('i'),
        Token.Operators.Assignment,
        Token.Literals.Numeric.Decimal('0'),
        Token.Punctuation.Semicolon,
        Token.Variables.ReadWrite('i'),
        Token.Operators.Relational.LessThan,
        Token.Literals.Numeric.Decimal('42'),
        Token.Punctuation.Semicolon,
        Token.Variables.ReadWrite('i'),
        Token.Operators.Increment,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Break,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('for loop with continue', async () => {
      const input = Input.InMethod(`
for (Integer i = 0; i < 42; i++)
{
  continue;
}`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Control.For,
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.LocalName('i'),
        Token.Operators.Assignment,
        Token.Literals.Numeric.Decimal('0'),
        Token.Punctuation.Semicolon,
        Token.Variables.ReadWrite('i'),
        Token.Operators.Relational.LessThan,
        Token.Literals.Numeric.Decimal('42'),
        Token.Punctuation.Semicolon,
        Token.Variables.ReadWrite('i'),
        Token.Operators.Increment,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Continue,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('for loop on collection', async () => {
      const input = Input.InMethod(`
for (Integer i : listOfIntegers)
{
  continue;
}`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Control.For,
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Integer,
        Token.Identifiers.LocalName('i'),
        Token.Keywords.Control.ColonIterator,
        Token.Variables.ReadWrite('listOfIntegers'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Continue,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('for loop with a type, a query and a comment', async () => {
      const input = Input.InMethod(`
  for (Account a : [SELECT Id, Name FROM Account]){
    // break;
  }`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Control.For,
        Token.Punctuation.OpenParen,
        Token.Type('Account'),
        Token.Identifiers.LocalName('a'),
        Token.Keywords.Control.ColonIterator,
        Token.Punctuation.OpenBracket,
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Punctuation.Comma,
        Token.Keywords.Queries.FieldName('Name'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('Account'),
        Token.Punctuation.CloseBracket,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Comment.LeadingWhitespace('    '),
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text(' break;'),
        Token.Punctuation.CloseBrace
      ]);
    });

    it('for loop with support types', async () => {
      const input = Input.InMethod(`
  for (SObject myFancyObject : [SELECT Id, Name FROM Account]){
    break;
  }`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Control.For,
        Token.Punctuation.OpenParen,
        Token.Support.Class.Text('SObject'),
        Token.Identifiers.LocalName('myFancyObject'),
        Token.Keywords.Control.ColonIterator,
        Token.Punctuation.OpenBracket,
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Punctuation.Comma,
        Token.Keywords.Queries.FieldName('Name'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('Account'),
        Token.Punctuation.CloseBracket,

        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Break,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('for loop of an array or set', async () => {
      const input = Input.InMethod(`
  for (SObject myFancyObject : SomeArrayOrMap){
    break;
  }`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Control.For,
        Token.Punctuation.OpenParen,
        Token.Support.Class.Text('SObject'),
        Token.Identifiers.LocalName('myFancyObject'),
        Token.Keywords.Control.ColonIterator,
        Token.Variables.ReadWrite('SomeArrayOrMap'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Break,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('for loop or an object', async () => {
      const input = Input.InMethod(`
  for (SObject myFancyObject : myObject.WithMethod()){
    break;
  }`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Control.For,
        Token.Punctuation.OpenParen,
        Token.Support.Class.Text('SObject'),
        Token.Identifiers.LocalName('myFancyObject'),
        Token.Keywords.Control.ColonIterator,
        Token.Variables.Object('myObject'),
        Token.Punctuation.Accessor,
        Token.Identifiers.MethodName('WithMethod'),
        Token.Punctuation.OpenParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Break,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('for loop or an object with safe navigator', async () => {
      const input = Input.InMethod(`
  for (SObject myFancyObject : myObject?.WithMethod()){
    break;
  }`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Control.For,
        Token.Punctuation.OpenParen,
        Token.Support.Class.Text('SObject'),
        Token.Identifiers.LocalName('myFancyObject'),
        Token.Keywords.Control.ColonIterator,
        Token.Variables.Object('myObject'),
        Token.Operators.SafeNavigation,
        Token.Identifiers.MethodName('WithMethod'),
        Token.Punctuation.OpenParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Break,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('for loop a query that uses local variables', async () => {
      const input = Input.InMethod(`
  for (SObject myFancyObject : [SELECT Id, Name FROM User WHERE Id IN :variable]){
    System.debug('This is a test' + myFancyObject);
  }`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Control.For,
        Token.Punctuation.OpenParen,
        Token.Support.Class.Text('SObject'),
        Token.Identifiers.LocalName('myFancyObject'),
        Token.Keywords.Control.ColonIterator,
        Token.Punctuation.OpenBracket,
        Token.Keywords.Queries.Select,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Punctuation.Comma,
        Token.Keywords.Queries.FieldName('Name'),
        Token.Keywords.Queries.From,
        Token.Keywords.Queries.TypeName('User'),
        Token.Keywords.Queries.Where,
        Token.Keywords.Queries.FieldName('Id'),
        Token.Keywords.Queries.OperatorName('IN'),
        Token.Operators.Conditional.Colon,
        Token.Identifiers.LocalName('variable'),
        Token.Punctuation.CloseBracket,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('debug'),
        Token.Punctuation.OpenParen,
        Token.XmlDocComments.String.SingleQuoted.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('This is a test'),
        Token.XmlDocComments.String.SingleQuoted.End,
        Token.Operators.Arithmetic.Addition,
        Token.Variables.ReadWrite('myFancyObject'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });
  });
});
