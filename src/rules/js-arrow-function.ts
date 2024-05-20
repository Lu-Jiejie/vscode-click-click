import { Selection } from 'vscode'
import traverse from '@babel/traverse'
import type { Context } from '../types'
import { filterAsts } from '../ast'
import { isUndefinedOrNull } from '../utils'

export default function parser(context: Context) {
  const { asts, document, cursorOffset, selection } = context
  const ast = filterAsts(asts, 'JS', cursorOffset)[0]

  if (!ast)
    return

  // if (!document.getWordRangeAtPosition(cursorPosition, /=>/))
  //   return

  if (document.getText(selection) !== '=>')
    return

  const cursorRelativeOffset = cursorOffset - ast.start
  let newSelection: Selection | undefined
  traverse(ast.astRoot, {
    ArrowFunctionExpression(path) {
      if (isUndefinedOrNull(path.node.start) || isUndefinedOrNull(path.node.end))
        return

      if (cursorRelativeOffset < path.node.start || cursorRelativeOffset > path.node.end)
        return path.skip()

      newSelection = new Selection(
        document.positionAt(path.node.start + ast.start),
        document.positionAt(path.node.end + ast.start),
      )
    },
  })

  return newSelection
}

parser.title = 'js-arrow-function'
