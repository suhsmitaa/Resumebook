import { GET_PROFILE, PROFILE_ERROR,CLEAR_PROFILE,UPDATE_PROFILE, GET_PROFILES} from "../actions/types";

const initialState ={
    token: localStorage.getItem('token'),
    profile: null,
    profiles:[],
    repos: [],
    loading: true,
    error: {}

}

export default function(state = initialState,action){
    const {type,payload} = action;

    switch(type){
        case GET_PROFILE:
        case UPDATE_PROFILE:
            localStorage.setItem('token', payload.token);
            return{
                ...state,
                loading: false,
                profile: payload
            };
        case GET_PROFILES:
            return{
                ...state,
                profiles:payload,
                loading:false
            }  ;  

       
             
        case PROFILE_ERROR:
            return{
                ...state,
                profile: null,
                loading: false
                

            }
        case CLEAR_PROFILE:
            return{
                ...state,
                profile: null,
                repos:[],
                
                }    
        case GET_REPOS:
            return{
                repos:payload,
                loading:false
            }
        default:
            return state;
            

        

    }
}