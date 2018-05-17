import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe('Grammar', () => {
  before(() => should());

  describe('Apex Trigger', () => {
    it('before insert before update Account trigger', () => {
      const input = Input.FromText(`trigger myAccountTrigger on Account (before insert, before update) {}`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Trigger,
        Token.Identifiers.TriggerName('myAccountTrigger'),
        Token.Keywords.Triggers.On,
        Token.Type('Account'),
        Token.Punctuation.OpenParen,
        Token.Keywords.Triggers.Before,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace
      ]);
    });
  });
});
