/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITokenizeLineResult, Registry, StackElement } from 'vscode-textmate';

const registry = new Registry();
const grammar = registry.loadGrammarFromPathSync('grammars/apex.tmLanguage');
const excludedTypes = [
  'source.apex',
  'meta.tag.apex',
  'meta.type.parameters.apex'
];

export function tokenize(
  input: string | Input,
  excludeTypes: boolean = true
): Token[] {
  if (typeof input === 'string') {
    input = Input.FromText(input);
  }

  let tokens: Token[] = [];
  let previousStack: StackElement = null;

  for (let lineIndex = 0; lineIndex < input.lines.length; lineIndex++) {
    const line = input.lines[lineIndex];

    let lineResult = grammar.tokenizeLine(line, previousStack);
    previousStack = lineResult.ruleStack;

    if (lineIndex < input.span.startLine || lineIndex > input.span.endLine) {
      continue;
    }

    for (const token of lineResult.tokens) {
      if (
        (lineIndex === input.span.startLine &&
          token.startIndex < input.span.startIndex) ||
        (lineIndex === input.span.endLine &&
          token.endIndex > input.span.endIndex)
      ) {
        continue;
      }

      const text = line.substring(token.startIndex, token.endIndex);
      const type = token.scopes[token.scopes.length - 1];

      if (excludeTypes === false || excludedTypes.indexOf(type) < 0) {
        tokens.push(createToken(text, type));
      }
    }
  }

  return tokens;
}

interface Span {
  startLine: number;
  startIndex: number;
  endLine: number;
  endIndex: number;
}

export class Input {
  private constructor(public lines: string[], public span: Span) {}

  public static FromText(text: string) {
    // ensure consistent line-endings irrelevant of OS
    text = text.replace('\r\n', '\n');
    let lines = text.split('\n');

    return new Input(lines, {
      startLine: 0,
      startIndex: 0,
      endLine: lines.length - 1,
      endIndex: lines[lines.length - 1].length
    });
  }

  public static InEnum(input: string) {
    let text = `
enum TestEnum {
    ${input}
}`;

    // ensure consistent line-endings irrelevant of OS
    text = text.replace('\r\n', '\n');
    let lines = text.split('\n');

    return new Input(lines, {
      startLine: 2,
      startIndex: 4,
      endLine: lines.length - 1,
      endIndex: 0
    });
  }

  public static InClass(input: string) {
    let text = `
class TestClass {
    ${input}
}`;

    // ensure consistent line-endings irrelevant of OS
    text = text.replace('\r\n', '\n');
    let lines = text.split('\n');

    return new Input(lines, {
      startLine: 2,
      startIndex: 4,
      endLine: lines.length - 1,
      endIndex: 0
    });
  }

  public static InTrigger(input: string) {
    let text = `
trigger TestTrigger on Account (before insert, after update) {
    ${input}
}`;

    // ensure consistent line-endings irrelevant of OS
    text = text.replace('\r\n', '\n');
    let lines = text.split('\n');

    return new Input(lines, {
      startLine: 2,
      startIndex: 4,
      endLine: lines.length - 1,
      endIndex: 0
    });
  }

  public static InInterface(input: string) {
    let text = `
interface TestInterface {
    ${input}
}`;

    // ensure consistent line-endings irrelevant of OS
    text = text.replace('\r\n', '\n');
    let lines = text.split('\n');

    return new Input(lines, {
      startLine: 2,
      startIndex: 4,
      endLine: lines.length - 1,
      endIndex: 0
    });
  }

  public static InMethod(input: string) {
    let text = `
class TestClass {
    void TestMethod() {
        ${input}
    }
}`;

    // ensure consistent line-endings irrelevant of OS
    text = text.replace('\r\n', '\n');
    let lines = text.split('\n');

    return new Input(lines, {
      startLine: 3,
      startIndex: 8,
      endLine: lines.length - 2,
      endIndex: 0
    });
  }
}

export interface Token {
  text: string;
  type: string;
}

function createToken(text: string, type: string) {
  return { text, type };
}

