import type { Ast, Context } from '../types'
import { parser as parserJS } from './javascript'

export const astCache = new Map<string, Ast[]>()

export async function astParser(context: Context) {
  // if asts exist, means current document hasn't been changed
  if (context.asts.length)
    return
  await parserJS(context)
}

export function filterAsts(asts: Ast[], type: 'JS' | 'HTML', cursorOffset: number) {
  return asts.filter(ast => ast.type === type && ast.start <= cursorOffset && ast.end >= cursorOffset)
}
