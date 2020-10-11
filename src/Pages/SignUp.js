import React from 'react'
import '../Pages-css/Signup.css'
import {TextField} from "@material-ui/core"
import {useState} from "react"
import axios from "axios"
import qs from "qs"
import { Redirect } from 'react-router-dom'
import {UserContext} from "../App.js";
import {useStyles} from "../util.js";
import Loading from "../Pages/Loading.js";
function SignUp() {
    const classes = useStyles();
    const [input_userData,setinput_userData] = useState({username:"",email:"",name:""});
    const tempdata = React.useContext(UserContext).tempdata;
    const settemp_data = tempdata[1];
    const [redirect_state, setredirect_state] = useState(false);
    const [error_state, seterror_state] = useState(false);
    const [open, setopen] = useState(false);
    const [validate, setvalidate] = useState({
        name:{
            errorstate:false,
            message:""
        },
        username:{
            errorstate:false,
            message:"Minimum 8 letters"
        },
        email:{
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
        e.preventDefault();
        if(input_userData.username.length >= 8 && input_userData.name.length >0 && input_userData.email.length > 0){
        setopen(true);
        const data = qs.stringify(input_userData);
        console.log(data);
        axios.post('https://syncure-app-api.herokuapp.com/api/user/register',data)
        .then((response) => {
            console.log(response);
            if(response.data.status === "success"){
                settemp_data(input_userData.username);
                setopen(false);
                setredirect_state(true);
            }
            else{
                if(response.data.message === "username already exist !"){
                    setopen(false);
                    setvalidate((prevValue) => {
                        return {
                            ...prevValue,username:{
                            errorstate:true,
                            message:"Username unavailable"
                        }
                        }
                    });
                }
                else{
                setopen(false);
                seterror_state(true);
                }
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
            if(input_userData.username.length < 8){
                setvalidate((prevValue) => {
                    return {
                        ...prevValue,username:{
                        errorstate:true,
                        message:"Minimum 8 letters"
                    }
                    }
                });
            }
            else{
                setvalidate((prevValue) => {
                    return {
                        ...prevValue,username:{
                        errorstate:false,
                        message:""
                    }
                    }
                }); 
            }
            if(input_userData.name.length === 0){
                setvalidate((prevValue) => {
                    return {
                        ...prevValue,name:{
                        errorstate:true,
                        message:"This field is required"
                    }
                    }
                });
            }
            else{
                setvalidate((prevValue) => {
                    return {
                        ...prevValue,name:{
                        errorstate:false,
                        message:""
                    }
                    }
                });
            }
            if(input_userData.email.length < 8){
                setvalidate((prevValue) => {
                    return {
                        ...prevValue,email:{
                        errorstate:true,
                        message:"This field is required"
                    }
                    }
                });
            }
            else{
                setvalidate((prevValue) => {
                    return {
                        ...prevValue,email:{
                        errorstate:false,
                        message:""
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
            return <Redirect to="/OTPAuth" />
        }
        else if(error_state){
            return <Redirect to="/Error" />
        }
        else{
            return (
                <div>
                    {open ? <Loading open={open}/>: null}
                    <div className="container">
                        <div className="signup-container"> 
                            <form onSubmit={handleSubmit} className="signup-form" autoComplete="off" >
                            <h1>Welcome</h1>
                            <h4>Let's get you started</h4>
                            <div className="signup-input-area">
                            <TextField
                              error ={validate.name.errorstate ? true: false}
                              helperText={validate.name.message}
                              id="input-field"
                              label="Full Name"
                              variant="outlined"
                              margin="normal"
                              placeholder="Enter Full Name"
                              value={input_userData.name}
                              onChange= {handleChange}
                              name="name"
                              className = {classes.root}
                            />
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
                             className={classes.root}
                           />
                           <TextField
                             error ={validate.email.errorstate ? true: false}
                             helperText={validate.email.message}
                             id="input-field"
                             type="email"
                             label="Email"
                             placeholder="Enter Email"
                             variant="outlined"
                             margin="normal"
                             value={input_userData.email}
                             onChange = {handleChange}
                             name="email"
                             className={classes.root}
                           />
                            </div>
                            <input className="signup-btn" value="Register"  type="submit" />
                            </form>
                        </div>
                    </div>
                </div>
            )
        }
    }
    

}

export default SignUp