export namespace Token {
  export namespace Comment {
    export const LeadingWhitespace = (text: string) =>
      createToken(text, 'punctuation.whitespace.comment.leading.apex');

    export namespace MultiLine {
      export const End = createToken(
        '*/',
        'punctuation.definition.comment.apex'
      );
      export const Start = createToken(
        '/*',
        'punctuation.definition.comment.apex'
      );
      export const JavaDocStart = createToken(
        '/**',
        'punctuation.definition.comment.apex'
      );

      export const Text = (text: string) =>
        createToken(text, 'comment.block.apex');
    }

    export namespace SingleLine {
      export const Start = createToken(
        '//',
        'punctuation.definition.comment.apex'
      );

      export const Text = (text: string) =>
        createToken(text, 'comment.line.double-slash.apex');
    }
  }

  export namespace Identifiers {
    export const ClassName = (text: string) =>
      createToken(text, 'entity.name.type.class.apex');
    export const EnumMemberName = (text: string) =>
      createToken(text, 'entity.name.variable.enum-member.apex');
    export const EnumName = (text: string) =>
      createToken(text, 'entity.name.type.enum.apex');
    export const ExtendsName = (text: string) =>
      createToken(text, 'entity.name.type.extends.apex');
    export const FieldName = (text: string) =>
      createToken(text, 'entity.name.variable.field.apex');
    export const ImplementsName = (text: string) =>
      createToken(text, 'entity.name.type.implements.apex');
    export const InterfaceName = (text: string) =>
      createToken(text, 'entity.name.type.interface.apex');
    export const LabelName = (text: string) =>
      createToken(text, 'entity.name.label.apex');
    export const LocalName = (text: string) =>
      createToken(text, 'entity.name.variable.local.apex');
    export const MethodName = (text: string) =>
      createToken(text, 'entity.name.function.apex');
    export const ParameterName = (text: string) =>
      createToken(text, 'entity.name.variable.parameter.apex');
    export const PropertyName = (text: string) =>
      createToken(text, 'entity.name.variable.property.apex');
    export const RangeVariableName = (text: string) =>
      createToken(text, 'entity.name.variable.range-variable.apex');
    export const TriggerName = (text: string) =>
      createToken(text, 'entity.name.type.trigger.apex');
    export const TypeParameterName = (text: string) =>
      createToken(text, 'entity.name.type.type-parameter.apex');
  }

  export namespace Keywords {
    export namespace Control {
      export const Break = createToken(
        'break',
        'keyword.control.flow.break.apex'
      );
      export const Case = createToken('case', 'keyword.control.case.apex');
      export const Catch = createToken(
        'catch',
        'keyword.control.try.catch.apex'
      );
      export const Continue = createToken(
        'continue',
        'keyword.control.flow.continue.apex'
      );
      export const Default = createToken(
        'default',
        'keyword.control.default.apex'
      );
      export const Do = createToken('do', 'keyword.control.loop.do.apex');
      export const Else = createToken(
        'else',
        'keyword.control.conditional.else.apex'
      );
      export const Finally = createToken(
        'finally',
        'keyword.control.try.finally.apex'
      );
      export const For = createToken('for', 'keyword.control.loop.for.apex');
      export const Goto = createToken('goto', 'keyword.control.goto.apex');
      export const If = createToken(
        'if',
        'keyword.control.conditional.if.apex'
      );
      export const In = createToken('in', 'keyword.control.loop.in.apex');
      export const New = createToken('new', 'keyword.control.new.apex');
      export const Return = createToken(
        'return',
        'keyword.control.flow.return.apex'
      );
      export const Switch = createToken(
        'switch',
        'keyword.control.switch.apex'
      );
      export const Throw = createToken(
        'throw',
        'keyword.control.flow.throw.apex'
      );
      export const Try = createToken('try', 'keyword.control.try.apex');
      export const When = createToken('when', 'keyword.control.try.when.apex');
      export const While = createToken(
        'while',
        'keyword.control.loop.while.apex'
      );
    }

