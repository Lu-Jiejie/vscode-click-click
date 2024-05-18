import type { Selection, TextDocument } from 'vscode'
import { createContext } from './context'
import { astParser } from './ast'
import { parser as arrowFunctionParser } from './rules/arrow-function'

export async function getNewSelection(document: TextDocument, preSelection: Selection, selection: Selection) {
  const context = createContext(document, preSelection, selection)
  // get ast
  await astParser(context)
  // parse rules
  const newSelection = arrowFunctionParser(context)
  return newSelection
}
