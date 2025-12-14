
import EditorWeb from "@/components/dom-components/TextEditor-dom.web";
import EditorMobile from "@/components/dom-components/TextEditor-dom";
import React, { useEffect, useState } from "react";
import { View, Platform } from "react-native";
import { useNetwork }  from "@/hooks/useNetwork";
import { OfflineEditor } from "./OfflineEditor";

let Editor: React.ComponentType<any>;

if (Platform.OS === 'web') Editor = EditorWeb;
else Editor = EditorMobile;

interface ITextEditor {
    plainText?: string | null;
    editorState?: string | null;
    onChange?: (plainText: string, editorState: string) => void;
}

const editorDefault = {
    "root":{
        "children":[
            {
                "children":[],
                "direction":null,
                "format":"",
                "indent":0,
                "type":"paragraph",
                "version":1,
                "textFormat":0,
                "textStyle":""
            }
        ],
        "direction":null,
        "format":"",
        "indent":0,
        "type":"root",
        "version":1
    }
} 


export const TextEditor: React.FC<ITextEditor> = ({ 
    plainText = "", 
    editorState = null,
    onChange,
}) => {
    const { isOnline } = useNetwork();
    const [internalPlainText, setInternalPlainText] = useState<string>(plainText || "");
    const [internalEditorState, setInternalEditorState] = useState<string | null>(editorState);

    // Sync internal state with props when props change
    useEffect(() => {
        setInternalPlainText(plainText || "");
    }, [plainText]);

    useEffect(() => {
        setInternalEditorState(editorState);
    }, [editorState]);

    const initState = internalPlainText.trim().length ? internalEditorState : JSON.stringify(editorDefault);

    const handleEditorChange = (text: string, editor: string) => {
        setInternalPlainText(text);
        setInternalEditorState(editor);
        
        if (onChange) {
            onChange(text, editor);
        } else {
            console.warn('TextEditor: onChange callback not provided. Editor changes will not be persisted.');
        }
    }
    
    return (
        <View style={{height: 250 }}>
            {!isOnline ? 
                <Editor 
                    initialEditorState={initState} 
                    setPlainText={(text: string) => {
                        setInternalPlainText(text);
                        if (onChange) {
                            onChange(text, internalEditorState || JSON.stringify(editorDefault));
                        } else {
                            console.warn('TextEditor: onChange callback not provided. Editor changes will not be persisted.');
                        }
                    }}
                    setEditorState={(editor: string) => {
                        setInternalEditorState(editor);
                        if (onChange) {
                            onChange(internalPlainText, editor);
                        } else {
                            console.warn('TextEditor: onChange callback not provided. Editor changes will not be persisted.');
                        }
                    }}
                />
            :  <OfflineEditor 
                initialValue={internalPlainText} 
                editor={internalEditorState} 
                onChange={handleEditorChange} 
            />
            }
        </View>
    );
}