import React from 'react'
import Mockup from '../Images/Group 3.svg';
import '../Pages-css/Home.css'
function Home() {
    return (
        <div>
          <div className="home">
            <div className="home__text">
              <h1>Get Your Data Together</h1>
              <p>Tired of remembering passwords and  worried about your security. Make your data secure  with Syncure</p>
            </div>
            <div className="home__image">
            <img src={Mockup} alt="iMac" className="home__mockup"/>
            </div>
          </div>  
        </div>
    )
}

export default Home
