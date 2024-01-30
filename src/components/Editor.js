import { useEffect, useState } from "react";
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';

const Editor = () => {
    const [id, setid] = useState('realtimeeditor');
    useEffect(() => {

        const init = async () => {
            console.log('called');
            console.log(`${id}`);
            Codemirror.fromTextArea(
            document.getElementById(`${id}`), 
            {
                mode: { name: "javascript", json: true },
                theme: 'dracula',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true
            });
        }
        init();
        return () => {
            console.log(
                document.getElementById('realtimeeditor'));
            const elementToRemove= document.getElementById('realtimeeditor');
            if (elementToRemove) {
                elementToRemove.remove();
            }
            
           
        }

    }, []);
    return <textarea id={`${id}`}></textarea>

}
export default Editor;