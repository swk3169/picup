// 로그인 화면 컴포넌트 

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../actions/authentication';
import axios from 'axios';


//import facebookLogo from '../img/facebookLogo.png';

import '../css/Login.scss';
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
                <div className='kakaologin'><a href="https://localhost/auth/kakao" >KaKao Login</a></div>
            </div>
        );
    }

    componentDidMount() {
      //console.log(localStorage.getItem('token'));
      if (localStorage.getItem('token')) {
        //this.props.history.push('/home');
        this.props.history.push('/colorfulhome');
      }

      else {
        axios.get('/auth/token2')
        .then( result => {
          console.log(result.data);
          var data = result.data.data;
          console.log(data);
          if (data.token) { // 토큰이 존재할 경우
            if (data.exist) { // 이미 회원가입이 되어 있는 경우
              localStorage.setItem('token', data.token);
              
              //this.props.getMyBoardID();
             // this.props.history.push('/home'); // home2화면으로. home2화면에서는 myboardid를 가져와 post를 보여줌
              this.props.history.push('/colorfulhome'); // home2화면으로. home2화면에서는 myboardid를 가져와 post를 보여줌
            }
            else { // 가입이 되어있지 않을 경우
              localStorage.setItem('temptoken', data.token);
              //this.props.history.push('/member/new'); // member/new화면으로
              this.props.history.push('/loginconfirm');
            }
          }
          else {
            this.props.history.push('/'); // login화면으로
          }
        })
        .catch( err => {
          console.log(err);
        });
      }
    }

    componentDidUpdate() {
      if (localStorage.getItem('token')) {
        //this.props.history.push('/home');
        this.props.history.push('/colorfulhome');
      }
    }
}

export default Login;