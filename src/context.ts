import type { Position, Selection, TextDocument } from 'vscode'
import { Range } from 'vscode'
import type { Context } from './types'
import { astCache } from './ast'

function getNewPosition(document: TextDocument, position: Position, posOffset: number) {
  const newOffset = document.offsetAt(position) + posOffset
  return document.positionAt(newOffset)
}

export function createContext(document: TextDocument, preSelection: Selection, selection: Selection): Context {
  const cursorPosition = preSelection.start
  const cursorOffset = document.offsetAt(cursorPosition)

  const leftChar = document.getText(new Range(getNewPosition(document, cursorPosition, -1), cursorPosition))
  const rightChar = document.getText(new Range(cursorPosition, getNewPosition(document, cursorPosition, 1)))

  if (!astCache.has(document.uri.fsPath))
    astCache.set(document.uri.fsPath, [])
  const asts = astCache.get(document.uri.fsPath)!

  return {
    document,
    asts,
    cursorPosition,
    cursorOffset,
    selection,
    leftChar,
    rightChar,
  }
}
