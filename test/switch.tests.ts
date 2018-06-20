import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe('Grammar', () => {
  before(() => {
    should();
  });

  describe('Switch Statements', () => {
    it('simple switch', () => {
      const input = Input.InMethod(`
switch on (param) {
when 'A' {
  System.debug('test');
}
when else {
  callExternalMethod();
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
        Token.Keywords.Switch.When,
        Token.Keywords.Switch.Else,
        Token.Punctuation.OpenBrace,
        Token.Identifiers.MethodName('callExternalMethod'),
        Token.Punctuation.OpenParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('simple - single value', () => {
      const input = Input.InMethod(`
        switch on i {
           when 2 {
               System.debug('when block 2');
           }
           when -3 {
               System.debug('when block -3');
           }
           when else {
             // some comment.
           }
        }`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Switch.Switch,
        Token.Keywords.Switch.On,
        Token.Variables.ReadWrite('i'),
        Token.Punctuation.OpenBrace,
        Token.Keywords.Switch.When,
        Token.Literals.Numeric.Decimal('2'),
        Token.Punctuation.OpenBrace,
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('debug'),
        Token.Punctuation.OpenParen,
        Token.XmlDocComments.String.SingleQuoted.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('when block 2'),
        Token.XmlDocComments.String.SingleQuoted.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
        Token.Keywords.Switch.When,
        Token.Operators.Arithmetic.Subtraction,
        Token.Literals.Numeric.Decimal('3'),
        Token.Punctuation.OpenBrace,
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('debug'),
        Token.Punctuation.OpenParen,
        Token.XmlDocComments.String.SingleQuoted.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('when block -3'),
        Token.XmlDocComments.String.SingleQuoted.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
        Token.Keywords.Switch.When,
        Token.Keywords.Switch.Else,
        Token.Punctuation.OpenBrace,
        Token.Comment.LeadingWhitespace('             '),
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text(' some comment.'),
        Token.Punctuation.CloseBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('simple - null value', () => {
      const input = Input.InMethod(`
        switch on someValue {
   when 2 {
       System.debug('when block 2');
   }
   when null {
       System.debug('bad integer');
   }
   when else {
       System.debug('default ' + someValue);
   }
}`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Switch.Switch,
        Token.Keywords.Switch.On,
        Token.Variables.ReadWrite('someValue'),
        Token.Punctuation.OpenBrace,
        Token.Keywords.Switch.When,
        Token.Literals.Numeric.Decimal('2'),
        Token.Punctuation.OpenBrace,
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('debug'),
        Token.Punctuation.OpenParen,
        Token.XmlDocComments.String.SingleQuoted.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('when block 2'),
        Token.XmlDocComments.String.SingleQuoted.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
        Token.Keywords.Switch.When,
        Token.Literals.Null,
        Token.Punctuation.OpenBrace,
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('debug'),
        Token.Punctuation.OpenParen,
        Token.XmlDocComments.String.SingleQuoted.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('bad integer'),
        Token.XmlDocComments.String.SingleQuoted.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
        Token.Keywords.Switch.When,
        Token.Keywords.Switch.Else,
        Token.Punctuation.OpenBrace,
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('debug'),
        Token.Punctuation.OpenParen,
        Token.XmlDocComments.String.SingleQuoted.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('default '),
        Token.XmlDocComments.String.SingleQuoted.End,
        Token.Operators.Arithmetic.Addition,
        Token.Variables.ReadWrite('someValue'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('simple - multiple value', () => {
      const input = Input.InMethod(`
        switch on i {
   when 2, 3, 4 {
       System.debug('when block 2 and 3 and 4');
   }
   when 5 {
       System.debug('when block 5');
   }
   when else {
       System.debug('default');
   }
}`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Switch.Switch,
        Token.Keywords.Switch.On,
        Token.Variables.ReadWrite('i'),
        Token.Punctuation.OpenBrace,
        Token.Keywords.Switch.When,
        Token.Literals.Numeric.Decimal('2'),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Decimal('3'),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Decimal('4'),
        Token.Punctuation.OpenBrace,
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('debug'),
        Token.Punctuation.OpenParen,
        Token.XmlDocComments.String.SingleQuoted.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('when block 2 and 3 and 4'),
        Token.XmlDocComments.String.SingleQuoted.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
        Token.Keywords.Switch.When,
        Token.Literals.Numeric.Decimal('5'),
        Token.Punctuation.OpenBrace,
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('debug'),
        Token.Punctuation.OpenParen,
        Token.XmlDocComments.String.SingleQuoted.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('when block 5'),
        Token.XmlDocComments.String.SingleQuoted.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
        Token.Keywords.Switch.When,
        Token.Keywords.Switch.Else,
        Token.Punctuation.OpenBrace,
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('debug'),
        Token.Punctuation.OpenParen,
        Token.XmlDocComments.String.SingleQuoted.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('default'),
        Token.XmlDocComments.String.SingleQuoted.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('simple - method example', () => {
      const input = Input.InMethod(`
        switch on someInteger(i) {
   when 2,3,4 {
       System.debug('when block 2 and 3 and 4');
   }
   when 7 {
       System.debug('when block 7');
   }
   when else {
       // @TODO.
   }
}`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Switch.Switch,
        Token.Keywords.Switch.On,
        Token.Identifiers.MethodName('someInteger'),
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite('i'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Switch.When,
        Token.Literals.Numeric.Decimal('2'),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Decimal('3'),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Decimal('4'),
        Token.Punctuation.OpenBrace,
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('debug'),
        Token.Punctuation.OpenParen,
        Token.XmlDocComments.String.SingleQuoted.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('when block 2 and 3 and 4'),
        Token.XmlDocComments.String.SingleQuoted.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
        Token.Keywords.Switch.When,
        Token.Literals.Numeric.Decimal('7'),
        Token.Punctuation.OpenBrace,
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('debug'),
        Token.Punctuation.OpenParen,
        Token.XmlDocComments.String.SingleQuoted.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('when block 7'),
        Token.XmlDocComments.String.SingleQuoted.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
        Token.Keywords.Switch.When,
        Token.Keywords.Switch.Else,
        Token.Punctuation.OpenBrace,
        Token.Comment.LeadingWhitespace('       '),
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text(' @TODO.'),
        Token.Punctuation.CloseBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('simple - sobject usage', () => {
      const input = Input.InMethod(`
        switch on sobject {
   when Account a {
       System.debug('account ' + a);
   }
   when null {
       System.debug('null');
   }
   when else {
       System.debug('default');
   }
}`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Switch.Switch,
        Token.Keywords.Switch.On,
        Token.Variables.ReadWrite('sobject'),
        Token.Punctuation.OpenBrace,
        Token.Keywords.Switch.When,
        Token.Type('Account'),
        Token.Identifiers.LocalName('a'),
        Token.Punctuation.OpenBrace,
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('debug'),
        Token.Punctuation.OpenParen,
        Token.XmlDocComments.String.SingleQuoted.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('account '),
        Token.XmlDocComments.String.SingleQuoted.End,
        Token.Operators.Arithmetic.Addition,
        Token.Variables.ReadWrite('a'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
        Token.Keywords.Switch.When,
        Token.Literals.Null,
        Token.Punctuation.OpenBrace,
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('debug'),
        Token.Punctuation.OpenParen,
        Token.XmlDocComments.String.SingleQuoted.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('null'),
        Token.XmlDocComments.String.SingleQuoted.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
        Token.Keywords.Switch.When,
        Token.Keywords.Switch.Else,
        Token.Punctuation.OpenBrace,
        Token.Support.Class.System,
        Token.Punctuation.Accessor,
        Token.Support.Class.FunctionText('debug'),
        Token.Punctuation.OpenParen,
        Token.XmlDocComments.String.SingleQuoted.Begin,
        Token.XmlDocComments.String.SingleQuoted.Text('default'),
        Token.XmlDocComments.String.SingleQuoted.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
        Token.Punctuation.CloseBrace
      ]);
    });
  });
});
