import axios from "axios";
import { setAlert } from "./alert";
import {UPDATE_PROFILE,GET_PROFILE,PROFILE_ERROR, CLEAR_PROFILE, DELETE_ACCOUNT,GET_PROFILES,GET_REPOS } from './types';
import setAuthToken from '../utils/setAuthToken';
//import api from '../utils/api';


export const getCurrentProfile=() =>async dispatch =>{
    if(localStorage.token){ 
        setAuthToken(localStorage.token);   

    }
    try {

        const res = await axios.get('api/profile/me');

        dispatch({
            type:GET_PROFILE,
            payload: res.data
        }); 
        
    } catch (error) {

        dispatch({
            type:PROFILE_ERROR,
            payload : {msg: error.response.statusText,status: error.response.status}
        })
        
    }
}


export const getProfiles=() =>async dispatch =>{
    dispatch({ type: CLEAR_PROFILE});
    try {

        const res = await axios.get('api/profile');

        dispatch({
            type:GET_PROFILES,
            payload: res.data
        }); 
        
    } catch (error) {

        dispatch({
            type:PROFILE_ERROR,
            payload : {msg: error.response.statusText,status: error.response.status}
        })
        
    }
}


export const getProfileByID =userId =>async dispatch =>{
  
    try {

        const res = await axios.get(`/profile/user/${userId}`);

        dispatch({
            type:GET_PROFILE,
            payload: res.data
        }); 
        
    } catch (error) {

        dispatch({
            type:PROFILE_ERROR,
            payload : {msg: error.response.statusText,status: error.response.status}
        })
        
    }
}

export const getGithubRepos =username =>async dispatch =>{
  
    try {

        const res = await axios.get(`/api/profile/github/${username}`);

        dispatch({
            type:GET_REPOS,
            payload: res.data
        }); 
        
    } catch (error) {

        dispatch({
            type:PROFILE_ERROR,
            payload : {msg: error.response.statusText,status: error.response.status}
        })
        
    }
}

//create profile

export const createProfile =(formData, history,edit =false) => async dispatch =>{
    try {
       const config ={
           headers:{
               'content-Type':'application/json'
           }
       }
       const res =await axios.post('/api/profile',formData,config);
       dispatch({
        type:GET_PROFILE,
        payload: res.data
    }); 
    dispatch(setAlert(edit ? 'Profile Updated': 'Profile Created'));

    if(!edit){
        history.push('/dashboard');
    }
    } catch (error) {

        const errors=error.response.data.errors;    

        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
                
            }

        dispatch({
            type:PROFILE_ERROR,
            payload : {msg: error.response.statusText,status: error.response.status}
        });
        
    }
};

//Add experience

export const addExperience =(formData,history)=>async dispatch=>{

    try {
        const config ={
            headers:{
                'content-Type':'application/json'
            }
        }
        const res =await axios.put('/api/profile/experience',formData,config);
        dispatch({
         type:UPDATE_PROFILE,
         payload: res.data
     }); 
     dispatch(setAlert('Experience Added','Success'));
 
    
         history.push('/dashboard');
     
     } catch (error) {
 
         const errors=error.response.data.errors;    
 
         if(errors){
             errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
                 
             }
 
         dispatch({
             type:PROFILE_ERROR,
             payload : {msg: error.response.statusText,status: error.response.status}
         });
         
     }

};

//Add education


export const addEducation =(formData,history)=>async dispatch=>{

    try {
        const config ={
            headers:{
                'content-Type':'application/json'
            }
        }
        const res =await axios.put('/api/profile/education',formData,config);
        dispatch({
         type:UPDATE_PROFILE,
         payload: res.data
     }); 
     dispatch(setAlert('Education Added','Success'));
 
    
         history.push('/dashboard');
     
     } catch (error) {
 
         const errors=error.response.data.errors;    
 
         if(errors){
             errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
                 
             }
 
         dispatch({
             type:PROFILE_ERROR,
             payload : {msg: error.response.statusText,status: error.response.status}
         });
         
     }

};

export const deleteExperience = (id) => async (dispatch) => {
    try {
      const res = await axios.delete(`/profile/experience/${id}`);
  
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });
  
      dispatch(setAlert('Experience Removed', 'success'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };


export const deleteEducation = (id) => async (dispatch) => {
    try {
      const res = await axios.delete(`/profile/education/${id}`);
  
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });
  
      dispatch(setAlert('Education Removed', 'success'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
  


  export const deleteAccount = (id) => async (dispatch) => {
      if(window.confirm('Are your sure? this cannot be undone')){
    try {
      await axios.delete('/api/profile');
  
      dispatch({
        type: CLEAR_PROFILE
       
      });
      dispatch({
        type: DELETE_ACCOUNT
       
      });
  
      dispatch(setAlert('Your account has been permanently deleted'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
}
  };
  
