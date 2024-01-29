import Client from "../components/Client";
import Editor from "../components/Editor";
import { useEffect, useRef, useState } from "react";
import { initSocket } from "../socket";
// import ACTIONS from "../action";
// import { useLocation } from "react-router-dom";


const EditorHome = () => {
    // const location=useLocation();
    const socketRef = useRef(null);
    useEffect(() => {
        async function init() {
            socketRef.current = await initSocket();
            // sockerRef.current.emit(ACTIONS.JOIN,{
            //     roomId,
            //     username:location.state?.username,
            // });
        }
        init();
    }, []);
    //if change occure in data then component not rerednder that why use useref()
    const [clients,] = useState([
        { socketId: 1, username: 'anurag d' },
        { socketId: 2, username: 'manav d' },

    ]);


    return ([
        <div className="mainwrap">
            <div className="aside">
                <div className="asideinner">
                    <div className="logoeditor">
                        <h1 className="mainheading">StreamCode</h1>
                        <h4 className="subheading">Learn Write Share.</h4>
                    </div>
                    <h3>Connected</h3>
                    <div className="clientlist">
                        {
                            clients.map(client =>
                                <Client username={client.username} key={client.socketId}></Client>
                            )
                        }
                    </div>
                </div>
                <button className="btn copybtn">Copy Room ID</button>
                <button className="btn leavebtn">Leave</button>
            </div>
            <div className="editorpage">
                <Editor></Editor>
            </div>
        </div>
    ]);
}
export default EditorHome;