    export namespace Modifiers {
      export const Abstract = createToken('abstract', 'storage.modifier.apex');
      export const AnnotationName = (text: string) =>
        createToken(text, 'storage.type.annotation.apex');
      export const Final = createToken('final', 'storage.modifier.apex');
      export const Global = createToken('global', 'storage.modifier.apex');
      export const New = createToken('new', 'storage.modifier.apex');
      export const Override = createToken('override', 'storage.modifier.apex');
      export const Private = createToken('private', 'storage.modifier.apex');
      export const Protected = createToken(
        'protected',
        'storage.modifier.apex'
      );
      export const Public = createToken('public', 'storage.modifier.apex');
      export const Static = createToken('static', 'storage.modifier.apex');
      export const This = createToken('this', 'storage.modifier.apex');
      export const Virtual = createToken('virtual', 'storage.modifier.apex');
      export const WithoutSharing = createToken(
        'without sharing',
        'sharing.modifier.apex'
      );
      export const WithSharing = createToken(
        'with sharing',
        'sharing.modifier.apex'
      );
    }

    export namespace Queries {
      export const Ascending = createToken(
        'ASC',
        'keyword.operator.query.ascending.apex'
      );
      export const By = createToken('by', 'keyword.operator.query.by.apex');
      export const Descending = createToken(
        'DESC',
        'keyword.operator.query.descending.apex'
      );
      export const Equals = createToken(
        'equals',
        'keyword.operator.query.equals.apex'
      );
      export const From = createToken(
        'FROM',
        'keyword.operator.query.from.apex'
      );
      export const Group = createToken(
        'group',
        'keyword.operator.query.group.apex'
      );
      export const In = createToken('IN', 'keyword.operator.query.in.apex');
      export const Into = createToken(
        'into',
        'keyword.operator.query.into.apex'
      );
      export const Join = createToken(
        'join',
        'keyword.operator.query.join.apex'
      );
      export const Let = createToken('let', 'keyword.operator.query.let.apex');
      export const NullsFirst = createToken(
        'NULLS first',
        'keyword.operator.query.nullsfirst.apex'
      );
      export const NullsLast = createToken(
        'NULLS last',
        'keyword.operator.query.nullslast.apex'
      );
      export const On = createToken('on', 'keyword.operator.query.on.apex');
      export const OrderBy = createToken(
        'ORDER BY',
        'keyword.operator.query.orderby.apex'
      );
      export const FieldName = (text: string) =>
        createToken(text, 'keyword.query.field.apex');
      export const Select = createToken(
        'SELECT',
        'keyword.operator.query.select.apex'
      );
      export const TypeName = (text: string) =>
        createToken(text, 'storage.type.apex');
      export const Where = createToken(
        'WHERE',
        'keyword.operator.query.where.apex'
      );
    }

    export namespace Triggers {
      export const After = createToken(
        'after',
        'keyword.control.trigger.after.apex'
      );
      export const Before = createToken(
        'before',
        'keyword.control.trigger.before.apex'
      );
      export const On = createToken('on', 'keyword.operator.trigger.on.apex');
      export const OperatorName = (text: string) =>
        createToken(text, 'keyword.operator.trigger.apex');
    }

    export const Add = createToken('add', 'keyword.other.add.apex');
    export const AttributeSpecifier = (text: string) =>
      createToken(text, 'keyword.other.attribute-specifier.apex');
    export const Base = createToken('base', 'keyword.other.base.apex');
    export const Class = createToken('class', 'keyword.other.class.apex');
    export const Default = createToken('default', 'keyword.other.default.apex');
    export const Enum = createToken('enum', 'keyword.other.enum.apex');
    export const Extends = createToken('extends', 'keyword.other.extends.apex');
    export const Get = createToken('get', 'keyword.other.get.apex');
    export const Implements = createToken(
      'implements',
      'keyword.other.implements.apex'
    );
    export const Interface = createToken(
      'interface',
      'keyword.other.interface.apex'
    );
    export const Remove = createToken('remove', 'keyword.other.remove.apex');
    export const Set = createToken('set', 'keyword.other.set.apex');
    export const Static = createToken('static', 'keyword.other.static.apex');
    export const This = createToken('this', 'keyword.other.this.apex');
    export const Trigger = createToken('trigger', 'keyword.other.trigger.apex');
    export const Where = createToken('where', 'keyword.other.where.apex');
  }

