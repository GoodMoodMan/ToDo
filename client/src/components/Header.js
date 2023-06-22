import React from 'react'
import './App_comp.css';
import { useState } from 'react';
 
function Header(props) {

  const HandleTab_SignUp = () => {
    props.setCurr_tab(2);
  }
  
  const HandleTab_LogIn = () => {
    props.setCurr_tab(1);
  }
  // BOOTSTRAP TEMPLATE NAVBAR

  if (props.curr_tab == 1) {
    return (
      <div>
        
        <nav className="navbar navbar-expand-lg navbar-dark text-uppercase" id='mainNav'>
          <div className="container">
          <a className="navbar-brand">Task Manager</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <a className="nav-item nav-link border border-white rounded" style={{cursor:"pointer"}} onClick={HandleTab_LogIn}>Log In <span className="sr-only">(current)</span></a>
          <a className="nav-item nav-link" style={{cursor:"pointer"}} onClick={HandleTab_SignUp}>Sign Up</a>
        </div>
      </div>
      </div>
    </nav>
    </div>
    )
  }
  else {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark text-uppercase" id='mainNav'>
        <div className="container">
          <a className="navbar-brand">Task Manager</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <a className="nav-item nav-link " style={{cursor:"pointer"}} onClick={HandleTab_LogIn}>Log In</a>
          <a className="nav-item nav-link border border-white rounded " style={{cursor:"pointer"}} onClick={HandleTab_SignUp}>Sign Up <span className="sr-only">(current)</span></a>
        </div>
      </div>
      </div>
    </nav>
    </div>
    )

  }
}

 
export default Header;