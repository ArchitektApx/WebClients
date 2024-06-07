import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { EditorToClientBridge } from './Bridge/EditorToClientBridge'
import { Editor } from './Editor'
import {
  BroadcastSources,
  ClientRequiresEditorMethods,
  CommentMarkNodeChangeData,
  CommentsEvent,
  ConvertibleDataType,
  DocState,
  EditorEditableChangeEvent,
  LiveCommentsEvent,
  RtsMessagePayload,
  YDocMap,
} from '@proton/docs-shared'
import { Doc as YDoc } from 'yjs'
import { Icons } from '@proton/components'
import { InternalEventBus } from '@proton/docs-shared'
import { InternalEventBusProvider } from './InternalEventBusProvider'
import { CircleLoader } from '@proton/atoms/CircleLoader'
import { c } from 'ttag'
import { THEME_ID } from '@proton/components/containers/themes/ThemeProvider'
import useEffectOnce from '@proton/hooks/useEffectOnce'
import locales from './locales'
import { setTtagLocales } from '@proton/shared/lib/i18n/locales'
import { LexicalEditor } from 'lexical'
import { SHOW_ALL_COMMENTS_COMMAND } from './Commands'

type Props = {
  isViewOnly: boolean
}

type InitialConfig = {
  initialData?: {
    data: Uint8Array
    type: ConvertibleDataType
  }
  documentId: string
  username: string
}

export function App({ isViewOnly = false }: Props) {
  const viewOnlyDocumentId = useId()

  const [initialConfig, setInitialConfig] = useState<InitialConfig | null>(
    isViewOnly
      ? {
          documentId: viewOnlyDocumentId,
          username: '',
        }
      : null,
  )
  const [bridge] = useState(() => new EditorToClientBridge(window.parent))
  const [docState, setDocState] = useState<DocState | null>(null)
  const [eventBus] = useState(() => new InternalEventBus())
  const [editorHidden, setEditorHidden] = useState(true)

  useEffectOnce(() => {
    setTtagLocales(locales)
  })

  const editorRef = useRef<LexicalEditor | null>(null)
  const setEditorRef = useCallback((instance: LexicalEditor | null) => {
    editorRef.current = instance
  }, [])

  const docMap = useMemo(() => {
    const map: YDocMap = new Map<string, YDoc>()
    return map
  }, [])

  useEffect(() => {
    if (docState) {
      return
    }

    const newDocState = new DocState({
      docStateRequestsPropagationOfUpdate: (
        message: RtsMessagePayload,
        originator: string,
        debugSource: BroadcastSources,
      ) => {
        bridge
          .getClientInvoker()
          .editorRequestsPropagationOfUpdate(message, originator, debugSource)
          .catch((e: Error) => {
            void bridge.getClientInvoker().reportError(e)
          })
      },
      handleAwarenessStateUpdate: (states) => {
        bridge
          .getClientInvoker()
          .handleAwarenessStateUpdate(states)
          .catch((e: Error) => {
            void bridge.getClientInvoker().reportError(e)
          })
      },
    })

    setDocState(newDocState)

    if (isViewOnly) {
      docMap.set(viewOnlyDocumentId, newDocState.getDoc())
    }

    const requestHandler: ClientRequiresEditorMethods = {
      async receiveMessage(message: RtsMessagePayload) {
        void newDocState.receiveMessage(message)
      },

      async showEditor() {
        setEditorHidden(false)
      },

      async showCommentsPanel() {
        const editor = editorRef.current
        if (!editor) {
          return
        }
        editor.dispatchCommand(SHOW_ALL_COMMENTS_COMMAND, undefined)
      },

      async receiveThemeChanges(styles: string) {
        const themeStylesheet = document.getElementById(THEME_ID)

        if (!themeStylesheet) {
          return
        }

        themeStylesheet.innerHTML = styles
      },

      async getClientId() {
        return newDocState.getClientId()
      },

      async performClosingCeremony() {
        void newDocState.performOpeningCeremony()
      },

      async performOpeningCeremony() {
        void newDocState.performClosingCeremony()
      },

      async getDocumentState() {
        return newDocState.getDocState()
      },

      async handleCommentsChange() {
        eventBus.publish({
          type: CommentsEvent.CommentsChanged,
          payload: undefined,
        })
      },

      async handleTypingStatusChange(threadId: string) {
        eventBus.publish({
          type: LiveCommentsEvent.TypingStatusChange,
          payload: {
            threadId,
          },
        })
      },

      async handleCreateCommentMarkNode(markID: string) {
        eventBus.publish<CommentMarkNodeChangeData>({
          type: CommentsEvent.CreateMarkNode,
          payload: {
            markID,
          },
        })
      },

      async handleRemoveCommentMarkNode(markID: string) {
        eventBus.publish<CommentMarkNodeChangeData>({
          type: CommentsEvent.RemoveMarkNode,
          payload: {
            markID,
          },
        })
      },

      async handleResolveCommentMarkNode(markID: string) {
        eventBus.publish<CommentMarkNodeChangeData>({
          type: CommentsEvent.ResolveMarkNode,
          payload: {
            markID,
          },
        })
      },

      async handleUnresolveCommentMarkNode(markID: string) {
        eventBus.publish<CommentMarkNodeChangeData>({
          type: CommentsEvent.UnresolveMarkNode,
          payload: {
            markID,
          },
        })
      },

      async changeEditingAllowance(allow) {
        newDocState.canBeEditable = allow
        eventBus.publish({
          type: EditorEditableChangeEvent,
          payload: {
            editable: allow,
          },
        })
      },

      async initializeEditor(
        documentId: string,
        username: string,
        initialData?: Uint8Array,
        initialDataType?: ConvertibleDataType,
      ) {
        docMap.set(documentId, newDocState.getDoc())

        if (initialData && initialDataType) {
          setInitialConfig({ documentId, username, initialData: { data: initialData, type: initialDataType } })
        } else {
          setInitialConfig({ documentId, username })
        }
      },

      async broadcastPresenceState() {
        newDocState.broadcastPresenceState()
      },
    }

    bridge.setRequestHandler(requestHandler)
  }, [bridge, docMap, docState, eventBus, isViewOnly, viewOnlyDocumentId])

  if (!initialConfig || !docState) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <CircleLoader size="large" />
        {c('Info').t`Waiting for editor initialization...`}
      </div>
    )
  }

  return (
    <div className="relative grid h-full w-full grid-cols-[3fr_max(20vw,300px)] grid-rows-[min-content_1fr] overflow-hidden bg-[white]">
      <InternalEventBusProvider eventBus={eventBus}>
        <Editor
          clientInvoker={bridge.getClientInvoker()}
          docMap={docMap}
          docState={docState}
          hidden={editorHidden}
          documentId={initialConfig.documentId}
          injectWithNewContent={initialConfig.initialData}
          username={initialConfig.username}
          isViewOnly={isViewOnly}
          onEditorReadyToReceiveUpdates={() => {
            docState.onEditorReadyToReceiveUpdates()
          }}
          setEditorRef={setEditorRef}
        />
      </InternalEventBusProvider>
      <Icons />
    </div>
  )
}
