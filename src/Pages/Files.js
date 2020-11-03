import React, {useEffect,useState}from 'react'
import Axios from "axios"
import qs from "qs"
import Modal from '@material-ui/core/Modal';
import { Redirect, Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import Mediafield from "../Components/Mediafield";
import Backdrop from '@material-ui/core/Backdrop';
import Fab from '@material-ui/core/Fab';
import fs from "fs"
import Tooltip from '@material-ui/core/Tooltip';
import "../Pages-css/Passwords.css"
import Loading from "../Pages/Loading.js"
import {useStyles} from "../util.js"
import "../Pages-css/Passwords.css"
import FileSaver from "file-saver"
function Files() {
    const classes = useStyles();
    const [medias, setmedias] = useState([]);
    const [open, setopen] = useState(false);
    const [delete_modal, setdelete_modal] = useState(false);
    const [delete_key, setdelete_key] = useState("");
    const handleOpen = () => {
        setdelete_modal(true);
      };
    const handleClose = () => {
        setdelete_modal(false);
    };
    useEffect(() => {
        if(localStorage.getItem('token')){
           getMedias();
        }
    }, []);
    const getMedias = async () => {
        setopen(true);
        var config = {
            method: 'get',
            url: 'https://syncure-app-api.herokuapp.com/api/article/getMediaInfo',
            headers: { 
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          };
          const response = await Axios(config);
          console.log(response);
          if(response.data.status === "success"){
              setopen(false);
              setmedias(response.data.data.foundItems);
          }
          else{
              setopen(false);
          }
    }
    const Download = (name) => {
        setopen(true);
        var config = {
            method: 'get',
            url: `https://syncure-app-api.herokuapp.com/api/article/downloadMedia/${name}`,
            headers: { 
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
           responseType: 'blob'
        };
        Axios(config)
        .then(response => {
            var blob = new Blob([response.data]);
            FileSaver.saveAs(blob,name)
            setopen(false);
        })
        .catch((err) => {
            console.log(err);
        })
    }
    const Del_confirm = (_id) => {
        setdelete_key(_id);
        handleOpen();
    }
    const download_init = (name) => {
        Download(name);
    }
    const Delete = () => {
        setopen(true);
        const data = qs.stringify({
            id: delete_key
        });
        var config = {
            method: 'post',
            url: 'https://syncure-app-api.herokuapp.com/api/article/removeMedia',
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            data : data
        };
        Axios(config)
        .then((response) => {
            console.log(response);
            if(response.data.status === "success"){
                setmedias((prevValue) =>{
                    return prevValue.filter((media) =>{
                        return media._id !== delete_key;
                    });
                });
                setopen(false);
            }else{
                setopen(false);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
    if(localStorage.getItem('token')){
        return(
            <div className="container">
            {open ? <Loading open={open}/>: null}
                <Modal
                    className={classes.modal}
                    open={delete_modal}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500,
                    }}
                >
                <div className={classes.paper}>
                    <div className="popup">
                        <div className="popup-message">
                          <span>Are you sure you want to remove this media</span>
                        </div>
                        <div className="popup-buttons">
                          <div className="popup-button" onClick={() => {handleClose();Delete();}}>
                            <span>Yes</span>
                          </div>
                          <div className="popup-button" onClick={() => {handleClose();setdelete_key("");}}>
                            <span>No</span>
                          </div>
                        </div>
                    </div>
                </div>
                </Modal>
                <div className="passwords-header">
                <h1>Media</h1>
                <Link to="/AddMedia">
                <Tooltip title="Add" aria-label="add">
                <Fab
                style={{
                    backgroundColor:'#00ADB5',
                    color:'#eeeeee',
                }}
                >
                <AddIcon />
                </Fab>
                </Tooltip>
                </Link>
                </div>
                <div className="passwords-field">
                    {medias?.length === 0 ?(
                        <div>
                            <h4>No Stored Medias</h4>
                        </div>
                    ): (
                        <div className="passwords">
                    {medias.map((media,index) => {
                        return <Mediafield
                            key={media._id}
                            _id={media._id}
                            name={media.name}
                            description={media.description}
                            index={index}
                            Delete={Del_confirm}
                            Download={download_init}
                        />
                    })}
                    </div>
                    )} 
                </div>
            </div>
        )
    }
    else{
        return <Redirect to="/Login" />
    }
}

export default Files