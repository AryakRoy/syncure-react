import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import "../Components-css/Passwordfield.css";
import { IconButton } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {useStyles} from "../util.js";
function Passwordfield(props) {
    const classes = useStyles();
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    
    return (
        <div className="field-div">
            <div className="field-no">
            <span>{props.index + 1}</span>
            </div>
            <div className="field-title">
            <span>{props.title}</span>
            </div>
            <div className="field-code">
            <span>{showPassword?props.code:props.dot_code}</span>
            <IconButton
                classes={{
                    root: classes.eyeButton
                }}
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                >
                {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
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
            </div>
        </div>
    )
}

export default Passwordfield
