import { parse } from '@babel/parser'
import type { Ast, Context } from '../types'

export async function parser(context: Context) {
  const { document, asts } = context

  if (!['javascript', 'typescript', 'javascriptreact', 'typescriptreact'].includes(document.languageId))
    return

  try {
    asts.push(getAstJS(document.getText(), 0))
  }
  catch (error) {

  }
}

export function getAstJS(code: string, start: number): Ast {
  const astRoot = parse(code, {
    sourceType: 'unambiguous',
    plugins: ['jsx', 'typescript'],
  })

  return {
    type: 'JS',
    start,
    end: start + code.length,
    astRoot,
  }
}
