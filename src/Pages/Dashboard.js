import React, {useEffect,useState}from 'react'
import {UserContext} from "../App.js"
import Axios from "axios"
import "../Pages-css/Dashboard.css"
import { Redirect } from 'react-router-dom';
import { Avatar } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import FolderIcon from '@material-ui/icons/Folder';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import {useStyles,getInitial} from "../util.js"
import {Link} from "react-router-dom";
import Fab from '@material-ui/core/Fab';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ToggleOnIcon from '@material-ui/icons/ToggleOn';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import qs from "qs";
import Loading from "../Pages/Loading.js";
function Dashboard() {
    const classes = useStyles();
    const data = React.useContext(UserContext).data;
    const storagedata = React.useContext(UserContext).storagedata;
    const [userData, setuserData] = data;
    const [storage,setstorage] = storagedata;
    const [showData, setShowData] = React.useState(false);
    const [setting_modal, setsetting_modal] = useState(false);
    const [remove_user_modal, setremove_user_modal] = useState(false);
    const [toggle_twoFA_modal, settoggle_twoFA_modal] = useState(false);
    const [error_state, seterror_state] = useState(false);
    const [success_state, setsuccess_state] = useState(false);
    const [open,setopen] = useState(false);
    const handleOpen = () => {
        setsetting_modal(true);
      };
    const handleClose = () => {
        setsetting_modal(false);
    };
    const handleToggle_modal =() => {
      settoggle_twoFA_modal(!toggle_twoFA_modal);
    };
    const handleRemove_modal =() => {
      setremove_user_modal(!remove_user_modal);
    };
    const handleError = () => {
      seterror_state(!error_state);
    };
    const handleSuccess =() => {
      setsuccess_state(!success_state);
    }
    useEffect(() => {
        if(localStorage.getItem('token')){
        getStorageData();
        getUserData();
        setShowData(true);
        }
    }, []);


    const getUserData = async () => {
        var config = {
            method: "get",
            url: `https://syncure-app-api.herokuapp.com/api/user/find`,
            headers: { 
              Authorization: 'Bearer ' + localStorage.getItem('token')
            }
          };
        const response = await Axios(config);
        console.log(response);
        setuserData(response.data.data);
    }


    const getStorageData = async () => {
        var config = {
            method: 'get',
            url: `https://syncure-app-api.herokuapp.com/api/user/storage`,
            headers: { 
              Authorization: 'Bearer ' + localStorage.getItem('token')
            }
          };
          const response = await Axios(config);
          console.log(response);
          setstorage(response.data.data);
    }


    const removeUser = () => {
      setopen(true);
      var config = {
        method: 'post',
        url: 'https://syncure-app-api.herokuapp.com/api/user/remove',
        headers: { 
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      };
      Axios(config)
      .then((response) => {
        console.log(response);
        setopen(false);
        if(response.data.status === "success"){
          localStorage.removeItem('device'.concat(userData.username));
          localStorage.removeItem('token');
            setuserData({
              device:[],
              id:"",
              username:"",
              email:"",
              name:"",
              twoFA:"",
              __v: ""
            });
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


    const toggle_twoFA = () => {
      setopen(true);
      var  senddata;
      if (localStorage.getItem('device'.concat(userData.username))){
       senddata = qs.stringify({
        username:userData.username,
        twoFA:!userData.twoFA,
        device: userData.device[0]
      });
    }
    else{
       senddata = qs.stringify({
        username:userData.username,
        twoFA:!userData.twoFA,
      });
    }
    console.log(senddata)
      var config = {
        method: 'post',
        url: 'https://syncure-app-api.herokuapp.com/api/toggleTwoFA',
        headers: { 
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        data : senddata
      };
      Axios(config)
      .then((response) => {
        console.log(response);
        if(response.data.status === "success"){
          if(response.data.data.device){
            localStorage.setItem('device'.concat(userData.username),response.data.data.device);
            setuserData((prevValue) => {
              return{
                ...prevValue,[userData.twoFA]:false,
              }
            });
            console.log(userData);
            setopen(false);
            handleSuccess();
          }
          else{
            localStorage.removeItem('device'.concat(userData.username));
            setuserData((prevValue) => {
              return{
                ...prevValue,[userData.twoFA]:true,
              }
            });
            console.log(userData);
            setopen(false);
            handleSuccess();
          }
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


    const logout = ()=>{
      var config = {
        method: "post",
        url: `https://syncure-app-api.herokuapp.com/api/logout/${userData.username}`,
        headers: { 
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      };
        Axios(config)
        .then((response) => {
            console.log(JSON.stringify(response));
            localStorage.removeItem('token');
            setuserData({
              device:[],
              id:"",
              username:"",
              email:"",
              name:"",
              twoFA:"",
              __v: ""
            });
        })
        .catch((error) => {
            console.log(error);
        })
    }


    if(localStorage.getItem('token')){
        if(showData){
            return (
                <div className="container">
                {open ? <Loading open={open}/>: null}
                    <Modal
                        className={classes.modal}
                        open={error_state}
                        onClose={handleError}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                          timeout: 500,
                        }}
                    >
                      <div className={classes.paper}>
                        <div className="message error">
                          <div >
                          <HighlightOffIcon className={classes.messageIcon}/>
                          </div>
                          <div >
                            <p>Sorry something went wrong</p>
                          </div>
                        </div>
                      </div>
                    </Modal>
                    <Modal
                        className={classes.modal}
                        open={success_state}
                        onClose={handleSuccess}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                          timeout: 500,
                        }}
                    >
                      <div className={classes.paper}>
                        <div className="message success">
                          <div >
                          <CheckCircleIcon className={classes.messageIcon}/>
                          </div>
                          <div >
                            <p>Successfully Completed</p>
                          </div>
                        </div>
                      </div>
                    </Modal>
                    <Modal
                        className={classes.modal}
                        open={remove_user_modal}
                        onClose={handleRemove_modal}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                          timeout: 500,
                        }}
                    >
                      <div className={classes.paper}>
                        <div className="popup">
                          <div className="popup-message">
                          <span>Are you sure you want to remove your Profile</span>
                          </div>
                          <div className="popup-buttons">
                            <div className="popup-button" onClick={() => {handleRemove_modal();handleClose();removeUser();}}>
                            <span>Yes</span>
                            </div>
                            <div className="popup-button" onClick={() => {handleRemove_modal();handleClose();}}>
                            <span>No</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Modal>
                    <Modal
                        className={classes.modal}
                        open={toggle_twoFA_modal}
                        onClose={handleToggle_modal}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                          timeout: 500,
                        }}
                    >
                      <div className={classes.paper}>
                        <div className="popup">
                          <div className="popup-message">
                          <span>Are you sure you want to {userData.twoFA ? "Turn Off Two Factor Authentication" : "Turn On Two Factor Authentication"}</span>
                          </div>
                          <div className="popup-buttons">
                            <div className="popup-button" onClick={() => {handleToggle_modal();handleClose();toggle_twoFA();}}>
                            <span>Yes</span>
                            </div>
                            <div className="popup-button" onClick={() => {handleToggle_modal();handleClose();}}>
                            <span>No</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Modal>
                    <Modal
                        className={classes.modal}
                        open={setting_modal}
                        onClose={handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                          timeout: 500,
                        }}
                    >
                    <div className={classes.paper}>
                        <List>
                            <Link to="/ChangePassword">
                            <ListItem button>
                              <ListItemAvatar>
                                <Avatar className={classes.avataricon}>
                                  <EditIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText primary="Change Password" />
                            </ListItem>
                            </Link>
                            <Divider className={classes.divider} variant="inset" component="li" />
                            <Link to="/UpdateUserDetails">
                            <ListItem button>
                              <ListItemAvatar>
                                <Avatar className={classes.avataricon}>
                                  <AccountCircleIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText primary="Edit Profile"/>
                            </ListItem>
                            </Link>
                            <Divider className={classes.divider} variant="inset" component="li" />
                            <ListItem  button onClick={handleToggle_modal}>
                              <ListItemAvatar>
                                <Avatar className={classes.avataricon}>
                                <ToggleOnIcon/>
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText primary={userData.twoFA ? "Turn Off Two Factor Authentication" : "Turn On Two Factor Authentication"}/>
                            </ListItem>
                            <Divider className={classes.divider} variant="inset" component="li" />
                            <ListItem button onClick={handleRemove_modal}>
                              <ListItemAvatar>
                                <Avatar className={classes.avataricon}>
                                  <HighlightOffIcon/>
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText primary="Remove Profile"/>
                            </ListItem>
                            <Divider className={classes.divider} variant="inset" component="li" />
                            <ListItem button onClick={logout}>
                              <ListItemAvatar>
                                <Avatar className={classes.avataricon}>
                                  <ExitToAppIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText primary="Logout"/>
                            </ListItem>
                        </List>
                        </div>
                    </Modal>
                    <div className="profile">
                        <div className="profile-img"> 
                            <Avatar className={classes.avatar}>{getInitial(userData.username)}</Avatar>
                        </div>
                        <div className="profile-info">
                            <div className="profile-info-header">
                                <h1>{userData.username}</h1>
                                <Tooltip title="Settings" aria-label="settings">
                                <SettingsIcon className={classes.setting} onClick={handleOpen}/>
                                </Tooltip>
                            </div>
                            <div>
                                <h3>{userData.name}</h3>
                            </div>
                            <div>
                                <h5>{userData.email}</h5>
                                <h5>Storage used: {storage.memoryUsed} {storage.unit}</h5>
                                <h5>Storage Remaining: {storage.remaining} {storage.unit}</h5>
                            </div>
                        </div>
                    </div>
                    <div className="profile-buttons">
                        <div className="profile-button">
                        <Link to="/Media">
                        <Fab
                        variant="extended"
                        style={{
                            backgroundColor:'#00ADB5',
                            color:'#eeeeee',
                            width:'150px',
                            height:'50px'
                        }}
                        >
                        <FolderIcon className={classes.icon}/>
                        Media
                        </Fab>
                        </Link>
                        </div>
                        <div className="profile-button">
                        <Link to="/Passwords">
                        <Fab
                        variant="extended"
                        style={{
                            backgroundColor:'#00ADB5',
                            color:'#eeeeee',
                            width:'150px',
                            height:'50px'
                        }}
                        >
                        <FingerprintIcon className={classes.icon}/>
                        Passwords
                        </Fab>
                        </Link>
                        </div>
                    </div>
                </div>
            )
        }  
        else{
            return <h1>Loading</h1>
        }
    }
    else{
       return  <Redirect to="/Login" />
    } 
}
export default Dashboard