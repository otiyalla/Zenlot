
import * as React from 'react';
const { AutoFocusPlugin } = require("@lexical/react/LexicalAutoFocusPlugin");
const { LexicalComposer } = require("@lexical/react/LexicalComposer");
const { ContentEditable } = require("@lexical/react/LexicalContentEditable");
const { LexicalErrorBoundary } = require("@lexical/react/LexicalErrorBoundary");
const { HistoryPlugin } = require("@lexical/react/LexicalHistoryPlugin");
const { RichTextPlugin } = require("@lexical/react/LexicalRichTextPlugin");
const { OnChangePlugin } = require("@lexical/react/LexicalOnChangePlugin");

const DarkTheme = require("./DarkTheme").default;
const LightTheme = require("./LightTheme").default;
const ToolbarPlugin = require("./plugins/ToolbarPluginWeb").default;
//const TreeViewPlugin = require("./plugins/TreeViewPlugin").default;
const { $getRoot, isHTMLElement  } = require("lexical");
import type {
  EditorState,
  LexicalEditor,
} from "lexical";
const { useColorScheme } = require("@/hooks/useColorScheme");
const { useTranslate }= require("@/hooks/useTranslate");
import "./styles.css";

function onError(error: Error) {
  console.error('editor error: ', error)
}

const editorConfig = {
  namespace: "Zenlot Journal",
  nodes: [],
  // Handling of errors during update
  onError,
  // The editor theme
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
  !!initialEditorState?.length ? editorConfig.editorState = initialEditorState : null;
  const { localize } = useTranslate();
  const placeholder = localize('placeholder.journal');
  
  return (
    <>
      <LexicalComposer initialConfig={editorConfig}>
        <div className={`editor-container-${colorScheme}`}>
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
          <div className={`editor-inner-${colorScheme}`}>
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
              onChange={(editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => {
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