import { useEffect } from "react";
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';

const Editor = () => {
    useEffect(() => {
        async function init() {
            Codemirror.fromTextArea(document.getElementById('realtimeeditor'), {
                mode: { name: "javascript", json: true },
                theme: 'dracula',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true
            })
        }
        
        return () => {
            init();
          };
        
    }, []);   
    return (
    <div>
        <textarea id="realtimeeditor"></textarea>
    </div>
    );
}
export default Editor;