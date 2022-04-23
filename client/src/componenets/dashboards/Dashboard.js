import React,{Fragment, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {getCurrentProfile,deleteAccount } from '../../actions/profile';
//import Spinner from '../layout/Spinner';
import DashBoardAction from './DashBoardAction';
import Experience from './Experience';
import Education from './Education';



const Dashboard = ({
    getCurrentProfile,
    deleteAccount,
    auth: { user },
    profile: { profile }
  }) => {
    useEffect(() => {
      getCurrentProfile();
    }, [getCurrentProfile]);
  
    return (
      <section className="container">
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
          <i className="fas fa-user" /> Welcome {user && user.name}
        </p>
        {profile !== null ? (
          <>
            <DashBoardAction/>
            <>
            <p>Or if you have not yet setup a profile, please add some info</p>
            <Link to="/create-profile" className="btn btn-primary my-1">
              Create Profile
            </Link>
          </>
           
<div className="my-2">
  <button className="btn btn-danger" onClick={() => deleteAccount()}>
    <i className="fas fa-user-minus"></i>Delete my Account
  </button>
</div>
            </>
        ) : (
          <>
            <p>You have not yet setup a profile, please add some info</p>
            <Link to="/create-profile" className="btn btn-primary my-1">
              Create Profile
            </Link>
          </>
        )}
      </section>
    );
  };
  
  Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.array.isRequired
  };
  
  const mapStateToProps = (state) => ({
    auth: state.auth,
    profile: state.profile
  });
  
  export default connect(mapStateToProps, { getCurrentProfile,deleteAccount})(
    Dashboard
  );