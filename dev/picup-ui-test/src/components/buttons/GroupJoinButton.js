// 그룹 가입 버튼 컴포넌트

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'; // withRouter로 Component를 감싸면 this.props.history를 사용할 수 있게 해줌
import { connect } from 'react-redux';
import { setIsJoined, setWriteAuth } from '../../actions/board';

import PropTypes from 'prop-types';

import axios from 'axios';
import isEmpty from '../../validation/is-empty';

import '../../css/GroupJoinButton.css';
import isSuccessed from '../../validation/is-successed';

class GroupJoinButton extends Component {

  constructor() {
    super();
  }

  onClick(e) {
    e.preventDefault();
    
    var token = localStorage.token;
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };

    var boardID = this.props.board.boardID;

    var token = localStorage.token;
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };

    console.log('in GroupJoinButton click');
    console.log(this.props.board.boardID);
    // 회원 가입
    axios.post('/api/board/' + boardID + '/member/me', {}, config)
    .then( (result) => {
      console.log(result.data);
      if (!isEmpty(result.data.data)) {
        console.log('is Registered?');
        console.log(result.data.data);
        this.props.setIsJoined(true);
        console.log(result.data.data.writeAuth);

        if (isSuccessed(result.data.data.writeAuth)) {
          console.log('글쓰기 권한 존재!');
          this.props.setWriteAuth(true);
        }
        else {
          console.log('글쓰기 권한 없음!');
          this.props.setWriteAuth(false);
        }
        
      }
      else {
      }
    })
    .catch( (err) => {
      console.log(err);
    });
  }

  render() {
    return(
      <button className='btn btn-default GroupJoinButton' onClick={this.onClick.bind(this)}>가입</button>
    )
  }
}

const mapStateToProps = (state) => ({
  board: state.board
});

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
  setIsJoined: (isJoined) => dispatch(setIsJoined(isJoined)),
  setWriteAuth: (writeAuth) => dispatch(setWriteAuth(writeAuth))
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupJoinButton)
