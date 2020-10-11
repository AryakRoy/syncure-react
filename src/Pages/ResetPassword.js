import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import React, {useState} from 'react'
import Axios from "axios"
import qs from "qs"
import {Redirect} from "react-router-dom"
import {useStyles} from "../util.js"
import Loading from "../Pages/Loading.js";
import "../Pages-css/ResetPassword.css";
import {UserContext} from "../App.js";
function ResetPassword() {
    const classes = useStyles();
    const [password_details, setpassword_details] = useState({otp:'',email:'',new_password:'',confirm_password:''});
    const [open, setopen] = useState(false);
    const tempdata = React.useContext(UserContext).tempdata;
    const temp_data = tempdata[0];
    const [showPassword, setShowPassword] = useState(false);
    const [redirect_state, setredirect_state] = useState(false);
    const [error_state, seterror_state] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    function handleChange(event){
        const {name,value} = event.target;
        console.log(password_details);
        setpassword_details(prevValue=>{
            return{
                ...prevValue,[name]:value
            }
        });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setopen(true);
        if(password_details.new_password === password_details.confirm_password){
            const senddata= qs.stringify({
                totp:password_details.otp,
                email:password_details.email,
                newPassword:password_details.new_password
            });
            Axios.post('https://syncure-app-api.herokuapp.com/api/user/resetPassword',senddata)
            .then((response) => {
                console.log(response);
                if(response.data.status === "success"){
                    setopen(false);
                   setredirect_state(true);
                }
            })
            .catch((error) =>{
                console.log(error);
                setopen(false);
                seterror_state(true);
            })
        }
        else{
            alert("Passwords Do not Match. Plaese enter password again ");
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
        return <Redirect to="/Login" />
    }
    else if(error_state){
        return <Redirect to="/Error" />
    }
    else{
        return (
            <div className="container">
            <div className="reset-container">
                {open ? <Loading open={open}/>: null}
                <form className="reset-form" onSubmit={handleSubmit} autoComplete="off">
                <h1>Reset Password</h1>
                <p>We have sent an OTP on your Mail. Enter it and Reset your Password</p>
                <div className="reset-input-area">
                    <TextField 
                        label="OTP"
                        name="otp"
                        value={password_details.otp}
                        variant="outlined"
                        margin="normal"
                        onChange={handleChange}
                        id="input-field"
                        className={classes.root}
                    />
                    <TextField 
                        label="Email"
                        name="email"
                        type="email"
                        value={password_details.email}
                        variant="outlined"
                        margin="normal"
                        onChange={handleChange}
                        id="input-field"
                        className={classes.root}
                    />
                    <TextField 
                        label="New Password"
                        name="new_password"
                        value={password_details.new_password}
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        margin="normal"
                        onChange={handleChange}
                        id="input-field1"
                        className={classes.root}
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
                        label="Confirm Password"
                        name="confirm_password"
                        value={password_details.confirm_password}
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        margin="normal"
                        onChange={handleChange}
                        id="input-field1"
                        className={classes.root}
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
                    <input type="submit" name="reset-submit" className="reset-btn" />
                </form>
            </div>
        </div>
        )
    }  
}
export default ResetPassword
