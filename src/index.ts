import type { ExtensionContext, Selection, TextEditor } from 'vscode'
import { TextEditorSelectionChangeKind, window, workspace } from 'vscode'
import { getNewSelection } from './handler'
import { astCache } from './ast'
import { expectedLanguageIds as jsLanguageIds } from './ast/js'

export function activate(ext: ExtensionContext) {
  let preClickTimestamp: number = 0
  let preTextEditor: TextEditor | undefined
  let preSelection: Selection | undefined
  let timer: NodeJS.Timeout | undefined

  ext.subscriptions.push(
    window.onDidChangeTextEditorSelection((e) => {
      const config = workspace.getConfiguration('smartSelect')

      // shut down timer when selection changes
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

      // check the languageId
      if (![...jsLanguageIds, ...config.get<string[]>('htmlLanguageIds')!].includes(e.textEditor.document.languageId))
        return
      // check if the double click is valid
      if (
        Date.now() - _preClickTimestamp > config.get<number>('doubleClickInterval')!
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
      }, config.get<number>('triggerDelay')!)
    }),

    // clear cache when file content changes
    workspace.onDidChangeTextDocument((e) => {
      astCache.delete(e.document.uri.fsPath)
    }),

    workspace.onDidChangeConfiguration((e) => {
      e.affectsConfiguration('')
    }),
  )
}

export function deactivate() {

}
