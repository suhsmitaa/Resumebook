import React, {Fragment , useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import { PropTypes} from 'prop-types';  
import {login } from '../../actions/auth'; 



//promise
const Login = ({ login, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: '',
        password:''
     

    });

    const {email,password} =formData;
    const onChange =e => setFormData({...formData, [e.target.name]: e.target.value });

    const onSubmit =async e  => {
        e.preventDefault();
        
        login(email,password)


        
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
        
    };

    if(isAuthenticated){
        return <Redirect to="/dashboard"/>
    }
   return (
    <Fragment>
    <h1 className="large text-primary">Sign In</h1>
<p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>

<form  method="POST" className="form"  onSubmit = {e => onSubmit(e)}>

 <div className="form-group">
   <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} required />
  
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

 
 <input type="submit" className="btn btn-primary" value="Login" />
</form>

<p className="my-1">
 Dont have an account? <Link to="/register">Sign Up</Link>
</p>
</Fragment>
);

   
};

Login.prototype={
    login:PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
    

}

const mapStateToProps = state =>({
    isAuthenticated: state.auth.isAuthenticated
}); 
export default connect(mapStateToProps,{ login })(Login);