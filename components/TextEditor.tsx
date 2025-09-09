
import EditorWeb from "@/components/dom-components/TextEditor-dom.web";
import EditorMobile from "@/components/dom-components/TextEditor-dom";
import React, { useEffect, useState } from "react";
import { View, Platform } from "react-native";
import  useNetwork  from "@/hooks/useNetwork";
import OfflineEditor from "./OfflineEditor";
import { useTrade } from "@/providers/TradeProvider";

let Editor: React.ComponentType<any>;

if (Platform.OS === 'web') Editor = EditorWeb;
else Editor = EditorMobile;

interface ITextEditor {
    
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


export default function TextEditor() {
    const { isOnline } = useNetwork();
    const [editorState, setEditorState] = useState<string | null>();
    const [plainText, setPlainText] = useState("");
    const initState = plainText.trim().length ? editorState : JSON.stringify(editorDefault);
    const { trade, setTrade } = useTrade();

    useEffect(()=> {
        const {editorState, plainText} = trade;
        if(plainText?.length){
            setPlainText(plainText);
        }
        if(editorState){
            setEditorState(editorState)
        }

    },[])

    useEffect(()=> {
        if(plainText.length !== trade?.plainText?.length){
            setTrade(prev => ({ ...prev, editorState, plainText}));
        }
    },[plainText]);

    const handleOnChange = (text: string, editor: string) => {
        setPlainText(text);
        setEditorState(editor);
    }
    
    return (
        <View style={{height: 250 }}>
            {isOnline ? 
                <Editor initialEditorState={initState} setPlainText={setPlainText} setEditorState={setEditorState} />
            :  <OfflineEditor initialValue={plainText} editor={editorState} onChange={handleOnChange} />
            }
        </View>
    );
}