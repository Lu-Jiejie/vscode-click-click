import { Selection } from 'vscode'
import traverse from '@babel/traverse'
import type { Context } from '../types'
import { filterAsts } from '../ast'
import { isUndefinedOrNull } from '../utils'

export function parser(context: Context) {
  const { asts: _asts, document, cursorPosition, cursorOffset } = context
  const ast = filterAsts(_asts, 'JS', cursorOffset)[0]

  if (!ast)
    return

  if (!document.getWordRangeAtPosition(cursorPosition, /=>/))
    return

  let newSelection: Selection | undefined
  traverse(ast.astRoot, {
    ArrowFunctionExpression(path) {
      if (newSelection)
        return

      if (isUndefinedOrNull(path.node.start) || isUndefinedOrNull(path.node.end))
        return

      if (cursorOffset - ast.start < path.node.start || cursorOffset - ast.start > path.node.end)
        return

      newSelection = new Selection(
        document.positionAt(path.node.start + ast.start),
        document.positionAt(path.node.end + ast.start),
      )
    },
  })

  return newSelection
}
