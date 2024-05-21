import type { Position, Selection, TextDocument } from 'vscode'
import type { ParseResult as AstJSRoot } from '@babel/parser'
import type { File, Node } from '@babel/types'
import type { HTMLElement } from 'node-html-parser'

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
  astRoot: AstJSRoot<File>
}

export interface AstHTML {
  type: 'HTML'
  start: number
  end: number
  astRoot: HTMLElement
}

export type Ast = AstJS | AstHTML

export type NodeType = Node['type']
