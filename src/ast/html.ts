import type { Node } from 'node-html-parser'
import { HTMLElement, parse } from 'node-html-parser'
import { workspace } from 'vscode'
import type { Ast, Context } from '../types'
import { getAstJS } from './js'

export function parser(context: Context) {
  const config = workspace.getConfiguration('smartSelect')
  const { document, asts } = context

  if (!config.get<string[]>('htmlLanguageIds')!.includes(document.languageId))
    return

  asts.push(...getAstHTML(document.getText()))
}

function getAstHTML(code: string): Ast[] {
  const result: Ast[] = []

  const astRoot = parse(code, {
    comment: true,
  })
  result.push({
    type: 'HTML',
    start: 0,
    end: code.length,
    astRoot,
  })

  traverseHTML(astRoot, (node) => {
    if (node instanceof HTMLElement && node.rawTagName === 'script') {
      const code = node.innerHTML
      const startOffset = node.childNodes[0].range[0]
      const astJS = getAstJS(code, startOffset)
      result.push(astJS)
    }
  })

  return result
}

function traverseHTML(node: Node, callback: (node: Node) => void) {
  callback(node)
  node.childNodes.forEach(child => traverseHTML(child, callback))
}
