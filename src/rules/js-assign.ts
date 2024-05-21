import traverse from '@babel/traverse'
import { Selection } from 'vscode'
import { findAst } from '../ast'
import type { Context } from '../types'
import { isUndefinedOrNull } from '../utils'

const operatorRegExp = /(=|\+=|-=|\*=|\/=|%=|\*\*=|&=|\|=|\^=|<<=|>>=|>>>=)/

export default function parser(context: Context) {
  const { asts, cursorOffset, cursorPosition, document } = context
  const ast = findAst(asts, 'JS', cursorOffset)

  if (!ast)
    return

  const operatorRange = document.getWordRangeAtPosition(cursorPosition, operatorRegExp)
  if (!operatorRange)
    return

  const operatorRelativeOffset = {
    start: document.offsetAt(operatorRange.start) - ast.start,
    end: document.offsetAt(operatorRange.end) - ast.start,
  }
  const cursorRelativeOffset = cursorOffset - ast.start
  let newSelection: Selection | undefined
  traverse(ast.astRoot, {
    enter(path) {
      if (isUndefinedOrNull(path.node.start) || isUndefinedOrNull(path.node.end))
        return

      if (cursorRelativeOffset < path.node.start || cursorRelativeOffset > path.node.end)
        return path.skip()

      /**
       *          ▼
       *  const a = 1, b = 2
       */
      if (path.node.type === 'VariableDeclaration') {
        // only one variable
        if (path.node.declarations.length === 1) {
          const declaration = path.node.declarations[0]

          if (declaration.id.end! <= operatorRelativeOffset.start && declaration.init!.start! >= operatorRelativeOffset.end) {
            newSelection = new Selection(
              document.positionAt(path.node.start + ast.start),
              document.positionAt(path.node.end + ast.start),
            )
            path.stop()
          }
        }
        else {
          path.node.declarations.forEach((declaration) => {
            if (isUndefinedOrNull(declaration.init))
              return

            if (declaration.id.end! <= operatorRelativeOffset.start && declaration.init.start! >= operatorRelativeOffset.end) {
              newSelection = new Selection(
                document.positionAt(declaration.start! + ast.start),
                document.positionAt(declaration.end! + ast.start),
              )
              path.stop()
            }
          })
        }
      }
      /**
       *    ▼
       *  a *= 2
       *                ▼
       * function foo(a = 1) {}
       */
      else if (path.node.type === 'AssignmentExpression' || path.node.type === 'AssignmentPattern') {
        if (path.node.left.end! <= operatorRelativeOffset.start && path.node.right.start! >= operatorRelativeOffset.end) {
          newSelection = new Selection(
            document.positionAt(path.node.start + ast.start),
            document.positionAt(path.node.end + ast.start),
          )
          path.stop()
        }
      }
      /**
       *         ▼
       *  type A = string
       */
      else if (path.node.type === 'TSTypeAliasDeclaration') {
        if (path.node.id.end! <= operatorRelativeOffset.start && path.node.typeAnnotation!.start! >= operatorRelativeOffset.end) {
          newSelection = new Selection(
            document.positionAt(path.node.start + ast.start),
            document.positionAt(path.node.end + ast.start),
          )
          path.stop()
        }
      }
    },
  })
  return newSelection
}
parser.title = 'js-assign'
