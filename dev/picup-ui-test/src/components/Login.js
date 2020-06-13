// 로그인 화면 컴포넌트 

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../actions/authentication';
import axios from 'axios';


//import facebookLogo from '../img/facebookLogo.png';

import '../css/Login.css';
import facebooklogo from '../img/facebook.png';

class Login extends Component {
  constructor() {
      super();
  }

    render() { // localhost/auth/facebook, express 서버를 통해 로그인 후 회원 여부에 따라 /member/new, /board/:id로 redirection
        return (
            <div className = "Login">
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <div className='facebooklogin'><a href="https://localhost/auth/facebook" >Facebook Login</a></div>
                <div className='kakaologin'><a href="http://localhost:4000/auth/kakao" >KaKao Login</a></div>
            </div>
        );
    }

    componentDidMount() {
      //console.log(localStorage.getItem('token'));
      if (localStorage.getItem('token')) {
        this.props.history.push('/home');
      }
    }

    componentDidUpdate() {
      if (localStorage.getItem('token')) {
        this.props.history.push('/home');
      }
    }
}

export default Login;