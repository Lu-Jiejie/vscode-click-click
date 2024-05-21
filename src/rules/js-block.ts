import traverse from '@babel/traverse'
import { Selection } from 'vscode'
import { findAst } from '../ast'
import type { Context } from '../types'
import { isUndefinedOrNull } from '../utils'

export default function parser(context: Context) {
  const { asts, cursorOffset, cursorPosition, document } = context

  const ast = findAst(asts, 'JS', cursorOffset)

  if (!ast)
    return
  if (!document.getWordRangeAtPosition(cursorPosition, /\{/))
    return

  const cursorRelativeOffset = cursorOffset - ast.start
  let newSelection: Selection | undefined
  traverse(ast.astRoot, {
    enter(path) {
      if (path.node.type !== 'BlockStatement')
        return

      if (isUndefinedOrNull(path.node.start) || isUndefinedOrNull(path.node.end))
        return

      if (cursorRelativeOffset < path.node.start || cursorRelativeOffset > path.node.end)
        return path.skip()

      if (path.node.start !== cursorRelativeOffset)
        return

      newSelection = new Selection(
        document.positionAt(path.node.start + ast.start),
        document.positionAt(path.node.end + ast.start),
      )
      path.stop()
    },
  })

  return newSelection
}

parser.title = 'js-block'
