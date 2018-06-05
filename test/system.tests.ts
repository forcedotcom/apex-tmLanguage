import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe('Grammar', () => {
  before(() => should());

  describe('Apex System Class', () => {
    it('System method used in trigger', () => {
      const input = Input.InTrigger(`System.isBatch();`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('isBatch'),
        Token.Punctuation.OpenParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon
      ]);
    });

    it('System method with no parameters', () => {
      const input = Input.InMethod(`System.isBatch();`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('isBatch'),
        Token.Punctuation.OpenParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon
      ]);
    });

    it('System method with one parameter', () => {
      const input = Input.InMethod(`System.debug('This is a test');`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('debug'),
        Token.Punctuation.OpenParen,
        Token.XmlDocComments.String.SingleQuoted.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('This is a test'),
        Token.XmlDocComments.String.SingleQuoted.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon
      ]);
    });

    it('System method with two parameter', () => {
      const input = Input.InMethod(`System.debug(System.LoggingLevel.INFO, 'This is a test');`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('debug'),
        Token.Punctuation.OpenParen,
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.TypeText('LoggingLevel'),
        Token.Punctuation.Accessor,
        Token.Support.Class.TypeText('INFO'),
        Token.Punctuation.Comma,
        Token.XmlDocComments.String.SingleQuoted.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('This is a test'),
        Token.XmlDocComments.String.SingleQuoted.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon
      ]);
    });

    it('System method with two parameter usage in trigger', () => {
      const input = Input.InTrigger(`System.debug(System.LoggingLevel.INFO, 'This is a test');`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('debug'),
        Token.Punctuation.OpenParen,
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.TypeText('LoggingLevel'),
        Token.Punctuation.Accessor,
        Token.Support.Class.TypeText('INFO'),
        Token.Punctuation.Comma,
        Token.XmlDocComments.String.SingleQuoted.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('This is a test'),
        Token.XmlDocComments.String.SingleQuoted.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon
      ]);
    });

    it('System type - local variable declaration', () => {
      const input = Input.InMethod(`System.LoggingLevel wa = 'This is a test';`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.TypeText('LoggingLevel'),
        Token.Identifiers.LocalName('wa'),
        Token.Operators.Assignment,
        Token.XmlDocComments.String.SingleQuoted.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('This is a test'),
        Token.XmlDocComments.String.SingleQuoted.End,
        Token.Punctuation.Semicolon
      ]);
    });

    it('System type - field declaration in class', () => {
      const input = Input.InClass(`System.Object x;`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.TypeText('Object'),
        Token.Identifiers.FieldName('x'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('System type - local declaration in trigger', () => {
      const input = Input.InTrigger(`System.Object x;`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.TypeText('Object'),
        Token.Identifiers.LocalName('x'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('System.<something> as parameter on method signature', () => {
      const input = Input.InClass(`public static void runAssignmentRules(System.LoggingLevel lUsers){}`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.Void,
        Token.Identifiers.MethodName('runAssignmentRules'),
        Token.Punctuation.OpenParen,
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.TypeText('LoggingLevel'),
        Token.Identifiers.ParameterName('lUsers'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('Database usage in method', () => {
      const input = Input.InMethod(`Savepoint sp = Database.setSavepoint();`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.Text('Savepoint'),
        Token.Identifiers.LocalName('sp'),
        Token.Operators.Assignment,
        Token.Support.Class.Database,
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('setSavepoint'),
        Token.Punctuation.OpenParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon
      ]);
    });

    it('Database usage in trigger', () => {
      const input = Input.InTrigger(`List<Database.SaveResult> saveResults = Database.insert(lnewPermSets, false);`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Type('List'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Support.Class.Database,
        Token.Punctuation.Accessor,
        Token.Support.Class.TypeText('SaveResult'),
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.LocalName('saveResults'),
        Token.Operators.Assignment,
        Token.Support.Class.Database,
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('insert'),
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite('lnewPermSets'),
        Token.Punctuation.Comma,
        Token.Literals.Boolean.False,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon
      ]);
    });

    it('insert method usage in trigger', () => {
      const input = Input.InTrigger(`insert lResults;`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.Text('insert'),
        Token.Identifiers.LocalName('lResults'),
        Token.Punctuation.Semicolon
      ]);
    });
  });
});