  export namespace Literals {
    export namespace Boolean {
      export const False = createToken(
        'false',
        'constant.language.boolean.false.apex'
      );
      export const True = createToken(
        'true',
        'constant.language.boolean.true.apex'
      );
    }

    export const Null = createToken('null', 'constant.language.null.apex');

    export namespace Numeric {
      export const Binary = (text: string) =>
        createToken(text, 'constant.numeric.binary.apex');
      export const Decimal = (text: string) =>
        createToken(text, 'constant.numeric.decimal.apex');
      export const Hexadecimal = (text: string) =>
        createToken(text, 'constant.numeric.hex.apex');
    }

    export const String = (text: string) =>
      createToken(text, 'string.quoted.single.apex');
    export const CharacterEscape = (text: string) =>
      createToken(text, 'constant.character.escape.apex');
    export const StringDoubleQuote = (text: string) =>
      createToken(text, 'string.quoted.double.apex');
  }

  export namespace Operators {
    export namespace Arithmetic {
      export const Addition = createToken(
        '+',
        'keyword.operator.arithmetic.apex'
      );
      export const Division = createToken(
        '/',
        'keyword.operator.arithmetic.apex'
      );
      export const Multiplication = createToken(
        '*',
        'keyword.operator.arithmetic.apex'
      );
      export const Subtraction = createToken(
        '-',
        'keyword.operator.arithmetic.apex'
      );
    }

    export namespace Bitwise {
      export const And = createToken('&', 'keyword.operator.bitwise.apex');
      export const Or = createToken('|', 'keyword.operator.bitwise.apex');
      export const ShiftLeft = createToken(
        '<<',
        'keyword.operator.bitwise.shift.apex'
      );
      export const ShiftRight = createToken(
        '>>',
        'keyword.operator.bitwise.shift.apex'
      );
    }

    export namespace CompoundAssignment {
      export namespace Arithmetic {
        export const Addition = createToken(
          '+=',
          'keyword.operator.assignment.compound.ts'
        );
        export const Division = createToken(
          '/=',
          'keyword.operator.assignment.compound.ts'
        );
        export const Multiplication = createToken(
          '*=',
          'keyword.operator.assignment.compound.ts'
        );
        export const Remainder = createToken(
          '%=',
          'keyword.operator.assignment.compound.ts'
        );
        export const Subtraction = createToken(
          '-=',
          'keyword.operator.assignment.compound.ts'
        );
      }

      export namespace Bitwise {
        export const And = createToken(
          '&=',
          'keyword.operator.assignment.compound.bitwise.ts'
        );
        export const ExclusiveOr = createToken(
          '^=',
          'keyword.operator.assignment.compound.bitwise.ts'
        );
        export const Or = createToken(
          '|=',
          'keyword.operator.assignment.compound.bitwise.ts'
        );
        export const ShiftLeft = createToken(
          '<<=',
          'keyword.operator.assignment.compound.bitwise.ts'
        );
        export const ShiftRight = createToken(
          '>>=',
          'keyword.operator.assignment.compound.bitwise.ts'
        );
      }
    }

    export namespace Conditional {
      export const QuestionMark = createToken(
        '?',
        'keyword.operator.conditional.question-mark.apex'
      );
      export const Colon = createToken(
        ':',
        'keyword.operator.conditional.colon.apex'
      );
    }

    export namespace Logical {
      export const And = createToken('&&', 'keyword.operator.logical.apex');
      export const Not = createToken('!', 'keyword.operator.logical.apex');
      export const Or = createToken('||', 'keyword.operator.logical.apex');
    }

    export namespace Relational {
      export const Equals = createToken(
        '==',
        'keyword.operator.comparison.apex'
      );
      export const NotEqual = createToken(
        '!=',
        'keyword.operator.comparison.apex'
      );

