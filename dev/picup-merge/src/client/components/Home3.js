// 홈 화면 컴포넌트

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Login from './Login';
import ColorfulBoard from './ColorfulBoard';

import '../css/Home.scss';
import isEmpty from '../validation/is-empty';

import { loginUser, logoutUser, confirmUser } from '../actions/authentication';
import { getBoardID, getBoardInfo } from '../actions/board';
import { setMemberInfo } from '../actions/member';

import axios from 'axios';

class Home3 extends Component {
  constructor(props) {
    super(props);

    console.log('Home3');
  }
  componentDidMount() {
    console.log('뀨?');
    var token = localStorage.getItem('token');
    console.log(token);
    this.props.loginUser(token);
    this.props.getMyBoardID();
  }

  componentDidUpdate(prevProps, prevState) { // props를 받아온 후 이전 props와 다를 경우 getBoardInfo를 통해 게시판 정보를 받아옴
    console.log('in Home Component Did Update')
    if (!this.props.board.boardID) {
    //  var token = localStorage.getItem('token');
    //  this.props.loginUser(token);
      this.props.getMyBoardID(); 
    }
  }

  render() {
    return (
      <div>
        <ColorfulBoard boardID={this.props.board.boardID}/>
      </div>
    )
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(Home3);
