import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import Spinner from '../layout/Spinner';  
import { getProfileByID } from '../../actions/profile';
import { Link } from 'react-router-dom';
import profileTop from './profileTop';

const Profile = ({
    getProfileByID,
    profile: {profile,loading},
    auth,
    match}) => {
    useEffect (() => {
        getProfileByID(match.params.id);
    }, [getProfileByID,match.params.id]);


  return (
    <Fragment>
        {profile == null || loading ? (
             <Spinner/>
        ):(
           <Fragment>
               <Link to='/profiles' className='btn btn-light'>
                   Back  to profiles
               </Link>
               {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link to="/edit-profile" className="btn btn-dark">
                Edit Profile
              </Link>
            )}
            <div class="profile-grid my-1">
              <profileTop profile={profile}/>

            </div>
           </Fragment>

        )}
    </Fragment>
  )
}

Profile.propTypes = {

    getProfileByID: PropTypes.func.isRequired,
    profile : PropTypes.object.isRequired,
    auth : PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile : state.profile,
    auth: state.auth

});

export default connect(mapStateToProps,{getProfileByID})(Profile);