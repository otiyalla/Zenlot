import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { TextInputComponent as TextInput} from "@/components/atoms/TextInput";
import { TextComponent as Text } from "@/components/atoms/Text";
import { useTranslate } from "@/hooks/useTranslate";

type EditorState = {
    root: RootEditorNode;
};

type RootEditorNode = {
    children: EditorNode[];
    direction: null | string | 'ltr';
    format: string;
    indent: number;
    type: 'root' | string;
    version: number;
};

type EditorNode = {
    children: EditorNodeChildren[];
    direction: null | string | 'ltr';
    format: string;
    indent: number;
    type: string | 'paragraph';
    version: number;
    textFormat: number;
    textStyle: string;
};

type EditorNodeChildren = {
    detail: number;
    mode: string | 'normal';
    format: number | 0;
    style: string;
    text: string;
    type: string | 'text';
    version: number;
};

const editorDefaultState: EditorState = {
    root: {
        children: [
            {
                children: [],
                direction: null,
                format: "",
                indent: 0,
                type: "paragraph",
                version: 1,
                textFormat: 0,
                textStyle: "",
            },
        ],
        direction: null,
        format: "",
        indent: 0,
        type: "root",
        version: 1,
    },
};

function plainTextToEditorState(
    text: string,
    prevEditorState?: EditorState | string | null
): EditorState {
    // Parse prevEditorState if it's a string
    let prevState: EditorState | null = null;
    if (typeof prevEditorState === "string" && prevEditorState.trim() !== "") {
        try {
            prevState = JSON.parse(prevEditorState);
        } catch {
            prevState = null;
        }
    } else if (prevEditorState && typeof prevEditorState === "object") {
        prevState = prevEditorState;
    }

    const paragraphs = text.split('\n');

    // If no previous state, fallback to default behavior
    if (!prevState) {
        return {
            root: {
                direction: "ltr",
                format: "",
                indent: 0,
                type: "root",
                version: 1,
                children: paragraphs.map((line) => ({
                    children: [
                        {
                            detail: 0,
                            mode: "normal",
                            format: 0,
                            style: "",
                            text: line,
                            type: "text",
                            version: 1,
                        },
                    ],
                    direction: "ltr",
                    format: "",
                    indent: 0,
                    type: "paragraph",
                    version: 1,
                    textFormat: 0,
                    textStyle: "",
                })),
            },
        };
    }

    // Try to preserve properties of existing editor state
    const prevParagraphs = prevState.root.children || [];
    const newChildren = paragraphs.map((line, idx) => {
        const prevParagraph = prevParagraphs[idx];
        if (prevParagraph && prevParagraph.children && prevParagraph.children[0]) {
            // Only update text, preserve other properties
            return {
                ...prevParagraph,
                children: [
                    {
                        ...prevParagraph.children[0],
                        text: line,
                    },
                ],
            };
        } else {
            return {
                children: [
                    {
                        detail: 0,
                        mode: "normal",
                        format: 0,
                        style: "",
                        text: line,
                        type: "text",
                        version: 1,
                    },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "paragraph",
                version: 1,
                textFormat: 0,
                textStyle: "",
            };
        }
    });

    return {
        root: {
            ...prevState.root,
            children: newChildren,
        },
    };
}

function editorStateToPlainText(state: EditorState): string {
    const paragraph = state.root.children[0];
    if (!paragraph || !paragraph.children) return "";
    return paragraph.children.map(child => child.text).join("");
}

interface OfflineEditorProps {
    initialValue?: string;
    editor: string | null | undefined
    onChange?: (plainText: string, editorState: string) => void;
}

const OfflineEditor: React.FC<OfflineEditorProps> = ({
    initialValue = "",
    editor,
    onChange,
}) => {
    const [plainText, setPlainText] = useState(initialValue);
    const [editorState, setEditorState] = useState<EditorState>(
        plainTextToEditorState(initialValue, editor)
    );
    const { localize } = useTranslate();

    useEffect(() => {
        setEditorState(plainTextToEditorState(plainText));
        if (onChange) {
            const editor = plainTextToEditorState(plainText);
            onChange(plainText, JSON.stringify(editor));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plainText]);

    return (
        <View style={styles.container}>
            <TextInput
                value={plainText}
                onChangeText={setPlainText}
                multiline
                numberOfLines={6}
                style={styles.textInput}
                placeholder={localize('placeholder.journal')}
                textAlignVertical="top"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 10,
    },
    textInput: {
        fontSize: 16,
        minHeight: 200,
    },
});

export default OfflineEditor;