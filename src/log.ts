import { window } from 'vscode'

const channel = window.createOutputChannel('Smart Select')

export function log(message: string) {
  channel.appendLine(message)
}
