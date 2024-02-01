import React, { useEffect, useRef } from "react";
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from "../action";


const Editor = ({ socketRef, roomId }) => {
    const editorRef = useRef(null);
    useEffect(() => {
        const init = () => {
            console.log('called');
            editorRef.current = Codemirror.fromTextArea(
                document.getElementById('realtimeeditor'),
                {
                    mode: { name: "javascript", json: true },
                    theme: 'dracula',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true
                }
            );
            
            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                if (!origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    })
                }
            })

            // 
        };

        init(); // Initialize the CodeMirror editor when the component mounts
        // Cleanup function
        return () => {
            if (editorRef.current) {
                editorRef.current.toTextArea(); // Convert the CodeMirror instance back to a textarea during unmount
            }
        };
    }, [roomId, socketRef]);

    useEffect(()=>{
        if(socketRef.current){
            
                socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                    console.log(code);
                    if (code !== null) {
                        editorRef.current.setValue(code);
                    }
                })
        }
    },[socketRef.current])
    return <textarea id='realtimeeditor' onChange={(e)=>{console.log(e.target.va);}}></textarea>;
};

export default Editor;
