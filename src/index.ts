import { TextEditorSelectionChangeKind, window, workspace } from 'vscode'
import type { ExtensionContext, Selection, TextEditor } from 'vscode'
import { getNewSelection } from './handler'
import { astCache } from './ast'

const DOUBLE_CLICK_INTERVAL = 300
const TRIGGER_DELAY = 0

export function activate(ext: ExtensionContext) {
  let preClickTimestamp: number = 0
  let preTextEditor: TextEditor | undefined
  let preSelection: Selection | undefined
  let timer: NodeJS.Timeout | undefined

  window.showInformationMessage('Init')

  ext.subscriptions.push(
    window.onDidChangeTextEditorSelection((e) => {
      clearTimeout(timer)

      if (e.kind !== TextEditorSelectionChangeKind.Mouse)
        return

      // backup pre
      const _preTextEditor = preTextEditor
      const _preSelection = preSelection
      const _preClickTimestamp = preClickTimestamp

      // update pre
      preTextEditor = e.textEditor
      preSelection = e.selections[0]
      preClickTimestamp = Date.now()

      // check if the double click is valid
      if (
        Date.now() - _preClickTimestamp > DOUBLE_CLICK_INTERVAL
        || _preTextEditor !== e.textEditor
        || !_preSelection?.isEmpty
        || e.selections.length !== 1
        || _preSelection.start.line !== e.selections[0].start.line
      )
        return

      timer = setTimeout(async () => {
        const newSelection = await getNewSelection(e.textEditor.document, _preSelection, e.selections[0])
        if (!newSelection)
          return

        e.textEditor.selection = newSelection
      }, TRIGGER_DELAY)
    }),

    // clear cache when file content changes
    workspace.onDidChangeTextDocument((e) => {
      astCache.delete(e.document.uri.fsPath)
    }),
  )
}

export function deactivate() {

}
