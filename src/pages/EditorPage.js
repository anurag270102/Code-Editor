import Client from "../components/Client";
import Editor from "../components/Editor";
import { useEffect, useRef, useState } from "react";
import { initSocket } from "../socket";
import ACTIONS from "../action";
import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import '../App.css';
const EditorHome = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const socketRef = useRef();
    const { roomId } = useParams();
    const [clients, setclients] = useState([]);
    const codeRef = useRef(null);
    useEffect(() => {
        const init = async () => {
            try {
                socketRef.current = await initSocket();
                socketRef.current.on('connect_error', (err) => handleErrors(err));
                socketRef.current.on('connect_failed', (err) => handleErrors(err));
                socketRef.current.emit(ACTIONS.JOIN, {
                    roomId,
                    username: location.state?.username,
                });

                // Move the 'on' listener for 'JOINED' inside the 'init' function
                await socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined in the room`);
                        console.log(`${username} joined`);
                    }

                    setclients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId
                    })
                });

                // Move the 'on' listener for 'DISCONNECTED' inside the 'init' function
                await socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                    toast.success(`${username} left the room`);
                    setclients((prev) => {
                        return prev.filter((client) => client.socketId !== socketId);
                    });
                });
            } catch (error) {
                console.error('Error initializing socket:', error);
                handleErrors(error);
            }
        };

        const handleErrors = (e) => {
            console.log('socket error', e);
            toast.error('Socket connection failed. try again later.');
            navigate('/');
        };
        init();
        return () => {
            // Cleanup listeners when the component unmounts
            if (socketRef.current) {
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
                // socketRef.current.disconnect();
            }
        };
    }, []);

    if (!location.state) {
        return <Navigate to={'/'} />;
    }
    async function copyRoomID() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('RoomID has Been copied to your ClipBoard');
        } catch (error) {
            console.log(error);
            toast.error('Error to copied RoomID');
            console.log(error);
        }
    }
    function LeaveRoom() {
        navigate('/');
    }

   
    return (<>
        
        <div className="mainwrap">
            <div className={"aside"}>
                <div className="asideinner">
                    <div className="logoeditor">
                        <h1 className="mainheading">StreamCode</h1>
                        <h4 className="subheading">Learn Write Share.</h4>
                    </div>
                    <h3>Connected</h3>
                    <div className="clientlist">
                        {
                            clients.map(client =>
                                <Client username={client.username} key={client.socketId + 7767}></Client>
                            )
                        }
                    </div>
                </div>
                <button className="btn copybtn" onClick={copyRoomID}>Copy Room ID</button>
                <button className="btn leavebtn" onClick={LeaveRoom}>Leave</button>
            </div>
            <div className="editorpage">
                <Editor socketRef={socketRef} roomId={roomId} oncodechange={(code) => { codeRef.current = code }}></Editor>
            </div>
        </div>

    </>
    );
};

export default EditorHome;
