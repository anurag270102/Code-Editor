import React, { useEffect, useRef } from "react";
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from "../action";

const Editor = () => {
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
            editorRef.current.on('change',(instance,change)=>{
                // const {origin}
            })
        };

        init(); // Initialize the CodeMirror editor when the component mounts
        // Cleanup function
        return () => {
            if (editorRef.current) {
                editorRef.current.toTextArea(); // Convert the CodeMirror instance back to a textarea during unmount
            }
        };
    }, []);

    return <textarea id='realtimeeditor'></textarea>;
};

export default Editor;
