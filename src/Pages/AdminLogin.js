import React from 'react'
import '../Pages-css/Login.css';
import axios from "axios";
import qs from "qs";
import {useState} from "react";
import { Redirect } from 'react-router-dom';
import "../Pages-css/Login.css"
import {UserContext} from "../App.js";
import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {useStyles} from "../util.js"
import Loading from "../Pages/Loading.js";
function AdminLogin() {
    const classes = useStyles();
    const [input_userData,setinput_userData] = useState({admin:"",password:"",});
    const tempdata = React.useContext(UserContext).tempdata;
    const settemp_data = tempdata[1];
    const [redirect_state, setredirect_state] = useState(false);
    const [open, setopen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
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
        setopen(true);
        const senddata = qs.stringify(input_userData);
        var config = {
            method: 'post',
            url: 'https://syncure-app-api.herokuapp.com/admin/requestAccess',
            headers: { },
            data : senddata
          };
        axios(config)
        .then((response) => {
            console.log(response);
            if(response.data.data.status === "success"){
                settemp_data(input_userData.admin);
                setopen(false);
                setredirect_state(true);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
    if(redirect_state){
        return <Redirect to="/AdminDashboard"/>
    }
    else{
        return (
            <div className="login">
                <Loading open={open} />
                <div className="container">
                    <div className="login-container"> 
                        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
                        <h1>Admin Login</h1>
                        <div className="login-input-area"> 
                        <TextField
                          required
                          id="input-field"
                          label="Username"
                          variant="outlined"
                          margin="normal"
                          placeholder="Enter Username"
                          value={input_userData.admin}
                          onChange= {handleChange}
                          name="admin"
                          className = {classes.root}
                        />
                        <TextField
                          required
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
                        <input className="login-btn" value="Login" type="submit" />
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default AdminLogin
