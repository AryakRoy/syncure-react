import React, {useEffect,useState}from 'react'
import Axios from "axios"
import qs from "qs"
import Modal from '@material-ui/core/Modal';
import { Redirect, Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import Passwordfield from "../Components/Passwordfield";
import Backdrop from '@material-ui/core/Backdrop';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import "../Pages-css/Passwords.css"
import Loading from "../Pages/Loading.js"
import {useStyles} from "../util.js"
import "../Pages-css/Passwords.css"
function Passwords() {
    const classes = useStyles();
    const [passwords, setpasswords] = useState([]);
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
           getPasswords();
        }
    }, []);
    const getPasswords = async () => {
        setopen(true);
        var config = {
            method: 'post',
            url: 'https://syncure-app-api.herokuapp.com/api/article/findAllPasswords',
            headers: { 
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          };
          const response = await Axios(config);
          console.log(response);
          if(response.data.status === "success"){
              setopen(false);
              setpasswords(response.data.data.foundItems);
          }
          else{
              setopen(false);
          }
    }
    const Del_confirm = (_id) => {
        setdelete_key(_id);
        handleOpen();
    }
    const Delete = () => {
        setopen(true);
        const data = qs.stringify({
            id: delete_key
        });
        var config = {
            method: 'post',
            url: 'https://syncure-app-api.herokuapp.com/api/article/removePassword',
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            data : data
        };
        Axios(config)
        .then((response) => {
            console.log(response);
            if(response.data.status === "success"){
                setpasswords((prevValue) =>{
                    return prevValue.filter((password) =>{
                        return password._id !== delete_key;
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
        return (
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
                          <span>Are you sure you want to remove this password</span>
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
                <h1>Passwords</h1>
                <Link to="/AddPassword">
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
                    {passwords?.length === 0 ?(
                        <div>
                            <h4>No Stored Passwords</h4>
                        </div>
                    ): (
                        <div className="passwords">
                    {passwords.map((password,index) => {
                        let dot_code = "*".repeat(password.code.length);
                        console.log(dot_code);
                        return <Passwordfield 
                            key={password._id}
                            _id={password._id}
                            title={password.title}
                            code={password.code}
                            dot_code={dot_code}
                            index={index}
                            Delete={Del_confirm}
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

export default Passwords