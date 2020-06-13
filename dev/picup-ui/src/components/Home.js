import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Login from './Login';
import Board from './Board';

import PostContainer from '../containers/PostContainer';

import '../css/Home.css';

class Home extends Component {
    render() {
      const isAuthenticated = this.props.auth.isAuthenticated; // 인증 여부 확인
      console.log("in Home!");
      //console.log(isAuthenticated);

      const authLinks = (
          <div className="container">
            <PostContainer />
          </div>
      )
      const guestLinks = (
        <div>
          <Login />
        </div>
      )

        return ( // 인증 여부에 따라 home화면 guest화면을 보여줌
            <div className = "Home">
                {isAuthenticated ? authLinks : guestLinks}
            </div>
        );
    }
}
Home.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps)(withRouter(Home));
