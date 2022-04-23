import React,{ Fragment, useEffect} from  'react';
import { BrowserRouter as Router,Route,Switch } from 'react-router-dom';
import './App.css';
import Landing from './componenets/layout/Landing';
import Navbar from './componenets/layout/Navbar';
import Register from './componenets/auth/Register';
import Login from './componenets/auth/Login';
import Alert from './componenets/layout/Alert';
import { loadUser} from './actions/auth';
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './utils/setAuthToken';
import Dashboard from './componenets/dashboards/Dashboard';
import CreateProfile from './componenets/profile-forms/CreateProfile';
import EditProfile from './componenets/profile-forms/EditProfile';
import PrivateRoute from './componenets/routing/PrivateRoute';
import AddExperience from './componenets/profile-forms/AddExperience';
import AddEducation from './componenets/profile-forms/AddEducation';
import Profiles from './componenets/profiles/Profiles';
import Profile from './componenets/profile/profile';

if(localStorage.token){
  setAuthToken(localStorage.token);
}

const App = () =>{
  useEffect(()=>{
    store.dispatch(loadUser()); 

  }, []);  //hooks
  
  return (
    <Provider store={store}>
    <Router>
  <Fragment>
    <Navbar/>
   
      <Route exact path='/' component={Landing} />
    <section className='container'>
      <Alert/> 
      <Switch>
        <Route exact path='/register' component={Register}/>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/profiles' component={Profiles}/>
        <Route exact path='/profile/:id' component={Profile}/>
        <PrivateRoute exact path='/dashboard' component={ Dashboard }/>
        <PrivateRoute exact path='/create-profile' component={  CreateProfile }/>
        <PrivateRoute exact path='/edit-profile' component={  EditProfile }/>
        <PrivateRoute exact path='/add-experience' component={  AddExperience }/>
        <PrivateRoute exact path='/add-education' component={  AddEducation }/>
      </Switch>
    </section>
  </Fragment>
  </Router>
  </Provider>
  )
};

export default App;
// private route to force user to logged in first