      export const LessThan = createToken(
        '<',
        'keyword.operator.relational.apex'
      );
      export const LessThanOrEqual = createToken(
        '<=',
        'keyword.operator.relational.apex'
      );
      export const GreaterThan = createToken(
        '>',
        'keyword.operator.relational.apex'
      );
      export const GreaterThanOrEqual = createToken(
        '>=',
        'keyword.operator.relational.apex'
      );
    }

    export const Assignment = createToken(
      '=',
      'keyword.operator.assignment.apex'
    );
    export const Decrement = createToken(
      '--',
      'keyword.operator.decrement.apex'
    );
    export const Increment = createToken(
      '++',
      'keyword.operator.increment.apex'
    );
    export const NullConditional = createToken(
      '?',
      'keyword.operator.null-conditional.apex'
    );
  }

  export namespace PrimitiveType {
    export const Blob = createToken('Blob', 'keyword.type.apex');
    export const Boolean = createToken('Boolean', 'keyword.type.apex');
    export const Byte = createToken('byte', 'keyword.type.apex');
    export const Date = createToken('Date', 'keyword.type.apex');
    export const Datetime = createToken('Datetime', 'keyword.type.apex');
    export const Decimal = createToken('Decimal', 'keyword.type.apex');
    export const Double = createToken('Double', 'keyword.type.apex');
    export const ID = createToken('ID', 'keyword.type.apex');
    export const Integer = createToken('Integer', 'keyword.type.apex');
    export const Long = createToken('Long', 'keyword.type.apex');
    export const Object = createToken('Object', 'keyword.type.apex');
    export const String = createToken('String', 'keyword.type.apex');
    export const Time = createToken('Time', 'keyword.type.apex');
    export const Void = createToken('void', 'keyword.type.apex');
  }

  export namespace Punctuation {
    export namespace String {
      export const Begin = createToken(
        "'",
        'punctuation.definition.string.begin.apex'
      );
      export const End = createToken(
        "'",
        'punctuation.definition.string.end.apex'
      );
    }

    export namespace TypeParameters {
      export const Begin = createToken(
        '<',
        'punctuation.definition.typeparameters.begin.apex'
      );
      export const End = createToken(
        '>',
        'punctuation.definition.typeparameters.end.apex'
      );
    }

    export const Accessor = createToken('.', 'punctuation.accessor.apex');
    export const CloseBrace = createToken(
      '}',
      'punctuation.curlybrace.close.apex'
    );
    export const CloseBracket = createToken(
      ']',
      'punctuation.squarebracket.close.apex'
    );
    export const CloseParen = createToken(
      ')',
      'punctuation.parenthesis.close.apex'
    );
    export const Colon = createToken(':', 'punctuation.separator.colon.apex');
    export const ColonColon = createToken(
      '::',
      'punctuation.separator.coloncolon.apex'
    );
    export const Comma = createToken(',', 'punctuation.separator.comma.apex');
    export const Hash = createToken('#', 'punctuation.separator.hash.apex');
    export const OpenBrace = createToken(
      '{',
      'punctuation.curlybrace.open.apex'
    );
    export const OpenBracket = createToken(
      '[',
      'punctuation.squarebracket.open.apex'
    );
    export const OpenParen = createToken(
      '(',
      'punctuation.parenthesis.open.apex'
    );
    export const QuestionMark = createToken(
      '?',
      'punctuation.separator.question-mark.apex'
    );
    export const Semicolon = createToken(
      ';',
      'punctuation.terminator.statement.apex'
    );
    export const Tilde = createToken('~', 'punctuation.tilde.apex');
  }

  export namespace Variables {
    export const Object = (text: string) =>
      createToken(text, 'variable.other.object.apex');
    export const Property = (text: string) =>
      createToken(text, 'variable.other.object.property.apex');
    export const ReadWrite = (text: string) =>
      createToken(text, 'variable.other.readwrite.apex');
  }

  export namespace XmlDocComments {
    export namespace Attribute {
      export const Name = (text: string) =>
        createToken(text, 'entity.other.attribute-name.localname.apex');
    }

