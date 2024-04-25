import React, { useEffect, useRef } from "react";
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/theme/abcdef.css';
import 'codemirror/theme/bespin.css';
import 'codemirror/theme/ambiance.css';
import 'codemirror/theme/abbott.css';
import 'codemirror/theme/3024-day.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/ttcn.css';
import 'codemirror/theme/mdn-like.css';
import 'codemirror/theme/idea.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/blackboard.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from "../action";

const Editor = ({ socketRef, roomId,oncodechange }) => {
   // console.log(socketRef)
    const editorRef = useRef(null);
    useEffect(() => {
        // console.log('called');
        const initEditor = async () => {
            const textarea = document.getElementById('realtimeeditor');
            editorRef.current = Codemirror.fromTextArea(
                textarea,
                {
                    mode: { name: "javascript", json: true },
                    theme: 'drakula',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            );
            setInterval(()=>{
                 socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                    if (code !== null) {
                        editorRef.current.setValue(code);
                    }
                });
            },1000)
            // console.log(editorRef.current);
            await editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                oncodechange(code);
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
                socketRef.current.off(ACTIONS.CODE_CHANGE);
                // eslint-disable-next-line react-hooks/exhaustive-deps
                socketRef.current.disconnect();
            }
        });
    }, [roomId, socketRef]);
    return ([
        <textarea id='realtimeeditor' name=""></textarea>
    ])

};
export default Editor;
