/*---------------------------------------------------------------------------------------------
 *  Copyright (c) 2020 Salesforce. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe('Grammar', () => {
  before(() => {
    should();
  });
  describe('JavaDoc', () => {
    it('multi-line comment with no content', async () => {
      const input = `/***********/`;
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Comment.MultiLine.JavaDocStart,
        Token.Comment.MultiLine.JavaDocText('********'),
        Token.Comment.MultiLine.End
      ]);
    });

    it('multi-line java doc comment', async () => {
      const input = Input.FromText(`
/**
* foo
*/
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Comment.MultiLine.JavaDocStart,
        Token.Comment.MultiLine.JavaDocText('* foo'),
        Token.Comment.MultiLine.End
      ]);
    });

    it('multi-line comment with content', async () => {
      const input = Input.FromText(`
/*************/
/***** foo ***/
/*************/
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Comment.MultiLine.JavaDocStart,
        Token.Comment.MultiLine.JavaDocText('**********'),
        Token.Comment.MultiLine.End,
        Token.Comment.MultiLine.JavaDocStart,
        Token.Comment.MultiLine.JavaDocText('*** foo **'),
        Token.Comment.MultiLine.End,
        Token.Comment.MultiLine.JavaDocStart,
        Token.Comment.MultiLine.JavaDocText('**********'),
        Token.Comment.MultiLine.End
      ]);
    });

    it('multi-line comment with content', async () => {
      const input = Input.FromText(`
/**
* @return null
*/
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Comment.MultiLine.JavaDocStart,
        Token.Comment.MultiLine.JavaDocText('* '),
        Token.Comment.MultiLine.JavaDocKeyword('@return'),
        Token.Comment.MultiLine.JavaDocText(' null'),
        Token.Comment.MultiLine.End
      ]);
    });

    it('multi-line comment with annotations', async () => {
      const input = Input.FromText(`
/**
 * Interactively reinvent high-payoff convergence
 * with professional process improvements.
 * <p>
 * Continually initiate client-centric mindshare
 * without innovative value. Compellingly formulate 
 * sustainable e-business via revolutionary supply chains.
 *
 * @param  url  base location url
 * @param  name the name of the asset
 * @return      the full URL of the asset
 * 
 * @throws myCustomException
 * @author Eduardo Mora em@example.com
 */`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Comment.MultiLine.JavaDocStart,
        Token.Comment.MultiLine.JavaDocText(
          ' * Interactively reinvent high-payoff convergence'
        ),
        Token.Comment.MultiLine.JavaDocText(
          ' * with professional process improvements.'
        ),
        Token.Comment.MultiLine.JavaDocText(' * <p>'),
        Token.Comment.MultiLine.JavaDocText(
          ' * Continually initiate client-centric mindshare'
        ),
        Token.Comment.MultiLine.JavaDocText(
          ' * without innovative value. Compellingly formulate '
        ),
        Token.Comment.MultiLine.JavaDocText(
          ' * sustainable e-business via revolutionary supply chains.'
        ),
        Token.Comment.MultiLine.JavaDocText(' *'),
        Token.Comment.MultiLine.JavaDocText(' * '),
        Token.Comment.MultiLine.JavaDocKeyword('@param'),
        Token.Comment.MultiLine.JavaDocText('  '),
        Token.Identifiers.ParameterName('url'),
        Token.Comment.MultiLine.JavaDocText('  base location url'),
        Token.Comment.MultiLine.JavaDocText(' * '),
        Token.Comment.MultiLine.JavaDocKeyword('@param'),
        Token.Comment.MultiLine.JavaDocText('  '),
        Token.Identifiers.ParameterName('name'),
        Token.Comment.MultiLine.JavaDocText(' the name of the asset'),
        Token.Comment.MultiLine.JavaDocText(' * '),
        Token.Comment.MultiLine.JavaDocKeyword('@return'),
        Token.Comment.MultiLine.JavaDocText('      the full URL of the asset'),
        Token.Comment.MultiLine.JavaDocText(' * '),
        Token.Comment.MultiLine.JavaDocText(' * '),
        Token.Comment.MultiLine.JavaDocKeyword('@throws'),
        Token.Comment.MultiLine.JavaDocText(' '),
        Token.Identifiers.ClassName('myCustomException'),
        Token.Comment.MultiLine.JavaDocText(' * '),
        Token.Comment.MultiLine.JavaDocKeyword('@author'),
        Token.Comment.MultiLine.JavaDocText(' Eduardo Mora em@example.com'),
        Token.Comment.MultiLine.JavaDocText(' '),
        Token.Comment.MultiLine.End
      ]);
    });
  });
});
