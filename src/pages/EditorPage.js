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
    const { roomId } = useParams();
    const [clients, setclients] = useState([]);
    const codeRef = useRef(null);
    const [output, setoutput] = useState(false);
    const [theme, settheme] = useState(false);
    const [get_theme, set_get_theme] = useState('drakula');
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

    const handlerun = () => {
        setoutput(!output);
        navigate(`/editor/${roomId}/run`, {
            state: {
                roomId
            }
        });
    }
    function LeaveRoom() {
        navigate('/');
    }
    const handletheme = () => {
        settheme(!theme);
    }
    const set_theme = (e) => {
        set_get_theme(e.target.value);
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
                                <Client username={client.username} key={client.socketId}></Client>
                            )
                        }
                    </div>
                </div>
                <button className="btn runbtn" onClick={handlerun} >
                    <h2 className="btn_run_content">Run
                        <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </h2>

                </button>
                <button className="btn theme-btn" onClick={handletheme}>Theme</button>
                <button className="btn copybtn" onClick={copyRoomID}>Copy Room ID</button>
                <button className="btn leavebtn" onClick={LeaveRoom}>Leave</button>
            </div>
            <div className="editorpage">
                <Editor socketRef={socketRef} roomId={roomId} oncodechange={(code) => { codeRef.current = code }} theme={get_theme}></Editor>
                <div style={theme ?
                    { height: '100vh', width: '100px', position: 'absolute', top: '0px', right: '0px', background: 'black', display: 'block', padding: '20px 20px 20px 20px' } :
                    { display: 'none' }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>

                        <button className="btn theme-btn" onClick={(e) => set_theme(e)} value={'default'}>default</button>
                        <button className="btn theme-btn" onClick={(e) => set_theme(e)} value={'abcdef'}>abcdef</button>
                        <button className="btn theme-btn" onClick={(e) => set_theme(e)} value={'material'}>material</button>
                        <button className="btn theme-btn" onClick={(e) => set_theme(e)} value={'3024-day'}>3024-day</button>
                        <button className="btn theme-btn" onClick={(e) => set_theme(e)} value={'abbott'}>abbott</button>
                        <button className="btn theme-btn" onClick={(e) => set_theme(e)} value={'ambiance'}>ambiance</button>
                        <button className="btn theme-btn" onClick={(e) => set_theme(e)} value={'bespin'}>bespin</button>
                        <button className="btn theme-btn" onClick={(e) => set_theme(e)} value={'blackboard'}>blackboard</button>
                        <button className="btn theme-btn" onClick={(e) => set_theme(e)} value={'drakula'}>drakula</button>
                        <button className="btn theme-btn" onClick={(e) => set_theme(e)} value={'eclipse'}>eclipse</button>
                        <button className="btn theme-btn" onClick={(e) => set_theme(e)} value={'idea'}>idea</button>
                        <button className="btn theme-btn" onClick={(e) => set_theme(e)} value={'mdn-like'}>mdn-like</button>
                        <button className="btn theme-btn" onClick={(e) => set_theme(e)} value={'ttcn'}>ttcn</button>
                    </div>
                </div>
            </div>

        </div>

    </>
    );
};

export default EditorHome;
