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
        const initEditor = () => {
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

            return () => {
                if (editorRef.current) {
                    editorRef.current.off('change', handleChange);
                    editorRef.current.toTextArea();
                }
            };
        };
        return (() => {
            initEditor();
        })



    }, [roomId, socketRef]);

    useEffect(() => {
       
        if (socketRef.current) {
            console.log(ACTIONS.CODE_CHANGE);
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({e}) => {
                console.log(e);
                // if (code !== null) {
                //     editorRef.current.setValue(code);
                // }
            });
        }
        return(()=>{
            if(socketRef.current){
                socketRef.current.disconnect();
            }
        })
    },[]);

    return <textarea id='realtimeeditor'></textarea>;
};

export default Editor;
