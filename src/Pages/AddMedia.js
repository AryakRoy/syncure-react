import React,{useState} from 'react'
import "../Pages-css/AddMedia.css"
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import EditIcon from '@material-ui/icons/Edit';
import {useStyles} from "../util.js"
import Axios from "axios"
import Loading from "../Pages/Loading.js"
import FormData from "form-data"
import {TextField} from "@material-ui/core"
import { Redirect } from 'react-router-dom';
function AddMedia() {
    const classes  =useStyles();
    const [file, setfile] = useState([]);
    const [redirect_state, setredirect_state] = useState(false);
    const [file_name, setfile_name] = useState("");
    const [error_state, seterror_state] = useState(false);
    const [upload_hide, setupload_hide] = useState(true);
    const [description, setdescription] = useState("");
    const [open, setopen] = useState(false);
    const [validate, setvalidate] = useState({
        errorstate:false,
        errormessage:""
    });
    const onFileChange = event => {
        if(event.target.files[0]){
            setfile(event.target.files[0]);
            setfile_name(event.target.files[0].name);
            setupload_hide(false);
        } 
    };
    function handleChange(event){
        console.log(description);
        setdescription(event.target.value);
    }
    const handleSubmit = () => {
        if(description.length > 0 ){
            setopen(true);
            const data = new FormData();
            data.append('description', description);
            data.append('media', file);
            console.log(data)
            Axios.post("https://syncure-app-api.herokuapp.com/api/article/addMedia",data,{
                headers: { 
                    Authorization: 'Bearer ' + localStorage.getItem('token'), 
                    "Access-Control-Allow-Origin": "*"
                  },
            }).then(res => {
                console.log(res);
                console.log("Request Sent!")
                if(res.data.status === "success"){
                    setopen(false);
                    setredirect_state(true);
                }
                else{
                    setopen(false);
                    seterror_state(true);
                }
            }).catch(err =>{
                setopen(false);
                seterror_state(true);
                console.log("Axios Error",err)
            })
        }
        else{
            setvalidate({
                errorstate:true,
                errormessage:"This is required" 
            });
        }
    }
    if(localStorage.getItem('token')){
        if(redirect_state){
            return <Redirect to="/Media" />
        }
        else if(error_state){
            return <Redirect to="/Error" />
        }
        else{
            return (
                <div className="add-media-container"> 
                  {open ? <Loading open={open}/>: null}
                  <div className="previewer">
                  {file_name === "" ? (<h5>No file choosen</h5>
                    ):( <div>
                        <h5>{file_name}</h5>
                        <TextField 
                              error ={validate.errorstate ? true: false}
                              helperText={validate.errormessage}
                              id="input-field"
                              label="Description"
                              variant="outlined"
                              margin="normal"
                              placeholder="Enter Description"
                              value={description}
                              onChange= {handleChange}
                              name="username"
                              className = {classes.root}
                        />
                    </div>
                        
                    )
                    }
                  </div>
                    <div className="buttons">
                    <Tooltip title="Upload" aria-label="add">
                        <Fab
                        style={{
                            backgroundColor:upload_hide?'#a5d6d9':'#00ADB5',
                            color:'#eeeeee',
                        }}
                        disabled={upload_hide?true:false}
                        onClick={handleSubmit}
                        >
                        <ArrowUpwardIcon />
                        </Fab>
                    </Tooltip>
                    <label htmlFor="upload-photo">
                        <input
                          style={{ display: "none" }}
                          id="upload-photo"
                          name="upload-photo"
                          type="file"
                          onChange={onFileChange}
                        />
                        <Tooltip title="Select File" aria-label="add">
                        <Fab
                          style={{
                              backgroundColor:'#00ADB5',
                              color:'#eeeeee',
                          }}
                          component="span"
                          aria-label="add"
                        >
                            <EditIcon />
                        </Fab>
                        </Tooltip>
                    </label> 
                    </div>
                </div>
            )
        }
    }
    else{
        return <Redirect to="/Login" />
    }
}

export default AddMedia
