import { parse } from '@babel/parser'
import type { AstJS, Context } from '../types'

const expectedLanguageIds = ['javascript', 'typescript', 'javascriptreact', 'typescriptreact']

export async function parser(context: Context) {
  const { document, asts } = context

  if (!expectedLanguageIds.includes(document.languageId))
    return

  asts.push(getAstJS(document.getText(), 0))
}

export function getAstJS(code: string, startOffset: number): AstJS {
  const astRoot = parse(code, {
    sourceType: 'unambiguous',
    plugins: ['jsx', 'typescript'],
  })

  return {
    type: 'JS',
    start: startOffset,
    end: startOffset + code.length,
    astRoot,
  }
}
