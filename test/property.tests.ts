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

  describe('Property', () => {
    it('declaration', async () => {
      const input = Input.InClass(`
public IBooom Property
{
    get { return null; }
    set { something = value; }
}`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Type('IBooom'),
        Token.Identifiers.PropertyName('Property'),
        Token.Punctuation.OpenBrace,
        Token.Keywords.Get,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Return,
        Token.Literals.Null,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
        Token.Keywords.Set,
        Token.Punctuation.OpenBrace,
        Token.Variables.ReadWrite('something'),
        Token.Operators.Assignment,
        Token.Variables.ReadWrite('value'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('declaration single line', async () => {
      const input = Input.InClass(
        `public IBooom Property { get { return null; } private set { something = value; } }`
      );
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Type('IBooom'),
        Token.Identifiers.PropertyName('Property'),
        Token.Punctuation.OpenBrace,
        Token.Keywords.Get,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Return,
        Token.Literals.Null,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
        Token.Keywords.Modifiers.Private,
        Token.Keywords.Set,
        Token.Punctuation.OpenBrace,
        Token.Variables.ReadWrite('something'),
        Token.Operators.Assignment,
        Token.Variables.ReadWrite('value'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('declaration without modifiers', async () => {
      const input = Input.InClass(`IBooom Property {get; set;}`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Type('IBooom'),
        Token.Identifiers.PropertyName('Property'),
        Token.Punctuation.OpenBrace,
        Token.Keywords.Get,
        Token.Punctuation.Semicolon,
        Token.Keywords.Set,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('auto-property single line', async () => {
      const input = Input.InClass(`public IBooom Property { get; set; }`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Type('IBooom'),
        Token.Identifiers.PropertyName('Property'),
        Token.Punctuation.OpenBrace,
        Token.Keywords.Get,
        Token.Punctuation.Semicolon,
        Token.Keywords.Set,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('auto-property', async () => {
      const input = Input.InClass(`
public IBooom Property
{
    get;
    set;
}`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Type('IBooom'),
        Token.Identifiers.PropertyName('Property'),
        Token.Punctuation.OpenBrace,
        Token.Keywords.Get,
        Token.Punctuation.Semicolon,
        Token.Keywords.Set,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('generic auto-property', async () => {
      const input = Input.InClass(
        `public Dictionary<String, List<T>[]> Property { get; set; }`
      );
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Type('Dictionary'),
        Token.Punctuation.TypeParameters.Begin,
        Token.PrimitiveType.String,
        Token.Punctuation.Comma,
        Token.Type('List'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Type('T'),
        Token.Punctuation.TypeParameters.End,
        Token.Punctuation.OpenBracket,
        Token.Punctuation.CloseBracket,
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.PropertyName('Property'),
        Token.Punctuation.OpenBrace,
        Token.Keywords.Get,
        Token.Punctuation.Semicolon,
        Token.Keywords.Set,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('auto-property initializer', async () => {
      const input = Input.InClass(
        `public Dictionary<String, List<T>[]> Property { get; } = new Dictionary<String, List<T>[]>();`
      );
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.Type('Dictionary'),
        Token.Punctuation.TypeParameters.Begin,
        Token.PrimitiveType.String,
        Token.Punctuation.Comma,
        Token.Type('List'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Type('T'),
        Token.Punctuation.TypeParameters.End,
        Token.Punctuation.OpenBracket,
        Token.Punctuation.CloseBracket,
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.PropertyName('Property'),
        Token.Punctuation.OpenBrace,
        Token.Keywords.Get,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
        Token.Operators.Assignment,
        Token.Keywords.Control.New,
        Token.Type('Dictionary'),
        Token.Punctuation.TypeParameters.Begin,
        Token.PrimitiveType.String,
        Token.Punctuation.Comma,
        Token.Type('List'),
        Token.Punctuation.TypeParameters.Begin,
        Token.Type('T'),
        Token.Punctuation.TypeParameters.End,
        Token.Punctuation.OpenBracket,
        Token.Punctuation.CloseBracket,
        Token.Punctuation.TypeParameters.End,
        Token.Punctuation.OpenParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon
      ]);
    });

    it('expression body', async () => {
      const input = Input.InClass(`
private String prop1 = 'hello';
private Boolean   prop2 = true;`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Private,
        Token.PrimitiveType.String,
        Token.Identifiers.FieldName('prop1'),
        Token.Operators.Assignment,
        Token.Punctuation.String.Begin,
        Token.Literals.String('hello'),
        Token.Punctuation.String.End,
        Token.Punctuation.Semicolon,

        Token.Keywords.Modifiers.Private,
        Token.PrimitiveType.Boolean,
        Token.Identifiers.FieldName('prop2'),
        Token.Operators.Assignment,
        Token.Literals.Boolean.True,
        Token.Punctuation.Semicolon
      ]);
    });

    it('explicitly-implemented interface member', async () => {
      const input = Input.InClass(`String IFoo<String>.Bar { get; set; }`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.PrimitiveType.String,
        Token.Type('IFoo'),
        Token.Punctuation.TypeParameters.Begin,
        Token.PrimitiveType.String,
        Token.Punctuation.TypeParameters.End,
        Token.Punctuation.Accessor,
        Token.Identifiers.PropertyName('Bar'),
        Token.Punctuation.OpenBrace,
        Token.Keywords.Get,
        Token.Punctuation.Semicolon,
        Token.Keywords.Set,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('declaration in interface', async () => {
      const input = Input.InInterface(`String Bar { get; set; }`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.PrimitiveType.String,
        Token.Identifiers.PropertyName('Bar'),
        Token.Punctuation.OpenBrace,
        Token.Keywords.Get,
        Token.Punctuation.Semicolon,
        Token.Keywords.Set,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('declaration in interface (read-only)', async () => {
      const input = Input.InInterface(`String Bar { get; }`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.PrimitiveType.String,
        Token.Identifiers.PropertyName('Bar'),
        Token.Punctuation.OpenBrace,
        Token.Keywords.Get,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('declaration in interface (write-only)', async () => {
      const input = Input.InInterface(`String Bar { set; }`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.PrimitiveType.String,
        Token.Identifiers.PropertyName('Bar'),
        Token.Punctuation.OpenBrace,
        Token.Keywords.Set,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });

    it('declaration with attributes', async () => {
      const input = Input.InClass(`
public Integer P1
{
    get { return 0; }
    set { }
}`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keywords.Modifiers.Public,
        Token.PrimitiveType.Integer,
        Token.Identifiers.PropertyName('P1'),
        Token.Punctuation.OpenBrace,
        Token.Keywords.Get,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Return,
        Token.Literals.Numeric.Decimal('0'),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
        Token.Keywords.Set,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
        Token.Punctuation.CloseBrace
      ]);
    });
    /*
        it("Static initializer", () => {
            const input = Input.InClass(`
              public static final Double DISCOUNT;
static {
    DISCOUNT = 50.0;
}`);
            const tokens = await tokenize(input);;

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.Keywords.Modifiers.Final,
                Token.PrimitiveType.Double,
                Token.Identifiers.FieldName("DISCOUNT"),
                Token.Punctuation.Semicolon,
                Token.Keywords.Modifiers.Static,
                Token.Punctuation.OpenBrace,
                Token.Identifiers.PropertyName("DISCOUNT"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("50.0"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        }); */
  });
});
