import { log } from '../log'
import type { Context } from '../types'

import jsArrowFunctionParser from './js-arrow-function'
import jsAssignParser from './js-assign'
import jsBlockParser from './js-block'

const parsers = [
  jsArrowFunctionParser,
  jsAssignParser,
  jsBlockParser,
]

export function ruleParser(context: Context) {
  for (const p of parsers) {
    const newSelection = p(context)
    if (newSelection) {
      log(`[${p.title}] ${newSelection.start.line}:${newSelection.start.character} => ${newSelection.end.line}:${newSelection.end.character}`)
      return newSelection
    }
  }
}
