import React from "react";
import "./ProgressBar.css";

const ProgressBar = ({ percent }) => {

  return(
    <>
      <div className="progress-bar-wapper">
        <div style={{ width : `${percent}%` }} className={(percent === 0) ? 'black' : 'white'}>
          {percent}%
        </div>
      </div>
    </>
  )
}

export default ProgressBar;