import React,{useState} from 'react'
import {TextField} from "@material-ui/core"
import Axios from "axios"
import qs from "qs"
import {Redirect} from "react-router-dom"
import {useStyles} from "../util.js"
import "../Pages-css/LoginAuth.css"
import Loading from "../Pages/Loading.js";
function UpdateUserOTPAuth() {
    const classes = useStyles();
    const [totp, settotp] = useState("");
    const [open, setopen] = useState(false);
    const [redirect_state, setredirect_state] = useState(false);
    function handleChange(event){
        console.log(totp);
        settotp(event.target.value);
    }
    function handleSubmit(e){
        e.preventDefault();
        setopen(true);
        const data = qs.stringify({totp});
        var config = {
            method: 'post',
            url: "https://syncure-app-api.herokuapp.com/api/user/verifyMail",
            headers: { 
              Authorization: 'Bearer ' + localStorage.getItem('token')
            },
            data:data
          };
        Axios(config)
        .then((response) => {
            console.log(response);
            setopen(false);
            setredirect_state(true);
        })
        .catch((error) =>{
            console.log(error);
        })
    }
    const regenerateOTP = () => {
        var config = {
            method: 'get',
            url: 'https://syncure-app-api.herokuapp.com/api/user/resendUpdateEmail',
            headers: { 
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          };
        Axios(config)
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        })
    }
    if(localStorage.getItem('token')){
        if(redirect_state){
            return <Redirect to="/Dashboard" />
        }
        else{
            return (
                <div className="container">
                        {open?<Loading open={open} />:null}
                        <div className="loginauth-container">
                            <form className="loginauth-form" onSubmit={handleSubmit} autoComplete="off">
                                <h1>OTP Authentication</h1>
                                <div className="loginauth-input-area">
                                <TextField 
                                 id="input-field"
                                 type="text"
                                 label="Enter OTP"
                                 variant="outlined"
                                 margin="normal"
                                 value={totp}
                                 className={classes.root}
                                 onChange = {handleChange}
                                 name="otp"
                                />
                                </div>
                                <div className="loginauth-links">
                                <span className="loginauth-link" onClick={regenerateOTP}>Regenerate OTP</span>
                                </div>
                                <input className="loginauth-btn" type="submit" value="Verify" /> 
                            </form>
                        </div>
                </div>
            )
        }
    }
    else{
        return <Redirect to="/Login" />
    }  
}
export default UpdateUserOTPAuth
