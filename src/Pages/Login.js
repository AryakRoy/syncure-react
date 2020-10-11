import React from 'react'
import '../Pages-css/Login.css';
import axios from "axios";
import qs from "qs";
import {useState} from "react";
import { Redirect } from 'react-router-dom';
import {UserContext} from "../App.js";
import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {useStyles} from "../util.js"
import Loading from "../Pages/Loading.js";

function Login() {
    const classes = useStyles();
    const [input_userData,setinput_userData] = useState({username:"",password:"",});
    const [validate, setvalidate] = useState({
        username: {
            errorstate:false,
            message:""
        },
        password: {
            errorstate:false,
            message:""
        }
    });
    const tempdata = React.useContext(UserContext).tempdata;
    const settemp_data = tempdata[1];
    const [redirect_state, setredirect_state] = useState(false);
    const [dashboard_redirect, setdashboard_redirect] = useState(false);
    const [error_state, seterror_state] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const [open,setopen] = useState(false);
    function handleChange(event){
        const {name,value} = event.target;
        setinput_userData(prevValue=>{
            return{
                ...prevValue,[name]:value
            }
        });
    }
    function handleSubmit(e){
        e.preventDefault();
        console.log(e);
        if(input_userData.username.length > 0  && input_userData.password.length >= 6){
            setopen(true);
            var senddata;
            if(localStorage.getItem('device'.concat(input_userData.username))){
                senddata = qs.stringify({
                    username: input_userData.username,
                    password: input_userData.password,
                    device: localStorage.getItem('device'.concat(input_userData.username))
                });
            }
            else{
                senddata = qs.stringify(input_userData);
            }
            console.log(senddata);
            var config = {
                method: 'post',
                url: 'https://syncure-app-api.herokuapp.com/api/login',
                headers: { 
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Access-Control-Allow-Origin': '*'
                },
                data : senddata
            };
            axios(config)
            .then((response) => {
               console.log(response);
               if(response.data.status === "success"){
                settemp_data(input_userData.username);
                if(response.data.data.token){
                    localStorage.setItem('token',response.data.data.token);
                    setopen(false);
                    setdashboard_redirect(true);
                }
                else{
                    setopen(false);
                    setredirect_state(true);
                }
               }
               else{
                setopen(false);
                if(response.data.message === "no user found"){
                    setvalidate({
                        username:{
                            errorstate:true,
                            message:"Incorrect Username"
                        },
                        password:{
                            errorstate:false,
                            message:""
                        }
                    });
                }
                if(response.data.message === "failed login or incorrect password"){
                    setvalidate({
                        username:{
                            errorstate:false,
                            message:""
                        },
                        password:{
                            errorstate:true,
                            message:"Incorrect Password"
                        }
                    });
                }
                if(response.data.message === "disk api err"){
                    seterror_state(true);
                }
               }
            })
            .catch((error) => {
                setopen(false);
                console.log(error);
                seterror_state(true);
            })
        }
        else{
            if(input_userData.username.length === 0){
                setvalidate((prevValue) => {
                    return {
                        ...prevValue,username:{
                        errorstate:true,
                        message:"This field is required"
                    }
                    }
                });
            }
            if(input_userData.password.length === 0){
                setvalidate((prevValue) => {
                    return {
                        ...prevValue,
                            password:{
                                errorstate:true,
                                message:"This field is required"
                            }
                    }
                });
            } 
        }
    }
    if(localStorage.getItem('token')){
        return <Redirect to="/Dashboard" />
    }
    else{
        if(redirect_state){
            return <Redirect to="/LoginAuth"/>
        }
        else if(dashboard_redirect){
            return <Redirect to="/Dashboard" />
        }
        else if(error_state){
            return <Redirect to="/Error" />
        }
        else{
            return (
                <div className="login">
                {open ? <Loading open={open}/>: null}
                    <div className="container">
                        <div className="login-container"> 
                            <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
                            <h1>Hey There</h1>
                            <h4>Let's Sync</h4>
                            <div className="login-input-area"> 
                            <TextField 
                              error ={validate.username.errorstate ? true: false}
                              helperText={validate.username.message}
                              id="input-field"
                              label="Username"
                              variant="outlined"
                              margin="normal"
                              placeholder="Enter Username"
                              value={input_userData.username}
                              onChange= {handleChange}
                              name="username"
                              className = {classes.root}
                            />
                            <TextField
                              error ={validate.password.errorstate ? true: false}
                              helperText={validate.password.message}
                              id="input-field1"
                              label="Password"
                              variant="outlined"
                              className = {classes.root}
                              margin="normal"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter Password"
                              value={input_userData.password}
                              onChange= {handleChange}
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
                            </div>
                            <div className="login-links">
                            <a href="/ForgotPassword" className="login-link">Forgot Password</a>
                            <a href="/Signup" className="login-link">Sign Up</a>
                            </div>
                            <input className="login-btn" value="Login" type="submit" />
                            </form>
                        </div>
                    </div>
                </div>
            )
        }
    }   
}
export default Login