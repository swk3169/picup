// 그룹 탈퇴 버튼 컴포넌트

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'; // withRouter로 Component를 감싸면 this.props.history를 사용할 수 있게 해줌
import { connect } from 'react-redux';
import { setIsJoined, setWriteAuth } from '../../actions/board';

import PropTypes from 'prop-types';

import axios from 'axios';
import isEmpty from '../../validation/is-empty';

import '../../css/GroupExitButton.css';

class GroupExitButton extends Component {

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

    console.log('in GroupExitButton click');
    console.log(this.props.board.boardID);
    // 회원 탈퇴
    axios.delete('/api/board/' + boardID + '/member/me', config)
    .then( (result) => {
      console.log(result.data);
      if (!isEmpty(result.data.data)) {
        console.log('is Exited?');
        console.log(result.data.data);
        this.props.setIsJoined(false);
        this.props.setWriteAuth(false);
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
      <button className='btn btn-default GroupExitButton' onClick={this.onClick.bind(this)}>탈퇴</button>
    )
  }
}

const mapStateToProps = (state) => ({
  board: state.board
});

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
  setIsJoined: (isJoined) => dispatch(setIsJoined(isJoined)),
  setWriteAuth: (writeAuth) => dispatch(setIsJoined(writeAuth))
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupExitButton)
