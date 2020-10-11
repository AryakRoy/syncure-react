import { TextField} from "@material-ui/core";
import Axios from 'axios';
import qs from "qs";
import {UserContext} from "../App.js"
import React,{useState} from 'react'
import { Redirect } from 'react-router-dom';
import {useStyles} from "../util.js"
import Loading from "../Pages/Loading.js";
import "../Pages-css/UpdateUserDetails.css";
function UpdateUserDetails() {
    const classes = useStyles();
    const data = React.useContext(UserContext).data;
    const userdata = data[0];
    const [input_userData, setinput_userData] = useState({newName:userdata.name,newUsername:userdata.username,newEmail:userdata.email});
    const [redirect_state, setredirect_state] = useState(false);
    const [open, setopen] = useState(false);
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
        const data = qs.stringify(input_userData);
        var config = {
            method: 'post',
            url: "https://syncure-app-api.herokuapp.com/api/user/updateUser",
            headers: { 
              Authorization: 'Bearer ' + localStorage.getItem('token')
            },
            data:data
          };
        Axios(config)
        .then((response) => {
            console.log(JSON.stringify(response));
            setopen(false);
            setredirect_state(true);
        })
        .catch((error) =>{
            console.log(error);
        })
    }
    if(localStorage.getItem('token')){
        if(redirect_state){
            return <Redirect to="/UpdateUserOTPAuth" />
        }
        else{
            return (
                <div>
                    <Loading open={open} />
                    <div className="container">
                        <div className="updateuser-container"> 
                            <form onSubmit={handleSubmit} className="updateuser-form" autoComplete="off" >
                            <h1>Welcome</h1>
                            <h4>Let's get you started</h4>
                            <div className="updateuser-input-area">
                            <TextField
                              id="input-field"
                              label="Full Name"
                              variant="outlined"
                              margin="normal"
                              placeholder="Enter New Name"
                              value={input_userData.newName}
                              onChange= {handleChange}
                              name="newName"
                              className = {classes.root}
                            />
                            <TextField
                             id="input-field"
                             label="Username"
                             variant="outlined"
                             margin="normal"
                             placeholder="Enter New Username"
                             value={input_userData.newUsername}
                             onChange= {handleChange}
                             name="newUsername"
                             className={classes.root}
                           />
                           <TextField
                             id="input-field"
                             type="email"
                             label="Email"
                             placeholder="Enter New Email"
                             variant="outlined"
                             margin="normal"
                             value={input_userData.newEmail}
                             onChange = {handleChange}
                             name="newEmail"
                             className={classes.root}
                           />
                            </div>
                            <input className="updateuser-btn" value="Submit" type="submit" />
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

export default UpdateUserDetails
