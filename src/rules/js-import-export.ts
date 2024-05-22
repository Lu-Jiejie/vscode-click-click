import traverse from '@babel/traverse'
import { Selection } from 'vscode'
import { findAst } from '../ast'
import type { Context, NodeType } from '../types'
import { isUndefinedOrNull } from '../utils'

const expectedTypes: NodeType[] = [
  'ImportDeclaration',
  'ExportNamedDeclaration',
  'ExportDefaultDeclaration',
  'ExportAllDeclaration',
]

const expectedKeywords = [
  'import',
  'export',
]

/**
 *   ▼
 * import { ... } from '...'
 *   ▼
 * export { ... }
 */

export default function parser(context: Context) {
  const { asts, cursorOffset, document, selection } = context
  const ast = findAst(asts, 'JS', cursorOffset)

  if (!ast)
    return
  if (!expectedKeywords.includes(document.getText(selection)))
    return

  const cursorRelativeOffset = cursorOffset - ast.start
  let newSelection: Selection | undefined
  traverse(ast.astRoot, {
    enter(path) {
      if (!expectedTypes.includes(path.node.type))
        return

      if (isUndefinedOrNull(path.node.start) || isUndefinedOrNull(path.node.end))
        return

      if (cursorRelativeOffset < path.node.start || cursorRelativeOffset > path.node.end)
        return path.skip()

      if (selection.start.isEqual(document.positionAt(path.node.start + ast.start))) {
        newSelection = new Selection(
          selection.start,
          document.positionAt(path.node.end + ast.start),
        )
        path.stop()
      }
    },
  })
  return newSelection
}

parser.title = 'js-import-export'
