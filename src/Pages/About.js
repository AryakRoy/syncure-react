import React from 'react'
import Carousel from "../Components/Carousel.js"
import Avatar from '@material-ui/core/Avatar';
import "../Pages-css/About.css"
import {useStyles} from "../util.js"
function About() {
    const classes = useStyles();
    return (
        <div>
            <header>
            <h1>About</h1>
            </header>
            <section>
                <div className="carousel-container">
                <Carousel />
                </div>
                <div className="developers-container">
                    <div className="developer-card">
                        <Avatar className={classes.avataricon2}/>
                        <div className="developer-details">
                            <h1>Aryak Roy</h1>
                            <p>Frontend Developer</p>
                        </div>
                    </div>
                    <div className="developer-card">
                        <Avatar className={classes.avataricon2}/>
                        <div className="developer-details">
                            <h1>Hemanth Krishna</h1>
                            <p>App Developer</p>
                        </div>
                    </div>
                    <div className="developer-card">
                        <Avatar className={classes.avataricon2}/>
                        <div className="developer-details">
                            <h1>Parth Namdev</h1>
                            <p>Backend Developer</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
export default About