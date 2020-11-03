import {makeStyles} from '@material-ui/core/styles';
export const getInitial = (name) => {
    if(name){
      var words = name.split(" ");
    var initials = words[0].charAt(0).toUpperCase();
    return initials;
    }  
}
export const useStyles = makeStyles(() => ({
    root: {
        '& label.Mui-focused': {
          color: '#00ADB5',
        },
        '& label': {
            color: '#eeeeee',
          },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#eeeeee',
          },
          '&:hover fieldset': {
            borderColor: '#eeeeee',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#00ADB5',
          },
        },
        '& .MuiFormHelperText-root':{
          color:'#eeeeee'
        }
    },
    eyeButton: {
        "&": {color: "#eeeeee"},
        "&:hover": { color: "#00ADB5" },
        "&:focus": { color: "#00ADB5" },
        "& .MuiIconButton-label":{color: "#eeeeee"},
        "& .MuiIconButton-label:hover":{color: "#00ADB5"},
        "& .MuiIconButton-label:focus":{color: "#00ADB5"}
    },
    avatar: {
      margin: 10,
      color: '#eeeeee',
      backgroundColor: '#00ADB5',
      width:'200px',
      height:'200px',
      fontSize: '10rem'
    },
    setting:{
      margin:10,
      width:'50px',
      height:'50px',
      color:'#eeeeee',
      cursor:'pointer'
    },
    icon:{
      marginRight:10,
    },
    modal:{
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
    },
    paper:{
      backgroundColor:'#222831',
      border:'none',
      outline:'none',
      borderRadius:'20px',
    },
    avataricon:{
      color: '#eeeeee',
      backgroundColor: '#00ADB5',
    },
    divider:{
      backgroundColor:'rgba(255,255,255,0.2)'
    },
    menu:{
      color:'#222831'
    },
    messageIcon:{
      width:'50px',
      height:'50px',
    },
    avataricon2:{
      color: '#eeeeee',
      backgroundColor: '#00ADB5',
      width:'70px',
      height:"70px"
    },
  }));
