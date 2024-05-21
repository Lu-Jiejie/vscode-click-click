import { log } from '../log'
import type { Ast, AstHTML, AstJS, Context } from '../types'
import { parser as parserJS } from './js'
import { parser as parserHTML } from './html'

export const astCache = new Map<string, Ast[]>()

const languageParser = [
  parserJS,
  parserHTML,
]

export async function astParser(context: Context) {
  // if asts exist, means current document hasn't been changed
  if (context.asts.length)
    return

  languageParser.forEach((parser) => {
    try {
      parser(context)
    }
    catch (error: any) {
      log(error)
    }
  })
}

interface AstMap {
  JS: AstJS
  HTML: AstHTML
}

export function findAst<T extends keyof AstMap>(asts: Ast[], type: T, cursorOffset: number): AstMap[T] {
  return asts.find(ast => ast.type === type && ast.start <= cursorOffset && ast.end >= cursorOffset) as AstMap[T]
}
