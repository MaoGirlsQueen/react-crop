import React from "react";
import ReactDOM from  "react-dom";
import PicContainer from './components/PicContainer'

const Start=()=>{
    return(
        <div>
            <PicContainer></PicContainer>
        </div>
    )
 }
 export default Start;
ReactDOM.render(<Start/>,document.getElementById('app'));