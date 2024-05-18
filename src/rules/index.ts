import { log } from '../log'
import type { Context } from '../types'
import arrowFunctionParser from './arrow-function'

const parsers = [
  arrowFunctionParser,
]

export function ruleParser(context: Context) {
  for (const p of parsers) {
    const newSelection = p(context)
    if (newSelection) {
      log(`[ruleParser] ${p.title} ${newSelection.start.line}:${newSelection.start.character} => ${newSelection.end.line}:${newSelection.end.character}`)
      return newSelection
    }
  }
}
