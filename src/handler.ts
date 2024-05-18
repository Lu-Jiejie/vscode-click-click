import type { Selection, TextDocument } from 'vscode'
import { createContext } from './context'
import { astParser } from './ast'
import { ruleParser } from './rules'

export async function getNewSelection(document: TextDocument, preSelection: Selection, selection: Selection) {
  const context = createContext(document, preSelection, selection)
  // get ast
  await astParser(context)
  // parse rules
  const newSelection = ruleParser(context)
  return newSelection
}
