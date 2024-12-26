import React, { useEffect, useRef } from 'react';
import MonacoEditor  from '@monaco-editor/react';
import ACTIONS from '../Actions';

const Editor = ({ socketRef, roomId, onCodeChange }) => {
    const editorRef = useRef(null);

    // Initialize editor and set up event listeners
    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;

        // Add change listener to detect code changes
        editor.onDidChangeModelContent(() => {
            const code = editor.getValue();
            onCodeChange(code);
            
            if (socketRef.current) {
                socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                    roomId,
                    code,
                });
            }
        });
    };

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null && editorRef.current) {
                    const currentCode = editorRef.current.getValue();
                    if (currentCode !== code) {
                        editorRef.current.setValue(code);
                    }
                }
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.off(ACTIONS.CODE_CHANGE);
            }
        };
    }, [socketRef.current]);

    return (
        <MonacoEditor
            height="75vh"
            defaultLanguage="javascript"
            defaultValue="// Start coding..."
            theme="vs-dark"
            onMount={handleEditorDidMount}
            options={{
                autoClosingBrackets: 'always',
                automaticLayout: true,
                formatOnType: true,
                lineNumbers: 'on',
            }}
        />
    );
};

export default Editor;

