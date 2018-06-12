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

  describe('Field', () => {
    it('declaration', () => {
      const input = Input.InClass(`
private List _field;
private List field;
private List field123;`);

      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Private,
        Token.Type('List'),
        Token.Identifiers.FieldName('_field'),
        Token.Punctuation.Semicolon,

        Token.Keywords.Modifiers.Private,
        Token.Type('List'),
        Token.Identifiers.FieldName('field'),
        Token.Punctuation.Semicolon,

        Token.Keywords.Modifiers.Private,
        Token.Type('List'),
        Token.Identifiers.FieldName('field123'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('generic', () => {
      const input = Input.InClass(
        `private Dictionary< List<T>, Dictionary<T, D>> _field;`
      );
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Private,
        Token.Type('Dictionary'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Type('List'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Type('T'),
        Token.Punctuation.TypeParameters.End,
        Token.Punctuation.Comma,
        Token.Type('Dictionary'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Type('T'),
        Token.Punctuation.Comma,
        Token.Type('D'),
        Token.Punctuation.TypeParameters.End,
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.FieldName('_field'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('types', () => {
      const input = Input.InClass(`
String field123;
String[] field123;`);

      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.PrimitiveType.String,
        Token.Identifiers.FieldName('field123'),
        Token.Punctuation.Semicolon,

        Token.PrimitiveType.String,
        Token.Punctuation.OpenBracket,
        Token.Punctuation.CloseBracket,
        Token.Identifiers.FieldName('field123'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('assignment', () => {
      const input = Input.InClass(`
private String field = 'hello';
   Boolean   field = true;`);

      let tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Private,
        Token.PrimitiveType.String,
        Token.Identifiers.FieldName('field'),
        Token.Operators.Assignment,
        Token.Punctuation.String.Begin,
        Token.Literals.String('hello'),
        Token.Punctuation.String.End,
        Token.Punctuation.Semicolon,

        Token.PrimitiveType.Boolean,
        Token.Identifiers.FieldName('field'),
        Token.Operators.Assignment,
        Token.Literals.Boolean.True,
        Token.Punctuation.Semicolon
      ]);
    });

    it('declaration with multiple declarators', () => {
      const input = Input.InClass(`Integer x = 19, y = 23, z = 42;`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.PrimitiveType.Integer,
        Token.Identifiers.FieldName('x'),
        Token.Operators.Assignment,
        Token.Literals.Numeric.Decimal('19'),
        Token.Punctuation.Comma,
        Token.Identifiers.FieldName('y'),
        Token.Operators.Assignment,
        Token.Literals.Numeric.Decimal('23'),
        Token.Punctuation.Comma,
        Token.Identifiers.FieldName('z'),
        Token.Operators.Assignment,
        Token.Literals.Numeric.Decimal('42'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('type with no names and no modifiers', () => {
      const input = Input.InClass(`public static Integer x;`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.Integer,
        Token.Identifiers.FieldName('x'),
        Token.Punctuation.Semicolon
      ]);
    });

    it('Fields with fully-qualified names are highlighted properly (issue omnisharp-vscode#1097)', () => {
      const input = Input.InClass(`
private CanvasGroup[] groups;
private UnityEngine.UI.Image[] selectedImages;
`);
      const tokens = tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Private,
        Token.Type('CanvasGroup'),
        Token.Punctuation.OpenBracket,
        Token.Punctuation.CloseBracket,
        Token.Identifiers.FieldName('groups'),
        Token.Punctuation.Semicolon,
        Token.Keywords.Modifiers.Private,
        Token.Type('UnityEngine'),
        Token.Punctuation.Accessor,
        Token.Type('UI'),
        Token.Punctuation.Accessor,
        Token.Type('Image'),
        Token.Punctuation.OpenBracket,
        Token.Punctuation.CloseBracket,
        Token.Identifiers.FieldName('selectedImages'),
        Token.Punctuation.Semicolon
      ]);
    });
  });
});