    export namespace CData {
      export const Begin = createToken(
        '<![CDATA[',
        'punctuation.definition.string.begin.apex'
      );
      export const End = createToken(
        ']]>',
        'punctuation.definition.string.end.apex'
      );
      export const Text = (text: string) =>
        createToken(text, 'string.unquoted.cdata.apex');
    }

    export namespace CharacterEntity {
      export const Begin = createToken(
        '&',
        'punctuation.definition.constant.apex'
      );
      export const End = createToken(
        ';',
        'punctuation.definition.constant.apex'
      );
      export const Text = (text: string) =>
        createToken(text, 'constant.character.entity.apex');
    }

    export namespace Comment {
      export const Begin = createToken(
        '<!--',
        'punctuation.definition.comment.apex'
      );
      export const End = createToken(
        '-->',
        'punctuation.definition.comment.apex'
      );
      export const Text = (text: string) =>
        createToken(text, 'comment.block.apex');
    }

    export namespace Tag {
      // punctuation
      export const StartTagBegin = createToken(
        '<',
        'punctuation.definition.tag.apex'
      );
      export const StartTagEnd = createToken(
        '>',
        'punctuation.definition.tag.apex'
      );
      export const EndTagBegin = createToken(
        '</',
        'punctuation.definition.tag.apex'
      );
      export const EndTagEnd = createToken(
        '>',
        'punctuation.definition.tag.apex'
      );
      export const EmptyTagBegin = createToken(
        '<',
        'punctuation.definition.tag.apex'
      );
      export const EmptyTagEnd = createToken(
        '/>',
        'punctuation.definition.tag.apex'
      );

      export const Name = (text: string) =>
        createToken(text, 'entity.name.tag.localname.apex');
    }

    export namespace String {
      export namespace DoubleQuoted {
        export const Begin = createToken(
          '"',
          'punctuation.definition.stringdoublequote.begin.apex'
        );
        export const End = createToken(
          '"',
          'punctuation.definition.stringdoublequote.end.apex'
        );
        export const Text = (text: string) =>
          createToken(text, 'string.quoted.double.apex');
      }

      export namespace SingleQuoted {
        export const Begin = createToken(
          "'",
          'punctuation.definition.string.begin.apex'
        );
        export const End = createToken(
          "'",
          'punctuation.definition.string.end.apex'
        );
        export const Text = (text: string) =>
          createToken(text, 'string.quoted.single.apex');
      }
    }

    export const Begin = createToken(
      '///',
      'punctuation.definition.comment.apex'
    );
    export const Colon = createToken(':', 'punctuation.separator.colon.apex');
    export const Equals = createToken('=', 'punctuation.separator.equals.apex');
    export const Text = (text: string) =>
      createToken(text, 'comment.block.documentation.apex');
  }

  export namespace Support {
    export namespace Class {
      export const Date = createToken('Date', 'support.class.apex');
      export const Datetime = createToken('Datetime', 'support.class.apex');
      export const Database = createToken('Database', 'support.class.apex');
      export const FunctionText = (text: string) => createToken(text, 'support.function.apex');
      export const System = createToken('System', 'support.class.apex');
      export const Trigger = createToken(
        'Trigger',
        'support.class.trigger.apex'
      );
      export const TypeText = (text: string) => createToken(text, 'support.type.apex');
      export const Text = (text: string) =>
        createToken(text, 'support.class.apex');
    }

    export namespace Type {
      export const TriggerText = (text: string) =>
        createToken(text, 'support.type.trigger.apex');
    }

    export namespace Function {
      export const Text = (text: string) =>
        createToken(text, 'support.function.apex');
      export const TriggerText = (text: string) =>
        createToken(text, 'support.function.trigger.apex');
      export const Insert = createToken('insert', 'support.function.apex');
    }
  }

  export const IllegalNewLine = (text: string) =>
    createToken(text, 'invalid.illegal.newline.apex');
  export const Type = (text: string) => createToken(text, 'storage.type.apex');
}
