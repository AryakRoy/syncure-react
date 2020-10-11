import React,{useState} from 'react'
import {TextField} from "@material-ui/core"
import Axios from "axios"
import qs from "qs"
import {Redirect} from "react-router-dom"
import {UserContext} from "../App.js";
import "../Pages-css/LoginAuth.css"
import {useStyles} from "../util.js";
import Loading from "../Pages/Loading.js";
function LoginAuth() {
    const classes= useStyles();
    const [totp, settotp] = useState("");
    const tempdata = React.useContext(UserContext).tempdata;
    const temp_data = tempdata[0];
    const [redirect_state, setredirect_state] = useState(false);
    const [error_state, seterror_state] = useState(false);
    const [open, setopen] = useState(false);
    const [validate, setvalidate] = useState({
        otp:{
            errorstate:false,
            message:"OTP is 6 digit long"
        }
    });
    function handleChange(event){
        settotp(event.target.value);
    }
    function handleSubmit(e){
        e.preventDefault();
        setopen(true);
        if(totp.length === 6){
        const senddata = qs.stringify({totp:totp,});
        var config = {
            method: 'post',
            url: `https://syncure-app-api.herokuapp.com/api/verify/${temp_data}`,
            data: senddata,
          };
        Axios(config)
        .then((response) => {
            console.log(response);
            if(response.data.status === "success"){
                localStorage.setItem('token',response.data.data.token);
                setopen(false);
                setredirect_state(true);
            } 
            else{
                setopen(false);
                seterror_state(true);
            }
        })
        .catch((error) => {
            console.log(error);
            setopen(false);
            seterror_state(true);
        })
        }
        else{
            setopen(false);
            setvalidate({
                otp:{
                    errorstate:true,
                    message:"OTP is 6 digit long"
                }
            });
        }
    }
    const regenerateOTP = () => {
        Axios.get(`https://syncure-app-api.herokuapp.com/api/mail/${temp_data}`)
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        })
    }
    if(redirect_state){
        return <Redirect to="/Dashboard"/>
    }
    else if(error_state){
        return <Redirect to="/Error" />
    }
    else{
        return (
            <div className="container">
                    {open ? <Loading open={open}/>: null}
                    <div className="loginauth-container">
                        <form className="loginauth-form" onSubmit={handleSubmit} autoComplete="off">
                            <h1>OTP Authentication</h1>
                            <div className="loginauth-input-area">
                            <TextField
                             error ={validate.otp.errorstate ? true: false}
                             helperText={validate.otp.message} 
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

export default LoginAuth
