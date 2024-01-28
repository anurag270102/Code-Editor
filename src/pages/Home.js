import { useState } from 'react';
import {v4 as uuidv4} from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const navigate=useNavigate();
    const [roomid,setroomid]=useState("");
    const [username,setusername]=useState("");
    const createnewroom=(e)=>{
        e.preventDefault();
        const id=uuidv4();
        setroomid(id);
        toast.success('Created a new Room');
    }

    const joinroom=()=>{
        if(!roomid || !username)
        {toast.error('roomid and username are required');
        return;}
        navigate(`/editor/${roomid}`,{
            state:{
             username,   
            }
        })
    }

    const handleinputfromkey=(e)=>{
        if(e.code==='Enter'){
            joinroom();
        }
    }
    return ([
        <div key={1212} className="homePageWrapper">
            <div className="fromWrapper">
                <video width="100%" autoPlay loop muted>
                    <source src="/log.mp4" type="video/mp4" />
                    Sorry, your browser doesn't support videos.
                </video>
                <h4 className="mainlable">Paste Room ID</h4>
                <div className="inputgroup">
                    <input type="text" className="inputbox" placeholder="ROOM ID" value={roomid} onChange={(e)=>{setroomid(e.target.value)}} onKeyUp={handleinputfromkey}></input>
                    <input type="text" className="inputbox" placeholder="USER NAME" value={username} onChange={(e)=>{setusername(e.target.value)}} onKeyUp={handleinputfromkey}></input>
                </div>
                <button className=" btn joinbtn" onClick={joinroom}>JOIN</button><br></br>
                <span className="createInfo">If you Don't have an invite then create &nbsp;
                    <a href="/" className="createnewbtn" onClick={createnewroom}>new room</a>
                </span>
            </div>
            <br></br>
            <footer>
                <h4> Built with 💚 by <a href="https://github.com/anurag270102" >Anurag Dalsaniya</a></h4>
            </footer>
        </div>
    ]);
}
export default Home;