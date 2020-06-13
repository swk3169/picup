// 홈 화면 컴포넌트

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Login from './Login';
import Board from './Board';

import '../css/Home.scss';
import isEmpty from '../validation/is-empty';

import { loginUser, logoutUser, confirmUser } from '../actions/authentication';
import { getBoardID, getBoardInfo } from '../actions/board';
import { setMemberInfo } from '../actions/member';

import axios from 'axios';

class IdentifyHome extends Component {
  componentDidMount() {
    console.log('IdentifyHome did mount!');
    axios.get('/auth/token2')
    .then( result => {
      console.log(result.data);
      var data = result.data.data;
      console.log(data);
      if (data.token) { // 토큰이 존재할 경우
        if (data.exist) { // 이미 회원가입이 되어 있는 경우
          localStorage.setItem('token', data.token);
          
          //this.props.getMyBoardID();
          this.props.history.push('/home'); // home2화면으로. home2화면에서는 myboardid를 가져와 post를 보여줌
        }
        else { // 가입이 되어있지 않을 경우
          localStorage.setItem('token', data.token);
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
 
  render() {
    return <div></div>
  }
}

IdentifyHome.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    board: state.board,
    member: state.member
})

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
    loginUser: (token) => dispatch(loginUser(token)),
    logoutUser: () => dispatch(logoutUser()),
    getMyBoardID: () => {
      var token = localStorage.token;
      var config = {
        headers: {'Authorization': 'Bearer ' + token},
      };
      axios.get('/api/member/me', config )
      .then((result) => { // axios는 비동기 방식이라서 return 값을 호출한 곳에서 받지 못함
        console.log('in getMyBoardID axios')
        console.log(result.data.data);
        if (result.data.success) {
          const id = result.data.data.privateBoard;
          dispatch(getBoardID(id));                   // boardID 업데이트
          dispatch(setMemberInfo(result.data.data));  // 멤버 정보 
          dispatch(confirmUser(true));
        }
        else {
          dispatch(confirmUser(false));
          dispatch(logoutUser());
        }
      });
      //dispatch(getMyBoardID(conf));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(IdentifyHome);
