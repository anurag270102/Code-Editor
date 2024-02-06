import React, { useEffect, useRef } from "react";
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from "../action";

const Editor = ({ socketRef, roomId }) => {
    console.log(socketRef)
    const editorRef = useRef(null);
        useEffect(() => {
            const initEditor = () => {
                const textarea = document.getElementById('realtimeeditor');
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
                console.log(editorRef.current);
                editorRef.current.on('change', (instance, changes) => {
                    const { origin } = changes;
                    const code = instance.getValue();
                    if (origin !== 'setValue') {
                        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                            roomId,
                            code,
                        });
                    }
                });
            };
            initEditor();
            return (() => {
                if (socketRef.current) {
                    socketRef.current.off(ACTIONS.JOINED);
                    socketRef.current.off(ACTIONS.DISCONNECTED);
                    // socketRef.current.disconnect();
                }
            })
        }, []);
        useEffect(()=>{
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                console.log(code);
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });
        },[])
    return <textarea id='realtimeeditor' name=""></textarea>;
};

export default Editor;
