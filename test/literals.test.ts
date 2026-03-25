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

  describe('Literals', () => {
    describe('Booleans', () => {
      it('true', async () => {
        const input = Input.InClass(`Boolean x = true;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Boolean,
          Token.Identifiers.FieldName('x'),
          Token.Operators.Assignment,
          Token.Literals.Boolean.True,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('false', async () => {
        const input = Input.InClass(`Boolean x = false;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Boolean,
          Token.Identifiers.FieldName('x'),
          Token.Operators.Assignment,
          Token.Literals.Boolean.False,
          Token.Punctuation.Semicolon,
        ]);
      });
    });

    describe('Chars', () => {
      it('empty', async () => {
        const input = Input.InMethod(`String x = '';`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.String,
          Token.Identifiers.LocalName('x'),
          Token.Operators.Assignment,
          Token.Punctuation.String.Begin,
          Token.Punctuation.String.End,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('letter', async () => {
        const input = Input.InMethod(`String x = 'a';`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.String,
          Token.Identifiers.LocalName('x'),
          Token.Operators.Assignment,
          Token.Punctuation.String.Begin,
          Token.Literals.String('a'),
          Token.Punctuation.String.End,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('escaped single quote', async () => {
        const input = Input.InMethod(`String x = '\\'';`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.String,
          Token.Identifiers.LocalName('x'),
          Token.Operators.Assignment,
          Token.Punctuation.String.Begin,
          Token.Literals.CharacterEscape("\\'"),
          Token.Punctuation.String.End,
          Token.Punctuation.Semicolon,
        ]);
      });
    });

    describe('Numbers', () => {
      it('decimal zero', async () => {
        const input = Input.InClass(`Integer x = 0;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Integer,
          Token.Identifiers.FieldName('x'),
          Token.Operators.Assignment,
          Token.Literals.Numeric.Decimal('0'),
          Token.Punctuation.Semicolon,
        ]);
      });

      it('hexadecimal zero', async () => {
        const input = Input.InClass(`Integer x = 0x0;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Integer,
          Token.Identifiers.FieldName('x'),
          Token.Operators.Assignment,
          Token.Literals.Numeric.Hexadecimal('0x0'),
          Token.Punctuation.Semicolon,
        ]);
      });

      it('binary zero', async () => {
        const input = Input.InClass(`Integer x = 0b0;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Integer,
          Token.Identifiers.FieldName('x'),
          Token.Operators.Assignment,
          Token.Literals.Numeric.Binary('0b0'),
          Token.Punctuation.Semicolon,
        ]);
      });

      it('Double zero', async () => {
        const input = Input.InClass(`Double x = 0.0;`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.Double,
          Token.Identifiers.FieldName('x'),
          Token.Operators.Assignment,
          Token.Literals.Numeric.Decimal('0.0'),
          Token.Punctuation.Semicolon,
        ]);
      });
    });

    describe('Strings', () => {
      it('simple', async () => {
        const input = Input.InClass(`String test = 'hello world!';`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.String,
          Token.Identifiers.FieldName('test'),
          Token.Operators.Assignment,
          Token.Punctuation.String.Begin,
          Token.Literals.String('hello world!'),
          Token.Punctuation.String.End,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('escaped double-quote', async () => {
        const input = Input.InClass(`String test = 'hello \\"world!\\"';`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.String,
          Token.Identifiers.FieldName('test'),
          Token.Operators.Assignment,
          Token.Punctuation.String.Begin,
          Token.Literals.String('hello '),
          Token.Literals.CharacterEscape('\\"'),
          Token.Literals.String('world!'),
          Token.Literals.CharacterEscape('\\"'),
          Token.Punctuation.String.End,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('string with template expression', async () => {
        const input = Input.InClass(`String s = 'hello \${name}!';`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.String,
          Token.Identifiers.FieldName('s'),
          Token.Operators.Assignment,
          Token.Punctuation.String.Begin,
          Token.Literals.String('hello '),
          Token.TemplateExpression.Begin,
          Token.Variables.ReadWrite('name'),
          Token.TemplateExpression.End,
          Token.Literals.String('!'),
          Token.Punctuation.String.End,
          Token.Punctuation.Semicolon,
        ]);
      });
    });

    describe('Multiline Strings', () => {
      it('simple multiline string', async () => {
        const input = Input.InClass(`String s = '''\nhello world\n''';`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.String,
          Token.Identifiers.FieldName('s'),
          Token.Operators.Assignment,
          Token.Punctuation.MultilineString.Begin,
          Token.Literals.MultilineString('hello world'),
          Token.Punctuation.MultilineString.End,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('multiline string with template expression', async () => {
        const input = Input.InClass(
          `String s = '''\nhello \${name}\n''';`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.String,
          Token.Identifiers.FieldName('s'),
          Token.Operators.Assignment,
          Token.Punctuation.MultilineString.Begin,
          Token.Literals.MultilineString('hello '),
          Token.TemplateExpression.Begin,
          Token.Variables.ReadWrite('name'),
          Token.TemplateExpression.End,
          Token.Punctuation.MultilineString.End,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('multiline string with multiple template expressions', async () => {
        const input = Input.InClass(
          `String s = '''\nI am a multi \${var1}\nline \${var2}\nstring \${var3}\n''';`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.String,
          Token.Identifiers.FieldName('s'),
          Token.Operators.Assignment,
          Token.Punctuation.MultilineString.Begin,
          Token.Literals.MultilineString('I am a multi '),
          Token.TemplateExpression.Begin,
          Token.Variables.ReadWrite('var1'),
          Token.TemplateExpression.End,
          Token.Literals.MultilineString('line '),
          Token.TemplateExpression.Begin,
          Token.Variables.ReadWrite('var2'),
          Token.TemplateExpression.End,
          Token.Literals.MultilineString('string '),
          Token.TemplateExpression.Begin,
          Token.Variables.ReadWrite('var3'),
          Token.TemplateExpression.End,
          Token.Punctuation.MultilineString.End,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('multiline string with escaped character', async () => {
        const input = Input.InClass(`String s = '''\nhello \\'world\\'\n''';`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.PrimitiveType.String,
          Token.Identifiers.FieldName('s'),
          Token.Operators.Assignment,
          Token.Punctuation.MultilineString.Begin,
          Token.Literals.MultilineString('hello '),
          Token.Literals.CharacterEscape("\\'"),
          Token.Literals.MultilineString('world'),
          Token.Literals.CharacterEscape("\\'"),
          Token.Punctuation.MultilineString.End,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('multiline string as method argument', async () => {
        const input = Input.InMethod(
          `System.debug('''multi\nline''');`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Support.Class.System,
          Token.Punctuation.Accessor,
          Token.Support.Class.FunctionText('debug'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.MultilineString.Begin,
          Token.Literals.MultilineString('multi'),
          Token.Literals.MultilineString('line'),
          Token.Punctuation.MultilineString.End,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('multiline string in return statement', async () => {
        const input = Input.InMethod(`return '''hello''';`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.Return,
          Token.Punctuation.MultilineString.Begin,
          Token.Literals.MultilineString('hello'),
          Token.Punctuation.MultilineString.End,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('multiline string in SOQL WHERE clause', async () => {
        const input = Input.InMethod(
          `List<Account> a = [SELECT Id FROM Account WHERE Name = '''value'''];`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type('List'),
          Token.Punctuation.TypeParameters.Begin,
          Token.Type('Account'),
          Token.Punctuation.TypeParameters.End,
          Token.Identifiers.LocalName('a'),
          Token.Operators.Assignment,
          Token.Punctuation.OpenBracket,
          Token.Keywords.Queries.Select,
          Token.Keywords.Queries.FieldName('Id'),
          Token.Keywords.Queries.From,
          Token.Keywords.Queries.TypeName('Account'),
          Token.Keywords.Queries.Where,
          Token.Keywords.Queries.FieldName('Name'),
          Token.Operators.Assignment,
          Token.Punctuation.MultilineString.Begin,
          Token.Literals.MultilineString('value'),
          Token.Punctuation.MultilineString.End,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('multiline string in Map literal', async () => {
        const input = Input.InMethod(
          `Map<String,String> m = new Map<String,String>{'''key''' => '''value'''};`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type('Map'),
          Token.Punctuation.TypeParameters.Begin,
          Token.PrimitiveType.String,
          Token.Punctuation.Comma,
          Token.PrimitiveType.String,
          Token.Punctuation.TypeParameters.End,
          Token.Identifiers.LocalName('m'),
          Token.Operators.Assignment,
          Token.Keywords.Control.New,
          Token.Type('Map'),
          Token.Punctuation.TypeParameters.Begin,
          Token.PrimitiveType.String,
          Token.Punctuation.Comma,
          Token.PrimitiveType.String,
          Token.Punctuation.TypeParameters.End,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.MultilineString.Begin,
          Token.Literals.MultilineString('key'),
          Token.Punctuation.MultilineString.End,
          Token.Operators.Assignment,
          Token.Operators.Relational.GreaterThan,
          Token.Punctuation.MultilineString.Begin,
          Token.Literals.MultilineString('value'),
          Token.Punctuation.MultilineString.End,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('multiline string in throw statement', async () => {
        const input = Input.InMethod(
          `throw new TestException('''msg''');`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.Throw,
          Token.Keywords.Control.New,
          Token.Type('TestException'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.MultilineString.Begin,
          Token.Literals.MultilineString('msg'),
          Token.Punctuation.MultilineString.End,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('multiline string in annotation', async () => {
        const input = Input.FromText(
          `@MyAnnotation(value = '''text''')
public class Foo { }`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Modifiers.AnnotationName('@MyAnnotation'),
          Token.Punctuation.OpenParen,
          Token.Variables.ReadWrite('value'),
          Token.Operators.Assignment,
          Token.Punctuation.MultilineString.Begin,
          Token.Literals.MultilineString('text'),
          Token.Punctuation.MultilineString.End,
          Token.Punctuation.CloseParen,
          Token.Keywords.Modifiers.Public,
          Token.Keywords.Class,
          Token.Identifiers.ClassName('Foo'),
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
        ]);
      });

      it('multiline string in initializer block', async () => {
        const input = Input.InClass(`
{
    this.setMessage('''multiline message''');
}`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Punctuation.OpenBrace,
          Token.Keywords.This,
          Token.Punctuation.Accessor,
          Token.Identifiers.MethodName('setMessage'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.MultilineString.Begin,
          Token.Literals.MultilineString('multiline message'),
          Token.Punctuation.MultilineString.End,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
          Token.Punctuation.CloseBrace,
        ]);
      });

      it('user MultiLineString class - all three variants', async () => {
        const source = `public class MultiLineString {
    String s = '''
    I am a multi \x24{var1}
    line \x24{var2}
    string \x24{var3}''';

    String t =
    '''
    I am a multi \x24{var1}
    line \x24{var2}
    string \x24{var3}
    ''';

    String u = 'a' +
    '''
    b
    '''
    + 'c';

    String templated = s.template(new Map<String, Object> {
        'var1' => 'foo',
        'var2' => 42,
        'var3' => true
    });
}`;
        const input = Input.FromText(source);
        const tokens = await tokenize(input, false);

        const stringTypes = tokens.filter(
          (t) =>
            t.type.includes('string.quoted') ||
            t.type.includes('punctuation.definition.string')
        );
        const multilineCount = stringTypes.filter((t) =>
          t.type.includes('multiline')
        ).length;
        const singleQuoteCount = stringTypes.filter(
          (t) =>
            t.type.includes('string.quoted.single') &&
            !t.type.includes('multiline')
        ).length;

        stringTypes.should.not.be.empty;
        multilineCount.should.be.greaterThan(
          0,
          `Expected multiline string tokens but got: ${JSON.stringify(stringTypes.map((t) => ({ text: t.text, type: t.type })))}`
        );
      });

      it('multiline string in throw statement', async () => {
        const input = Input.InMethod(
          `throw new IllegalArgumentException('''msg''');`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.Throw,
          Token.Keywords.Control.New,
          Token.Type('IllegalArgumentException'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.MultilineString.Begin,
          Token.Literals.MultilineString('msg'),
          Token.Punctuation.MultilineString.End,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('multiline string in annotation', async () => {
        const input = Input.FromText(
          `@MyAnnotation(value = '''text''')
public class C { }`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Modifiers.AnnotationName('@MyAnnotation'),
          Token.Punctuation.OpenParen,
          Token.Variables.ReadWrite('value'),
          Token.Operators.Assignment,
          Token.Punctuation.MultilineString.Begin,
          Token.Literals.MultilineString('text'),
          Token.Punctuation.MultilineString.End,
          Token.Punctuation.CloseParen,
          Token.Keywords.Modifiers.Public,
          Token.Keywords.Class,
          Token.Identifiers.ClassName('C'),
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
        ]);
      });

      it('multiline string in initializer block', async () => {
        const input = Input.InClass(`
{
    String s = '''hello''';
}`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Punctuation.OpenBrace,
          Token.PrimitiveType.String,
          Token.Identifiers.LocalName('s'),
          Token.Operators.Assignment,
          Token.Punctuation.MultilineString.Begin,
          Token.Literals.MultilineString('hello'),
          Token.Punctuation.MultilineString.End,
          Token.Punctuation.Semicolon,
          Token.Punctuation.CloseBrace,
        ]);
      });

      it('multiline string in method argument', async () => {
        const input = Input.InMethod(
          `System.debug('''multi\nline''');`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Support.Class.System,
          Token.Punctuation.Accessor,
          Token.Support.Class.FunctionText('debug'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.MultilineString.Begin,
          Token.Literals.MultilineString('multi'),
          Token.Literals.MultilineString('line'),
          Token.Punctuation.MultilineString.End,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('multiline string in return statement', async () => {
        const input = Input.InMethod(`return '''hello''';`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.Return,
          Token.Punctuation.MultilineString.Begin,
          Token.Literals.MultilineString('hello'),
          Token.Punctuation.MultilineString.End,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('multiline string in SOQL WHERE clause', async () => {
        const input = Input.InMethod(
          `List<Account> a = [SELECT Id FROM Account WHERE Name = '''value'''];`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type('List'),
          Token.Punctuation.TypeParameters.Begin,
          Token.Type('Account'),
          Token.Punctuation.TypeParameters.End,
          Token.Identifiers.LocalName('a'),
          Token.Operators.Assignment,
          Token.Punctuation.OpenBracket,
          Token.Keywords.Queries.Select,
          Token.Keywords.Queries.FieldName('Id'),
          Token.Keywords.Queries.From,
          Token.Keywords.Queries.TypeName('Account'),
          Token.Keywords.Queries.Where,
          Token.Keywords.Queries.FieldName('Name'),
          Token.Operators.Assignment,
          Token.Punctuation.MultilineString.Begin,
          Token.Literals.MultilineString('value'),
          Token.Punctuation.MultilineString.End,
          Token.Punctuation.CloseBracket,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('multiline string in map literal', async () => {
        const input = Input.InMethod(
          `Map<String,String> m = new Map<String,String>{'''key''' => '''value'''};`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Type('Map'),
          Token.Punctuation.TypeParameters.Begin,
          Token.PrimitiveType.String,
          Token.Punctuation.Comma,
          Token.PrimitiveType.String,
          Token.Punctuation.TypeParameters.End,
          Token.Identifiers.LocalName('m'),
          Token.Operators.Assignment,
          Token.Keywords.Control.New,
          Token.Type('Map'),
          Token.Punctuation.TypeParameters.Begin,
          Token.PrimitiveType.String,
          Token.Punctuation.Comma,
          Token.PrimitiveType.String,
          Token.Punctuation.TypeParameters.End,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.MultilineString.Begin,
          Token.Literals.MultilineString('key'),
          Token.Punctuation.MultilineString.End,
          Token.Operators.Assignment,
          Token.Operators.Relational.GreaterThan,
          Token.Punctuation.MultilineString.Begin,
          Token.Literals.MultilineString('value'),
          Token.Punctuation.MultilineString.End,
          Token.Punctuation.CloseBrace,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('multiline string in throw statement', async () => {
        const input = Input.InMethod(
          `throw new Exception('''msg''');`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Control.Throw,
          Token.Keywords.Control.New,
          Token.Support.Class.Text('Exception'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.MultilineString.Begin,
          Token.Literals.MultilineString('msg'),
          Token.Punctuation.MultilineString.End,
          Token.Punctuation.CloseParen,
          Token.Punctuation.Semicolon,
        ]);
      });

      it('multiline string in annotation', async () => {
        const input = Input.InClass(
          `@MyAnnotation(value = '''text''')
  void m() {}`
        );
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Keywords.Modifiers.AnnotationName('@MyAnnotation'),
          Token.Punctuation.OpenParen,
          Token.Variables.ReadWrite('value'),
          Token.Operators.Assignment,
          Token.Punctuation.MultilineString.Begin,
          Token.Literals.MultilineString('text'),
          Token.Punctuation.MultilineString.End,
          Token.Punctuation.CloseParen,
          Token.PrimitiveType.Void,
          Token.Identifiers.MethodName('m'),
          Token.Punctuation.OpenParen,
          Token.Punctuation.CloseParen,
          Token.Punctuation.OpenBrace,
          Token.Punctuation.CloseBrace,
        ]);
      });

      it('multiline string in initializer block', async () => {
        const input = Input.InClass(`
{
    String s = '''hello''';
}`);
        const tokens = await tokenize(input);

        tokens.should.deep.equal([
          Token.Punctuation.OpenBrace,
          Token.PrimitiveType.String,
          Token.Identifiers.LocalName('s'),
          Token.Operators.Assignment,
          Token.Punctuation.MultilineString.Begin,
          Token.Literals.MultilineString('hello'),
          Token.Punctuation.MultilineString.End,
          Token.Punctuation.Semicolon,
          Token.Punctuation.CloseBrace,
        ]);
      });

      it('user MultiLineString class - all three variants', async () => {
        const source = `public class MultiLineString {
    String s = '''
    I am a multi \x24{var1}
    line \x24{var2}
    string \x24{var3}''';

    String t =
    '''
    I am a multi \x24{var1}
    line \x24{var2}
    string \x24{var3}
    ''';

    String u = 'a' +
    '''
    b
    '''
    + 'c';

    String templated = s.template(new Map<String, Object> {
        'var1' => 'foo',
        'var2' => 42,
        'var3' => true
    });
}`;
        const input = Input.FromText(source);
        const tokens = await tokenize(input, false);

        const stringTypes = tokens.filter(
          (t) =>
            t.type.includes('string.quoted') ||
            t.type.includes('punctuation.definition.string')
        );
        const multilineCount = stringTypes.filter((t) =>
          t.type.includes('multiline')
        ).length;
        const singleQuoteCount = stringTypes.filter(
          (t) =>
            t.type.includes('string.quoted.single') &&
            !t.type.includes('multiline')
        ).length;

        stringTypes.should.not.be.empty;
        multilineCount.should.be.greaterThan(
          0,
          `Expected multiline string tokens but got: ${JSON.stringify(stringTypes.map((t) => ({ text: t.text, type: t.type })))}`
        );
      });
    });
  });
});
