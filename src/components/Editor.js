import React, { useEffect, useRef, useState } from "react";
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from "../action";

const Editor = ({ socketRef, roomId }) => {
    const editorRef = useRef(null);
    const [a, seta] = useState(true);
    useEffect(() => {

        const initEditor = () => {
            console.log('called');
            const textarea = document.getElementById('realtimeeditor');
            if (a) {
                editorRef.current = Codemirror.fromTextArea(
                    textarea,
                    {
                        mode: { name: "javascript", json: true },
                        theme: 'dracula',
                        autoCloseTags: true,
                        autoCloseBrackets: true,
                        lineNumbers: true
                    }
                );
                seta(false);
            }
            const handleChange = (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    });
                }
            };
            editorRef.current.on('change', handleChange);

            if (socketRef.current) {
                socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                    if (code !== null) {
                        editorRef.current.setValue(code);
                    }
                });
            }
        };

        return (() => {initEditor();
            if (socketRef.current) {
                
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
                // socketRef.current.disconnect();
            }
        })
    },);
    return <textarea id='realtimeeditor' name=""></textarea>;
};

export default Editor;
