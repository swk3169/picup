import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authentication';
import { withRouter } from 'react-router-dom';

class CreatePost extends Component {
    render() {
        return(
              <div>
                만든다
              </div>
        );
    }
}

export default CreatePost;
