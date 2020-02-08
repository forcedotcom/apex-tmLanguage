import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe('Grammar', () => {
  before(() => {
    should();
  });

  describe('Apex System Class', () => {
    it('System method used in trigger', async () => {
      const input = Input.InTrigger(`System.isBatch();`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('isBatch'),
        Token.Punctuation.OpenParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon
      ]);
    });

    it('System method with no parameters', async () => {
      const input = Input.InMethod(`System.isBatch();`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('isBatch'),
        Token.Punctuation.OpenParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon
      ]);
    });

    it('System method with one parameter', async () => {
      const input = Input.InMethod(`System.debug('This is a test');`);
      const tokens = await tokenize(input);

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

    it('System method with two parameter', async () => {
      const input = Input.InMethod(
        `System.debug(System.LoggingLevel.INFO, 'This is a test');`
      );
      const tokens = await tokenize(input);

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

    it('System method with two parameter usage in trigger', async () => {
      const input = Input.InTrigger(
        `System.debug(System.LoggingLevel.INFO, 'This is a test');`
      );
      const tokens = await tokenize(input);

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

    it('System type - local variable declaration', async () => {
      const input = Input.InMethod(
        `System.LoggingLevel wa = 'This is a test';`
      );
      const tokens = await tokenize(input);

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

    it('System type - field declaration in class', async () => {
      const input = Input.InClass(`System.Object x;`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.TypeText('Object'),
        Token.Identifiers.FieldName('x'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('System type - local declaration in trigger', async () => {
      const input = Input.InTrigger(`System.Object x;`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.TypeText('Object'),
        Token.Identifiers.LocalName('x'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('System.<something> as parameter on method signature', async () => {
      const input = Input.InClass(
        `public static void runAssignmentRules(System.LoggingLevel lUsers){}`
      );
      const tokens = await tokenize(input);

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

    it('Database usage in method', async () => {
      const input = Input.InMethod(`Savepoint sp = Database.setSavepoint();`);
      const tokens = await tokenize(input);

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

    it('Database usage in trigger', async () => {
      const input = Input.InTrigger(
        `List<Database.SaveResult> saveResults = Database.insert(lnewPermSets, false);`
      );
      const tokens = await tokenize(input);

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

    it('insert method usage in trigger', async () => {
      const input = Input.InTrigger(`insert lResults;`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.FunctionText('insert'),
        Token.Identifiers.LocalName('lResults'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('Test namespace simple methods', async () => {
      const input = Input.InMethod(`Test.startTest();`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.Text('Test'),
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('startTest'),
        Token.Punctuation.OpenParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon
      ]);
    });

    it('Test namespace complex methods', async () => {
      const input = Input.InMethod(
        `Test.setCreatedDate(a.Id, DateTime.newInstance(2012,12,12));`
      );
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.Text('Test'),
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('setCreatedDate'),
        Token.Punctuation.OpenParen,
        Token.Variables.Object('a'),
        Token.Punctuation.Accessor,
        Token.Variables.Property('Id'),
        Token.Punctuation.Comma,
        Token.Variables.Object('DateTime'),
        Token.Punctuation.Accessor,
        Token.Identifiers.MethodName('newInstance'),
        Token.Punctuation.OpenParen,
        Token.Literals.Numeric.Decimal('2012'),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Decimal('12'),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Decimal('12'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon
      ]);
    });

    it('DMLException usage in try catch', async () => {
      const input = Input.InMethod(`try{} catch (DMLException e) {}`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Control.Try,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
        Token.Keywords.Control.Catch,
        Token.Punctuation.OpenParen,
        Token.Support.Class.Text('DMLException'),
        Token.Identifiers.LocalName('e'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('Database usage for Apex Batch', async () => {
      const input = Input.InClass(
        `global Database.QueryLocator start(Database.BatchableContext BC){}`
      );
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Global,
        Token.Support.Class.Database,
        Token.Punctuation.Accessor,
        Token.Support.Class.TypeText('QueryLocator'),
        Token.Support.Class.FunctionText('start'),
        Token.Punctuation.OpenParen,
        Token.Support.Class.Database,
        Token.Punctuation.Accessor,
        Token.Support.Class.TypeText('BatchableContext'),
        Token.Identifiers.ParameterName('BC'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('create new support object', async () => {
      const input = Input.InMethod(
        `ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.CONFIRM, message));`
      );
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.Text('ApexPages'),
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('addMessage'),
        Token.Punctuation.OpenParen,
        Token.Keywords.Control.New,
        Token.Support.Class.Text('ApexPages'),
        Token.Punctuation.Accessor,
        Token.Support.Class.TypeText('Message'),
        Token.Punctuation.OpenParen,
        Token.Support.Class.Text('ApexPages'),
        Token.Punctuation.Accessor,
        Token.Support.Class.TypeText('Severity'),
        Token.Punctuation.Accessor,
        Token.Support.Class.TypeText('CONFIRM'),
        Token.Punctuation.Comma,

        Token.Variables.ReadWrite('message'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon
      ]);
    });

    it('Usage for casting in a method', async () => {
      const input = Input.InMethod(`SObject sp = (SObject)Something;`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.Text('SObject'),
        Token.Identifiers.LocalName('sp'),
        Token.Operators.Assignment,
        Token.Punctuation.OpenParen,
        Token.Support.Class.Text('SObject'),
        Token.Punctuation.CloseParen,
        Token.Variables.ReadWrite('Something'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('insert a new object with parameters', async () => {
      const input = Input.InMethod(
        `insert new MyObject__c(Name='Test', Meaning__c='Bad');`
      );
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.FunctionText('insert'),
        Token.Keywords.Control.New,
        Token.Type('MyObject__c'),
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite('Name'),
        Token.Operators.Assignment,
        Token.Punctuation.String.Begin,
        Token.Literals.String('Test'),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Variables.ReadWrite('Meaning__c'),
        Token.Operators.Assignment,
        Token.Punctuation.String.Begin,
        Token.Literals.String('Bad'),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon
      ]);
    });

    it('delete a new object with no parameters', async () => {
      const input = Input.InMethod(`delete new MyObjectWrapper());`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.FunctionText('delete'),
        Token.Keywords.Control.New,
        Token.Type('MyObjectWrapper'),
        Token.Punctuation.OpenParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon
      ]);
    });

    it('upsert a new list of objects', async () => {
      const input = Input.InMethod(`upsert new List<User>{User1, User2};`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.FunctionText('upsert'),
        Token.Keywords.Control.New,
        Token.Type('List'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Type('User'),
        Token.Punctuation.TypeParameters.End,
        Token.Punctuation.OpenBrace,
        Token.Variables.ReadWrite('User1'),
        Token.Punctuation.Comma,
        Token.Variables.ReadWrite('User2'),
        Token.Punctuation.CloseBrace,
        Token.Punctuation.Semicolon
      ]);
    });

    it('merge method usage in method', async () => {
      const input = Input.InMethod(`merge masterAcct mergeAcct;`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.FunctionText('merge'),
        Token.Variables.ReadWrite('masterAcct'),
        Token.Variables.ReadWrite('mergeAcct'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('merge using new object statement', async () => {
      const input = Input.InMethod(
        `merge masterAcct new Account(name='Master');`
      );
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.FunctionText('merge'),
        Token.Variables.ReadWrite('masterAcct'),
        Token.Keywords.Control.New,
        Token.Type('Account'),
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite('name'),
        Token.Operators.Assignment,
        Token.Punctuation.String.Begin,
        Token.Literals.String('Master'),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon
      ]);
    });

    it('merge using only new statements', async () => {
      const input = Input.InMethod(
        `merge new Account(name='Master') new List<Account>{acc1, acc2};`
      );
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Support.Class.FunctionText('merge'),
        Token.Keywords.Control.New,
        Token.Type('Account'),
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite('name'),
        Token.Operators.Assignment,
        Token.Punctuation.String.Begin,
        Token.Literals.String('Master'),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen,
        Token.Keywords.Control.New,
        Token.Type('List'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Type('Account'),
        Token.Punctuation.TypeParameters.End,
        Token.Punctuation.OpenBrace,
        Token.Variables.ReadWrite('acc1'),
        Token.Punctuation.Comma,
        Token.Variables.ReadWrite('acc2'),
        Token.Punctuation.CloseBrace,
        Token.Punctuation.Semicolon
      ]);
    });

    it('Apex support classes are not incorrectly tokenized', async () => {
      const input = Input.InClass(`public SObjectDomain(List<SObject> sObjectList) {
        records = SystemList;
      }`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Identifiers.MethodName('SObjectDomain'),
        Token.Punctuation.OpenParen,
        Token.Type('List'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Support.Class.Text('SObject'),
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.ParameterName('sObjectList'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Variables.ReadWrite('records'),
        Token.Operators.Assignment,
        Token.Variables.ReadWrite('SystemList'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });
  });
});
