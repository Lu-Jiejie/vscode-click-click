import type { Selection, TextDocument } from 'vscode'
import { createContext } from './context'
import { astParser } from './ast'
import { ruleParser } from './rules'
import { log } from './log'

export async function getNewSelection(document: TextDocument, preSelection: Selection, selection: Selection) {
  const context = createContext(document, preSelection, selection)
  // get ast
  await astParser(context)
  // parse rules
  try {
    const newSelection = ruleParser(context)
    return newSelection
  }
  catch (error: any) {
    log(error)
  }
}
