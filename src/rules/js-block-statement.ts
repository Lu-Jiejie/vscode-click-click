import traverse from '@babel/traverse'
import { Selection } from 'vscode'
import { findAst } from '../ast'
import type { Context, NodeType } from '../types'
import { isUndefinedOrNull } from '../utils'

const expectedTypes: NodeType[] = [
  'TryStatement',
  'CatchClause',
  'DoWhileStatement',
  'ForStatement',
  'ForInStatement',
  'ForOfStatement',
  'WhileStatement',
  'IfStatement',
  'SwitchStatement',
  'SwitchCase',
  'FunctionDeclaration',
  'ClassDeclaration',
]

const expectedKeywords = [
  'try',
  'catch',
  'finally',
  'do',
  'for',
  'while',
  'if',
  'else',
  'switch',
  'case',
  'default',
  'function',
  'class',
]

export default function parser(context: Context) {
  const { asts, cursorOffset, selection, document } = context
  const ast = findAst(asts, 'JS', cursorOffset)

  if (!ast)
    return
  if (!expectedKeywords.includes(document.getText(selection)))
    return

  const selectionRelativeOffset = {
    start: document.offsetAt(selection.start) - ast.start,
    end: document.offsetAt(selection.end) - ast.start,
  }
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

      /**
       *         ▼
       * if ... else ...
       */
      if (path.node.type === 'IfStatement'
        && path.node.alternate
        && path.node.consequent.end! < selectionRelativeOffset.start
        && path.node.alternate.start! > selectionRelativeOffset.end
      ) {
        newSelection = new Selection(
          selection.start,
          document.positionAt(path.node.alternate.end! + ast.start),
        )
        path.stop()
      }
      /**
       *                     ▼
       * try ... catch ... finally
       */
      else if (
        path.node.type === 'TryStatement'
        && path.node.finalizer
        && (path.node.handler?.end ?? path.node.block.end!) < selectionRelativeOffset.start
        && path.node.finalizer.start! > selectionRelativeOffset.end
      ) {
        newSelection = new Selection(
          selection.start,
          document.positionAt(path.node.finalizer.end! + ast.start),
        )
        path.stop()
      }
      else if (selection.start.isEqual(document.positionAt(path.node.start + ast.start))) {
        newSelection = new Selection(
          document.positionAt(path.node.start + ast.start),
          document.positionAt(path.node.end + ast.start),
        )
        path.stop()
      }
    },
  })

  return newSelection
}

parser.title = 'js-block'
