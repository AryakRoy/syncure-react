import React from 'react'
import '../Pages-css/Login.css';
import axios from "axios";
import qs from "qs";
import {useState} from "react";
import { Redirect } from 'react-router-dom';
import "../Pages-css/Login.css"
import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {useStyles} from "../util.js"
import Loading from "../Pages/Loading.js";
function AddPassword() {
    const classes = useStyles();
    const [input_userData,setinput_userData] = useState({passwordCode:"",passwordTitle:"",});
    const [open, setopen] = useState(false);
    const [redirect_state, setredirect_state] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const [validate, setvalidate] = useState({
        title:{
            errorstate:false,
            message:""
        },
        code:{
            errorstate:false,
            message:""
        }
    });
    function handleChange(event){
        const {name,value} = event.target;
        setinput_userData(prevValue=>{
            return{
                ...prevValue,[name]:value
            }
        });
    }
    function handleSubmit(e){
        setopen(true);
        e.preventDefault();
        if(input_userData.passwordCode.length > 0 && input_userData.passwordTitle.length > 0){
            const data = qs.stringify(input_userData);
            var config = {
                method: 'post',
                url: "https://syncure-app-api.herokuapp.com/api/article/addPassword",
                headers: { 
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
                data:data
            };
            axios(config)
            .then((response) => {
                console.log(response);
                if(response.data.status === "success"){
                    setopen(false);
                    setredirect_state(true);
                }
                })
            .catch((error) => {
                console.log(error);
                setopen(false);
            })
        }
        else{
            if(input_userData.passwordTitle.length === 0){
                setvalidate((prevValue) => {
                    return {
                        ...prevValue,username:{
                        errorstate:true,
                        message:"This field is required"
                    }
                    }
                });
            }
            if(input_userData.passwordCode.length === 0){
                setvalidate((prevValue) => {
                    return {
                        ...prevValue,username:{
                        errorstate:true,
                        message:"This field is required"
                    }
                    }
                });
            }
        }   
    }
    if(localStorage.getItem('token')){
        if(redirect_state){
            return <Redirect to="/Passwords"/>
        }
        else{
            return (
                <div className="login">
                    {open ? <Loading open={open}/>: null}
                    <div className="container">
                        <div className="login-container"> 
                            <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
                            <h1>New Password</h1>
                            <h4>Store your passwords here</h4>
                            <div className="login-input-area"> 
                            <TextField
                              error ={validate.title.errorstate ? true: false}
                              helperText={validate.title.message}
                              id="input-field"
                              label="Title"
                              variant="outlined"
                              margin="normal"
                              placeholder="Enter Password Name"
                              value={input_userData.passwordTitle}
                              onChange= {handleChange}
                              name="passwordTitle"
                              className = {classes.root}
                            />
                            <TextField
                              error ={validate.code.errorstate ? true: false}
                              helperText={validate.code.message}
                              id="input-field1"
                              label="Password"
                              variant="outlined"
                              className = {classes.root}
                              margin="normal"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter Password"
                              value={input_userData.passwordCode}
                              onChange= {handleChange}
                              name="passwordCode"
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
                            <input className="login-btn" value="Add" type="submit" />
                            </form>
                        </div>
                    </div>
                </div>
            )
        }
    }
    else{
        return <Redirect to="/Login" />
    }
}

export default AddPassword
