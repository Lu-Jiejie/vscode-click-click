import { workspace } from 'vscode'
import { log } from '../log'
import type { Context } from '../types'

import jsArrowFunctionParser from './js-arrow-function'
import jsAssignParser from './js-assign'
import jsBlockStatementParser from './js-block-statement'
import jsBlockParser from './js-block'
import jsImportExportParser from './js-import-export'

const parsers = [
  jsArrowFunctionParser,
  jsAssignParser,
  jsBlockStatementParser,
  jsBlockParser,
  jsImportExportParser,
]

export function ruleParser(context: Context) {
  const config = workspace.getConfiguration('smartSelect')
  const rules = config.get<Record<string, boolean>>('rules')!

  for (const parser of parsers) {
    if (rules[parser.title] === false)
      continue

    const newSelection = parser(context)
    if (newSelection) {
      log(`[${parser.title}] ${newSelection.start.line}:${newSelection.start.character} => ${newSelection.end.line}:${newSelection.end.character}`)
      return newSelection
    }
  }
}
