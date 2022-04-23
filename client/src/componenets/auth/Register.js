import React, {Fragment , useState} from 'react';
import {Link,Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import {setAlert } from '../../actions/alert';
import { PropTypes} from 'prop-types';  
import {registerr } from '../../actions/auth'; 


//promise
const Register = ({setAlert, registerr,isAuthenticated}) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password:'',
        password2:''

    });

    const {name,email,password,password2} =formData;
    const onChange =e => setFormData({...formData, [e.target.name]: e.target.value });

    const onSubmit =async e  => {
        e.preventDefault();
        if(password !== password2){
            setAlert.setAlert('Password do not match');
        }else{
          registerr({name,email,password});


        
          /* const newUser={
               name,
               email,
               password
           }
           try {
               const config ={
                   
                   headers: {
                   
                       'Content-Type' : 'applicatipn/json'

                   }
               }
               const body = JSON.stringify(newUser);    
               const res = await axios.post('http://localhost:3000/api/users',body,config);
               console.log(res.data);
               
           } catch (error) {
               console.error(error.response.data);
           }*/
        }
    };

    if(isAuthenticated){
      return <Redirect to='/dashboard'/>;
    }
   return (
    <Fragment>
    <h1 className="large text-primary">Sign Up</h1>
<p className="lead"><i className="fas fa-user"></i> Create Your Account</p>

<form method="POST" className="form"  onSubmit = {e => onSubmit(e)}>
 <div className="form-group">
   <input type="text" placeholder="Name" name="name" value={name} onChange={e => onChange(e)} required />
 </div>
 <div className="form-group">
   <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} required />
   <small className="form-text"
     >This site uses Gravatar so if you want a profile image, use a
     Gravatar email</small>
 </div>
 <div className="form-group">
   <input
     type="password"
     placeholder="Password"
     name="password"
     value={password} 
     onChange={e => onChange(e)} 
     minLength="6"
   />
 </div>
 <div className="form-group">
   <input
     type="password"
     placeholder="Confirm Password"
     name="password2"
     value={password2} 
     onChange={e => onChange(e)} 
     minLength="6"
   />
 </div>
 <input type="submit" className="btn btn-primary" value="Register" />
</form>

<p className="my-1">
 Already have an account? <Link to="/login">Sign In</Link>
</p>
</Fragment>
);

   
};

Register.propTypes ={
    setAlert: PropTypes.func.isRequired,
    registerr: PropTypes.func.isRequired,
    isAuthenticated:PropTypes.bool
}

const mapStateToProps = state =>({
  isAuthenticated: state.auth.isAuthenticated
}); 
export default connect(mapStateToProps,{setAlert,registerr})(Register);