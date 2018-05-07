/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Grammar", () => {
    before(() => should());

    describe("Apex Class", () => {
      it("class keyword and storage modifiers", () => {
          const input = Input.InNamespace(`
public             class PublicClass { }
                  class DefaultClass { }
protected           class ProtectedClass { }
          global   class DefaultGlobalClass { }
public    with sharing   class PublicWithSharingClass { }
          without sharing   class DefaultWithoutSharingClass { }
public    virtual   class PublicVirtualClass { }
public    abstract class PublicAbstractClass { }
          abstract class DefaultAbstractClass { }`);

          const tokens = tokenize(input);

          tokens.should.deep.equal([
              Token.Keywords.Modifiers.Public,
              Token.Keywords.Class,
              Token.Identifiers.ClassName("PublicClass"),
              Token.Punctuation.OpenBrace,
              Token.Punctuation.CloseBrace,

              Token.Keywords.Class,
              Token.Identifiers.ClassName("DefaultClass"),
              Token.Punctuation.OpenBrace,
              Token.Punctuation.CloseBrace,

              Token.Keywords.Modifiers.Protected,
              Token.Keywords.Class,
              Token.Identifiers.ClassName("ProtectedClass"),
              Token.Punctuation.OpenBrace,
              Token.Punctuation.CloseBrace,

              Token.Keywords.Modifiers.Global,
              Token.Keywords.Class,
              Token.Identifiers.ClassName("DefaultGlobalClass"),
              Token.Punctuation.OpenBrace,
              Token.Punctuation.CloseBrace,

              Token.Keywords.Modifiers.Public,
              Token.Keywords.Modifiers.WithSharing,
              Token.Keywords.Class,
              Token.Identifiers.ClassName("PublicWithSharingClass"),
              Token.Punctuation.OpenBrace,
              Token.Punctuation.CloseBrace,

              Token.Keywords.Modifiers.WithoutSharing,
              Token.Keywords.Class,
              Token.Identifiers.ClassName("DefaultWithoutSharingClass"),
              Token.Punctuation.OpenBrace,
              Token.Punctuation.CloseBrace,

              Token.Keywords.Modifiers.Public,
              Token.Keywords.Modifiers.Virtual,
              Token.Keywords.Class,
              Token.Identifiers.ClassName("PublicVirtualClass"),
              Token.Punctuation.OpenBrace,
              Token.Punctuation.CloseBrace,

              Token.Keywords.Modifiers.Public,
              Token.Keywords.Modifiers.Abstract,
              Token.Keywords.Class,
              Token.Identifiers.ClassName("PublicAbstractClass"),
              Token.Punctuation.OpenBrace,
              Token.Punctuation.CloseBrace,

              Token.Keywords.Modifiers.Abstract,
              Token.Keywords.Class,
              Token.Identifiers.ClassName("DefaultAbstractClass"),
              Token.Punctuation.OpenBrace,
              Token.Punctuation.CloseBrace]);
        });

        it("public class with sharing", () => {
          const input = Input.InNamespace(`public with sharing class C {}`);
          const tokens = tokenize(input);

          tokens.should.deep.equal([
              Token.Keywords.Modifiers.Public,
              Token.Keywords.Modifiers.WithSharing,
              Token.Keywords.Class,
              Token.Identifiers.ClassName("C"),
              Token.Punctuation.OpenBrace,
              Token.Punctuation.CloseBrace]);
        });

        it("public class without sharing", () => {
            const input = Input.InNamespace(`public without sharing class Fireburn {}`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.WithoutSharing,
                Token.Keywords.Class,
                Token.Identifiers.ClassName("Fireburn"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("simple class", () => {
              const input = Input.InNamespace(`private class SimpleClass {}`);
              const tokens = tokenize(input);

              tokens.should.deep.equal([
                  Token.Keywords.Modifiers.Private,
                  Token.Keywords.Class,
                  Token.Identifiers.ClassName("SimpleClass"),
                  Token.Punctuation.OpenBrace,
                  Token.Punctuation.CloseBrace]);
        });

        it("global class", () => {
              const input = Input.InNamespace(`global class GlobalClass {}`);
              const tokens = tokenize(input);

              tokens.should.deep.equal([
                  Token.Keywords.Modifiers.Global,
                  Token.Keywords.Class,
                  Token.Identifiers.ClassName("GlobalClass"),
                  Token.Punctuation.OpenBrace,
                  Token.Punctuation.CloseBrace]);
        });
    });
});
