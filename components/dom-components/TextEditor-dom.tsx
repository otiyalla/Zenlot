"use dom";

import React from "react";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListNode, ListItemNode } from '@lexical/list';
import DarkTheme from "./DarkTheme";
import LightTheme from "./LightTheme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import { $getRoot, EditorState, LexicalEditor } from "lexical";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTranslate } from "@/hooks/useTranslate";

import "./styles.css";

function onError(error: Error) {
  console.error('editor error: ', error)
}

const editorConfig = {
  namespace: "Zenlot Journal",
  nodes: [ListNode, ListItemNode],
  onError,
  theme: LightTheme,
  editorState: ''
};
export default React.memo(function Editor({
  setPlainText,
  setEditorState,
  initialEditorState,
}: {
  setPlainText: React.Dispatch<React.SetStateAction<string>>;
  setEditorState: React.Dispatch<React.SetStateAction<string | null>>;
  dom: import('expo/dom').DOMProps
  initialEditorState?: string | null;
}) {
  const colorScheme = useColorScheme();
  const Theme = colorScheme === "dark" ? DarkTheme : LightTheme;
  editorConfig.theme = Theme;
  initialEditorState?.length ? editorConfig.editorState = initialEditorState : null;
  const { localize } = useTranslate();
  const placeholder = localize('placeholder.journal');

  return (
    <>
      <LexicalComposer initialConfig={editorConfig}>
        <div className={`editor-container-${colorScheme}`} >
          <div
            className={`toolbar-scrollable-${colorScheme}`}
            style={{
              overflowX: "auto",
              whiteSpace: "nowrap",
              maxWidth: "100%",
              marginBottom: "8px"
            }}
          >
            <ToolbarPlugin />
          </div>
          <div className={`editor-inner-${colorScheme}`} >
            <RichTextPlugin
              contentEditable={
          <ContentEditable
            className={`editor-input-${colorScheme}`}
            aria-placeholder={placeholder}
            placeholder={
              <div className={`editor-placeholder-${colorScheme}`}>{placeholder}</div>
            }
          />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin
              onChange={(editorState: EditorState, editor: LexicalEditor, tags: Set<string>): void => {
          editorState.read(() => {
            const root = $getRoot();
            const textContent = root.getTextContent();
            setPlainText(textContent);
          });
          setEditorState(JSON.stringify(editorState.toJSON()));
              }}
              ignoreHistoryMergeTagChange
              ignoreSelectionChange
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            {/* <TreeViewPlugin /> */}
          </div>
        </div>
      </LexicalComposer>
    </>
  );
});