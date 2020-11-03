import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Error from "./Pages/Error.js";
import Home from './Pages/Home.js';
import About from './Pages/About.js';
import Dashboard from './Pages/Dashboard.js';
import ForgotPassword from './Pages/ForgotPassword.js';
import Login from './Pages/Login.js';
import ResetPassword from './Pages/ResetPassword.js'
import SignUp from './Pages/SignUp.js';
import Nav from './Components/NavigationBar.js'
import OTPAuth from './Pages/OTPAuth.js'
import LoginAuth from './Pages/LoginAuth.js'
import ChangePassword from "./Pages/ChangePassword.js"
import UpdateUserDetails from "./Pages/UpdateUserDetails.js"
import UpdateUserOTPAuth from "./Pages/UpdateUserOTPAuth.js"
import AddPassword from "./Pages/AddPassword.js"
import AdminLogin from "./Pages/AdminLogin.js"
import AdminLoginAuth from "./Pages/AdminLoginAuth.js"
import Passwords from "./Pages/Passwords.js"
import Files from "./Pages/Files.js"
import AddMedia from "./Pages/AddMedia.js"
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';


export const UserContext = React.createContext();

function App() {
  const [userData, setuserData] = useState({
    device:[],
    _id:"",
    username:"",
    email:"",
    name:"",
    twoFA:"",
    __v: "",
    uuid:""
  });
  const [temp_username, settemp_username] = useState("");
  const [storage, setstorage] = useState({
    memoryUsed:"",
    remaining:"",
    unit:""
  });
  return (
    <UserContext.Provider value={{data:[userData,setuserData], tempdata:[temp_username,settemp_username], storagedata: [storage,setstorage]}}>
    <Router>
    <div className="App">
    <Nav/>
      <Switch>
      <Route path="/OTPAuth" exact component={OTPAuth} />
        <Route path="/Error" exact component={Error} />
        <Route path="/Passwords" exact component={Passwords} />
        <Route path="/Media" exact component={Files} />
        <Route path="/Dashboard" exact component={Dashboard} />
        <Route path="/ChangePassword" exact component={ChangePassword} />
        <Route path="/UpdateUserDetails" exact component={UpdateUserDetails} />
        <Route path="/UpdateUserOTPAuth" exact component={UpdateUserOTPAuth} />
        <Route path="/AdminLogin" exact component={AdminLogin} />
        <Route path="/AdminLoginAuth" exact component={AdminLoginAuth} />
        <Route path="/AddPassword" exact component={AddPassword} />
        <Route path="/AddMedia" exact component={AddMedia} />
        <Route path="/About" exact component={About} />
        <Route path="/ResetPassword" exact component={ResetPassword} />
        <Route path="/ForgotPassword" exact component={ForgotPassword} />
        <Route path="/SignUp" exact component={SignUp} />
        <Route path="/Login" exact component={Login} />
        <Route path="/LoginAuth" exact component={LoginAuth} />
        <Route path="/" exact component={Home} />
      </Switch>
      </div>
    </Router>
    </UserContext.Provider>
  );
}
export default App;
