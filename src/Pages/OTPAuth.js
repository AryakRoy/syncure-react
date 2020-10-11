import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Axios from 'axios';
import qs from "qs";
import React,{useState} from 'react'
import { Redirect } from 'react-router-dom';
import { UserContext } from '../App';
import '../Pages-css/OTPAuth.css'
import {useStyles} from "../util.js";
import Loading from "../Pages/Loading.js";
function OTPAuth() {
    const classes = useStyles();
    const [input_userData,setinput_userData] = useState({otp:"",password:"",confirm_password:""});
    const tempdata = React.useContext(UserContext).tempdata;
    const temp_data = tempdata[0];
    const [redirect_state, setredirect_state] = useState(false);
    const [error_state, seterror_state] = useState(false);
    const [open, setopen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const [validate, setvalidate] = useState({
        otp:{
            errorstate:false,
            message:""
        },
        password:{
            errorstate:false,
            message:"Minimum 6 letters"
        },
        confirm_password:{
            errorstate:false,
            message:""
        }
    });
    function handleChange(e) {
        const {name,value} = e.target;
        setinput_userData(prevValue=>{
            return{
                ...prevValue,[name]:value
            }
        });
    }
    function handleSubmit(e){
        e.preventDefault();
        setopen(true);
        if(input_userData.password.length >= 6 && input_userData.confirm_password.length >= 6 && input_userData.otp.length === 6 ){
        if(input_userData.password === input_userData.confirm_password){
            const senddata= qs.stringify({
                totp:input_userData.otp,
                password:input_userData.password
            });
            Axios.post(`https://syncure-app-api.herokuapp.com/api/user/verify/${temp_data}`,senddata)
            .then((response) => {
                console.log(JSON.stringify(response));
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
            .catch((error) =>{
                console.log(error);
                setopen(false);
                seterror_state(true);
            })
        }
        else{
            setopen(false);
            setvalidate({
                otp:{
                    errorstate:false,
                    message:""
                },
                password:{
                    errorstate:true,
                    message:"Passwords do not match"
                },
                confirm_password:{
                    errorstate:true,
                    message:"Passwords do not match"
                }
            })
        }
        }
        else{
            setopen(false);
            if(input_userData.otp.length !== 6){
                setvalidate((prevValue) => {
                    return {
                        ...prevValue,otp:{
                        errorstate:true,
                        message:"OTP is 6 digit long"
                    }
                    }
                });
            }
            else{
                setvalidate((prevValue) => {
                    return {
                        ...prevValue,otp:{
                        errorstate:false,
                        message:""
                    }
                    }
                });
            }
            if(input_userData.password.length < 6){
                setvalidate((prevValue) => {
                    return {
                        ...prevValue,password:{
                        errorstate:true,
                        message:"Minimum 6 letters"
                    }
                    }
                });
            }
            else{
                setvalidate((prevValue) => {
                    return {
                        ...prevValue,password:{
                        errorstate:false,
                        message:""
                    }
                    }
                });
            }
            if(input_userData.confirm_password.length < 6){
                setvalidate((prevValue) => {
                    return {
                        ...prevValue,confirm_password:{
                        errorstate:true,
                        message:"Minimum 6 letters"
                    }
                    }
                });
            }
            else{
                setvalidate((prevValue) => {
                    return {
                        ...prevValue,confirm_password:{
                        errorstate:false,
                        message:""
                    }
                    }
                });
            }
        }
    }
    const regenerateOTP = () => {
        Axios.get(`https://syncure-app-api.herokuapp.com/api/user/mail/${temp_data}`)
        .then((response) => {
            console.log(JSON.stringify(response));
        })
        .catch((error) => {
            console.log(error);
        })
    }
    if(redirect_state){
        return <Redirect to="/Dashboard" />
    }
    else if(error_state){
        return <Redirect to="/Error" />
    }
    else{
        return (
            <div className="container">
                <Loading open={open} />
                <div className="otpauth-container">
                    <form className="otpauth-form" onSubmit={handleSubmit} autoComplete="off">
                        <h1>OTP Authentication</h1>
                        <div className="otpauth-input-area">
                        <TextField 
                         error ={validate.otp.errorstate ? true: false}
                         helperText={validate.otp.message}
                         id="input-field"
                         type="text"
                         label="OTP"
                         variant="outlined"
                         placeholder="Enter OTP"
                         margin="normal"
                         value={input_userData.otp}
                         onChange = {handleChange}
                         name="otp"
                         className={classes.root}
                        />
                        <TextField
                         error ={validate.password.errorstate ? true: false}
                         helperText={validate.password.message}
                         id="input-field1"
                         type={showPassword ? "text" : "password"}
                         label="Enter Password"
                         variant="outlined"
                         placeholder="Enter Password"
                         margin="normal"
                         value={input_userData.password}
                         className={classes.root}
                         onChange = {handleChange}
                         name="password"
                         InputProps={{endAdornment: (
                        <InputAdornment position="end">
                        <IconButton
                         classes={{
                                   root: classes.eyeButton
                               }}
                         aria-label="toggle password visibility"
                         onClick={handleClickShowPassword}
                         onMouseDown={handleMouseDownPassword}
                        >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                        </InputAdornment>
                         )}}
                        />
                        <TextField
                         error ={validate.confirm_password.errorstate ? true: false}
                         helperText={validate.confirm_password.message}
                         id="input-field1"
                         type={showPassword ? "text" : "password"}
                         label="Confirm Password"
                         variant="outlined"
                         margin="normal"
                         placeholder="Confirm Password"
                         value={input_userData.confirm_password}
                         onChange = {handleChange}
                         className={classes.root}
                         name="confirm_password"
                         InputProps={{endAdornment: (
                        <InputAdornment position="end">
                        <IconButton
                         classes={{
                                   root: classes.eyeButton
                               }}
                         aria-label="toggle password visibility"
                         onClick={handleClickShowPassword}
                         onMouseDown={handleMouseDownPassword}
                        >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                        </InputAdornment>
                         )}}
                        />
                        </div>
                        <div className="otpauth-links">
                            <span className="otpauth-link" onClick={regenerateOTP}>Regenerate OTP</span>
                        </div>
                        <input className="otp-btn" type="submit" value="Verify" /> 
                    </form>
                </div>
            </div>
        )
    }  
}
export default OTPAuth

