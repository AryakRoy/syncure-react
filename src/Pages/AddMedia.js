import React,{useState} from 'react'
import "../Pages-css/AddMedia.css"
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import EditIcon from '@material-ui/icons/Edit';
import {useStyles} from "../util.js"
import Axios from "axios"
import fs from "fs"
import FormData from "form-data"
import {TextField} from "@material-ui/core"
import {FilePreviewerThumbnail} from 'react-file-previewer';
import { Redirect } from 'react-router-dom';
function AddMedia() {
    const classes  =useStyles();
    const [file, setfile] = useState([]);
    const [redirect_state, setredirect_state] = useState(false);
    const [file_name, setfile_name] = useState("");
    const [error_state, seterror_state] = useState(false);
    const [upload_hide, setupload_hide] = useState(true);
    const [description, setdescription] = useState("");
    const [validate, setvalidate] = useState({
        errorstate:false,
        errormessage:""
    });
    const onFileChange = event => {
        setfile(event.target.files[0]);
        setupload_hide(false);
    };
    function handleChange(event){
        console.log(description);
        setdescription(event.target.value);
    }
    const handleSubmit = () => {
        if(description.length > 0 ){
            console.log("hello")
            const data = new FormData();
            data.append('description', 'sample media');
            data.append('media', file);
            var config = {
              headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('token'), 
              }
            };
            console.log(data)
            Axios.post("https://syncure-app-api.herokuapp.com/api/article/addMedia",{
                headers: { 
                    'Authorization': 'Bearer ' + localStorage.getItem('token'), 
                    "Access-Control-Allow-Origin": "*"
                  },
                data: data,
            }).then(res => {
                console.log("Request Sent!")
            }).catch(err =>{
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
            return <Redirect to="/Files" />
        }
        else if(error_state){
            return <Redirect to="/Error" />
        }
        else{
            return (
                <div className="add-media-container"> 
                  <div className="previewer">
                  {file.url === "" ? (<h5>No file choosen</h5>
                    ):( <div>
                        <FilePreviewerThumbnail
                        id="file-preview"
                        file={file}
                        />
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
