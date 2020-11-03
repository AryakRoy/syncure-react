import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import "../Components-css/Passwordfield.css";
import { IconButton } from "@material-ui/core";
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import {useStyles} from "../util.js";
import Axios from "axios"
function Mediafield(props) {
    const classes = useStyles();
    
    return (
        <div className="field-div">
            <div className="field-no">
            <span>{props.index + 1}</span>
            </div>
            <div className="field-title">
            <span>{props.name}</span>
            </div>
            <div className="field-code">
            <span>{props.description}</span>
            </div>
            <div>
            <IconButton
                classes={{
                    root: classes.eyeButton
                }}
                aria-label="toggle password visibility"
                onClick={() => props.Delete(props._id)}
                >
                <DeleteIcon />
            </IconButton>
            <IconButton
                classes={{
                    root: classes.eyeButton
                }}
                download
                aria-label="toggle password visibility"
                onClick={() => props.Download(props.name)}
                >
            <ArrowDownwardIcon />
            </IconButton>
            
            </div>
        </div>
    )
}

export default Mediafield
