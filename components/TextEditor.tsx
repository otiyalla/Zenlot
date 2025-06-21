import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import EditorWeb from "@/components/dom-components/TextEditor-dom.web";
import EditorMobile from "@/components/dom-components/TextEditor-dom";
import React, { useState } from "react";
import { Text, View, Platform, ScrollView } from "react-native";
import { WebView } from 'react-native-webview';

let Editor: React.ComponentType<any>;

if (Platform.OS === 'web') Editor = EditorWeb;
else Editor = EditorMobile;

interface ITextEditor {
    
}

const editorDefault = {
    "root":{
    "children":[
        {"children":[],
            "direction":null,"format":"",
            "indent":0,"type":"paragraph",
            "version":1,"textFormat":0,
            "textStyle":""
        }
    ],"direction":null,"format":"",
        "indent":0,"type":"root","version":1
    }
}

export default function TextEditor() {
  const [editorState, setEditorState] = useState<string | null>();
  const [plainText, setPlainText] = useState("");
  const wordCount = editorState?.split(" ").length ?? 0;
  const initState = JSON.stringify(editorDefault)
  
  console.log(editorState);
  
  
  return (
    <>
        <Editor initialEditorState={initState} setPlainText={setPlainText} setEditorState={setEditorState} />
    </>
  );
}