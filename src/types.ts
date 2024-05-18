import type { Position, Selection, TextDocument } from 'vscode'
import type { ParseResult as AstJSRoot } from '@babel/parser'

export interface Context {
  document: TextDocument
  asts: Ast[]
  cursorPosition: Position
  cursorOffset: number
  selection: Selection
  leftChar: string
  rightChar: string
}

export interface AstJS {
  type: 'JS'
  start: number
  end: number
  astRoot: AstJSRoot<any>
}

export interface AstHTML {
  type: 'HTML'
  start: number
  end: number
  astRoot: any
}

export type Ast = AstJS | AstHTML
