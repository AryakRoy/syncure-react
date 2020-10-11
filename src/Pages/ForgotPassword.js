import React,{useState} from 'react'
import {TextField} from "@material-ui/core"
import '../Pages-css/ForgotPassword.css'
import qs from "qs"
import axios from "axios"
import {Redirect} from "react-router-dom"
import Loading from "../Pages/Loading.js";
import {useStyles} from "../util.js";
import {UserContext} from "../App.js";
function ForgotPassword() {
    const classes = useStyles();
    const [username, setusername] = useState("");
    const [redirect_state, setredirect_state] = useState(false);
    const tempdata = React.useContext(UserContext).tempdata;
    const settemp_data = tempdata[1];
    const [error_state, seterror_state] = useState(false);
    const [open, setopen] = useState(false);
    const [validate, setvalidate] = useState({
        username:{
            errorstate:false,
            message:""
        }
    });
    function handleChange(event){
        setusername(event.target.value);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if(username.length >= 8){
        e.preventDefault();
        setopen(true);
        const data = qs.stringify({username:username});
        axios.post('https://syncure-app-api.herokuapp.com/api/user/forgotPassword',data)
        .then((response) => {
            console.log(response);
            if(response.data.status === "success"){
                settemp_data(username);
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
            setvalidate({
                username:{
                    errorstate:true,
                    message:"Minimum 6 letters"
                }
            });
        } 
    }
    if(redirect_state){
        return <Redirect to="/ResetPassword"/>
    }
    else if(error_state){
        return <Redirect to="/Error" />
    }
    else{
        return (
            <div className="container">
                {open ? <Loading open={open}/>: null}
                <div className="forgot-container">
                <form className="forgot-form" onSubmit={handleSubmit} autoComplete="off">
                <h1>Forgot Password ?</h1>
                <p>Don't Worry we got you</p>
                <TextField 
                    error ={validate.username.errorstate ? true: false}
                    helperText={validate.username.message}
                    variant="outlined"
                    id="input-field"
                    label="Enter Username"
                    name="username"
                    onChange={handleChange}
                    value={username}
                    className={classes.root}
                />
                <input type="submit" value="Submit" className="forgot-btn"/>
                </form> 
            </div>
            </div> 
        )
    }  
}
export default ForgotPassword
