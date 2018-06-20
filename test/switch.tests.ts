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
  });
});
