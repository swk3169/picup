import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../actions/authentication';
import axios from 'axios';

import '../css/Home.css';

export default class Login extends Component {
  constructor() {
      super();
      this.state = {
          member: {},
          errors: {}
      }
  }


    render() { // localhost/auth/facebook, express 서버를 통해 로그인 후 회원 여부에 따라 /member/new, /board/:id로 redirection
        return (
            <div className = "Home">
                <h1>Picup</h1>
                <hr />
                <p><a href="https://localhost/auth/facebook" className="fl">페이스북으로 로그인</a></p>
            </div>
        );
    }

    componentDidMount() {
        console.log(localStorage.getItem('token'));
    }
}
