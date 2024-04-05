import { useLocation ,useNavigate} from "react-router-dom";

const Output = () => {
    const navigate=useNavigate();
    
    return ([
        <>
            <h4 className="output_heading">output</h4>
                <textarea className="output_show"></textarea>
            <button className="button-5" onClick={()=>{
                navigate(-1);
            }}>Back</button> 
        </>
    ])
}
export default Output;