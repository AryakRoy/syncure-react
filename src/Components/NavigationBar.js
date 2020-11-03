import React from 'react'
import logo from "../Images/logo.png";
import '../Components-css/NavigationBar.css';
import {Navbar, Nav} from 'react-bootstrap';
import {Avatar, Button, Menu, MenuItem,Link} from "@material-ui/core";
import {getInitial} from "../util.js";
import Axios from "axios";
import {UserContext} from "../App.js"
import {makeStyles} from '@material-ui/core/styles';
const useStyles = makeStyles({
  avatar: {
    margin: 10,
    color: '#eeeeee',
    backgroundColor: '#00ADB5',
  },
});

function NavigationBar() {
  const classes = useStyles();
    const [nav_username, setnav_username] = React.useState("");
    const [username, setusername] = React.useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const data = React.useContext(UserContext).data;
    const setuserData = data[1];
      React.useEffect(() => {
        if(localStorage.getItem('token')){
        getUserData();
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
      if(response.data.status === "success"){
      setnav_username(response.data.data.name);
      setusername(response.data.data.username);
      console.log(nav_username);
      }
      else{
        localStorage.removeItem('token');
      }
  }
    const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
    const logout = ()=>{
      var config = {
        method: "post",
        url: `https://syncure-app-api.herokuapp.com/api/logout/${username}`,
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
    return (
        
            <Navbar collapseOnSelect expand="lg" variant="dark">
            <Navbar.Brand href="/"><img src={logo} alt ="Syncure Logo" className="navbar__logo_image"/>Syncure</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
            <Nav>
            <Nav.Link href="/About">About</Nav.Link>
            {localStorage.getItem('token') ? (
                <div className="login-avatar">
                {console.log()}
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}><Avatar className={classes.avatar}>{getInitial(nav_username)}</Avatar></Button>
                <div>
                <Menu 
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  className="menu"
                >
                  <Link href="/Dashboard"><MenuItem>Profile</MenuItem></Link>
                  <Link href="/Media"><MenuItem>Files</MenuItem></Link>
                  <Link href="/Passwords"><MenuItem>Passwords</MenuItem></Link>
                  <Link onClick= {logout}><MenuItem>Logout</MenuItem></Link>
                </Menu>
                </div>
                </div>
                
            ) : 
            (
            <div className="login_div">
            <Nav.Link href="/Login">Login</Nav.Link>
            <Nav.Link href="/SignUp">Signup</Nav.Link>
            </div>
            )}
            </Nav>
            </Navbar.Collapse>
            </Navbar>   
    );
}



export default NavigationBar;
