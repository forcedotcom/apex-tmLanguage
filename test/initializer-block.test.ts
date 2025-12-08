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

  describe('Initializer Blocks', () => {
    it('empty initialization block', async () => {
      const input = Input.InClass(`{ }`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
      ]);
    });

    it('initialization block with method call and string literal', async () => {
      const input = Input.InClass(`
{
    this.setMessage('Object graph should be a Directed Acyclic Graph.');
}`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Punctuation.OpenBrace,
        Token.Keywords.This,
        Token.Punctuation.Accessor,
        Token.Identifiers.MethodName('setMessage'),
        Token.Punctuation.OpenParen,
        Token.Punctuation.String.Begin,
        Token.Literals.String(
          'Object graph should be a Directed Acyclic Graph.'
        ),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
      ]);
    });

    it('initialization block with multiple statements', async () => {
      const input = Input.InClass(`
{
    Integer x = 5;
    String message = 'test';
    this.setMessage(message);
}`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Punctuation.OpenBrace,
        Token.PrimitiveType.Integer,
        Token.Identifiers.LocalName('x'),
        Token.Operators.Assignment,
        Token.Literals.Numeric.Decimal('5'),
        Token.Punctuation.Semicolon,
        Token.PrimitiveType.String,
        Token.Identifiers.LocalName('message'),
        Token.Operators.Assignment,
        Token.Punctuation.String.Begin,
        Token.Literals.String('test'),
        Token.Punctuation.String.End,
        Token.Punctuation.Semicolon,
        Token.Keywords.This,
        Token.Punctuation.Accessor,
        Token.Identifiers.MethodName('setMessage'),
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite('message'),
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
      ]);
    });

    it('initialization block in nested class (issue #4920)', async () => {
      const input = Input.FromText(`
public class TestDataBuilder {
    public class NoneDAGException extends Exception {
        // Initializer
        {
            this.setMessage('Object graph should be a Directed Acyclic Graph.');
        }

        // Sample method for comparison
        public void anotherMethod() {
            this.setMessage('Object graph should be a Directed Acyclic Graph.');
        }
    }
}`);
      const tokens = await tokenize(input);

      // Find the initialization block tokens (should start after the comment)
      const initBlockStart = tokens.findIndex(
        (t, i) =>
          i > 0 &&
          tokens[i - 1].text === '//' &&
          tokens[i].text === 'Initializer'
      );
      const initBlockEnd = tokens.findIndex(
        (t, i) =>
          i > initBlockStart && t.text === '}' && tokens[i - 1]?.text === ';'
      );

      // Extract tokens for the initialization block
      const initBlockTokens = tokens.slice(
        initBlockStart + 3, // Skip comment tokens
        initBlockEnd + 1
      );

      // Verify initialization block has proper string highlighting
      initBlockTokens.should.include.deep.members([
        Token.Punctuation.OpenBrace,
        Token.Keywords.This,
        Token.Punctuation.Accessor,
        Token.Identifiers.MethodName('setMessage'),
        Token.Punctuation.OpenParen,
        Token.Punctuation.String.Begin,
        Token.Literals.String(
          'Object graph should be a Directed Acyclic Graph.'
        ),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
      ]);
    });

    it('initialization block syntax highlighting matches method body', async () => {
      const input = Input.InClass(`
{
    this.setMessage('test');
}

public void testMethod() {
    this.setMessage('test');
}`);
      const tokens = await tokenize(input);

      // Find initialization block tokens
      const initStart = tokens.findIndex((t) => t.text === '{');
      const initEnd = tokens.findIndex(
        (t, i) => i > initStart && t.text === '}' && tokens[i - 1]?.text === ';'
      );
      const initTokens = tokens.slice(initStart, initEnd + 1);

      // Find method body tokens
      const methodStart = tokens.findIndex(
        (t, i) => i > initEnd && tokens[i - 1]?.text === ')' && t.text === '{'
      );
      const methodEnd = tokens.findIndex(
        (t, i) =>
          i > methodStart && t.text === '}' && tokens[i - 1]?.text === ';'
      );
      const methodTokens = tokens.slice(methodStart, methodEnd + 1);

      // Both should have the same highlighting for the string literal
      const initStringTokens = initTokens.filter(
        (t) => t.type === 'string.quoted.single.apex'
      );
      const methodStringTokens = methodTokens.filter(
        (t) => t.type === 'string.quoted.single.apex'
      );

      initStringTokens.length.should.be.greaterThan(0);
      methodStringTokens.length.should.be.greaterThan(0);
      initStringTokens[0].type.should.equal(methodStringTokens[0].type);
    });

    it('static keyword before block is handled (even though static blocks are not valid Apex)', async () => {
      // Note: Apex does NOT support static initialization blocks like Java
      // This test verifies the grammar handles the syntax correctly for highlighting
      // even though it's not valid Apex code
      const input = Input.InClass(`
static {
    Integer x = 5;
}`);
      const tokens = await tokenize(input);

      // The static keyword should be matched, then the block should be matched
      tokens.should.include.deep.members([
        Token.Keywords.Modifiers.Static,
        Token.Punctuation.OpenBrace,
        Token.PrimitiveType.Integer,
        Token.Identifiers.LocalName('x'),
        Token.Operators.Assignment,
        Token.Literals.Numeric.Decimal('5'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
      ]);
    });
  });
});
