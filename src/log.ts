import { window } from 'vscode'

const channel = window.createOutputChannel('Click Click')

export function log(message: string) {
  channel.appendLine(message)
}
