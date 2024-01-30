import Client from "../components/Client";
import Editor from "../components/Editor";
import { useEffect, useRef, useState } from "react";
import { initSocket } from "../socket";
import ACTIONS from "../action";
import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const EditorHome = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const socketRef = useRef();
    const {roomId} =useParams();
    //if change occure in data then component not rerednder that why use useref()
    useEffect(() => {
        async function init() {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed. try again later.');
                navigate('/');
            }
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });
        };
        
            init();
        
    },[]);

    const [clients,] = useState([
        { socketId: 1, username: 'anurag d' },
        { socketId: 2, username: 'manav d' },
    ]);
    if (!location.state) {
       return <Navigate to={'/'} ></Navigate>
    }

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