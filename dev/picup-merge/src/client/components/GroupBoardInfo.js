// 그룹 게시물 정보 컴포넌트

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBoardInfo, setIsJoined, setWriteAuth } from '../actions/board';
import util from '../common/utils';
import axios from 'axios';
import isEmpty from '../validation/is-empty';
import isSuccessed from '../validation/is-successed';

import Logout from './buttons/LogoutButton';
import GroupJoinButton from './buttons/GroupJoinButton';
import GroupExitButton from './buttons/GroupExitButton';

import '../css/GroupBoardInfo.scss';

class GroupBoardInfo extends Component {
  constructor() {
    super();

    this.state = {
      isJoined: true
    }
  }

  render() { // localhost/auth/facebook, express 서버를 통해 로그인 후 회원 여부에 따라 /member/new, /board/:id로 redirection
    //console.log('in BoardInfo!');
    //console.log(this.props.boardID);
    //console.log(this.props.board.boardInfo);
    //console.log(this.props)
    var joinButton = <GroupJoinButton/>
    var exitButton = <GroupExitButton/>
    //var joinButton = <button className="btn btn-default groupBtn">그룹 가입</button>;
    //var exitButton = <button className="btn btn-default groupBtn">그룹 탈퇴</button>;
    
    console.log('in GroupBoardInfo render!');
    console.log(this.props.board.isJoined);

    if (this.props.board.boardInfo) {
      return (
        <div className = "BoardInfo">
          <img className="profileImg" src={this.props.board.boardInfo.profile}/>
          <p> {this.props.board.boardInfo.name} </p>
          {this.props.board.isJoined ? exitButton : joinButton}
        </div>
      );
    }
    else {
      return (
        <div></div>
      );
    }
  }

  componentDidMount() {
    //console.log(localStorage.getItem('token'));
    //console.log('in BoardInfo Component Did Mount')
    //console.log(this.props.boardID);
    //if (!isEmpty(this.props.boardID)) {
    //  this.props.getBoardInfo(this.props.boardID);
    //}
    //console.log("뀨뀨뀨뀪뀨뀨");
    this.props.getBoardInfo(this.props.board.boardID);

    var boardID = this.props.board.boardID;

    
    var token = localStorage.token;
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };

    console.log('in GroupBoardInfo Component Did Mount');
    // 가입 여부 확인
    axios.get('/api/board/' + boardID + '/member/me', config)
    .then( (result) => {
      console.log(result);
      if (result.data.data) {
        console.log('is Joined?');
        console.log(result.data.data.isJoined);
        if (isSuccessed(result.data.data.isJoined)) {
          console.log("success Joined!")
          this.props.setIsJoined(true);
        }
        else {
          this.props.setIsJoined(false);
        }
        console.log('is Auth?');
        console.log(result.data.data.writeAuth);
        
        if (isSuccessed(result.data.data.writeAuth))
          this.props.setWriteAuth(true);
        else
          this.props.setWriteAuth(false);
        
      }
      else {
        this.props.setIsJoined(false);
      }
    })
    .catch( (err) => {
      console.log(err);
    });
  }

  // props가 바뀐후 호출되는 메소드
  
  componentDidUpdate(prevProps, prevState) { // props를 받아온 후 이전 props와 다를 경우 getBoardInfo를 통해 게시판 정보를 받아옴
    console.log('in BoardInfo Component Did Update')
    //console.log(this.props.boardID);
    //console.log('prev:' + this.prevProps.boardID);
    if (prevProps.board.boardID != this.props.board.boardID) {
      console.log("GET BOARD INFO!")
      if (!isEmpty(this.props.board.boardID)) {
        console.log("GET BOARD INFO!")
        
        this.props.getBoardInfo(this.props.board.boardID);
      }
    }
  }
}

const mapStateToProps = (state) => ({
  board: state.board
});

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
  getBoardInfo: (boardID) => {
    //console.log('in getBoardInfo props');
    //console.log(boardID);
    var token = localStorage.token;
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };

    axios.get('/api/board/' + boardID, config )
    .then((result) => {
      //console.log('뀨');
      //console.log(result.data.data);
      const name = result.data.data.boardName;
      //console.log(name);
      //console.log(result.data.data.boardProfile);
      const profile = util.getResource(result.data.data.boardProfile);
      //console.log(profile);
      dispatch(getBoardInfo(name, profile));
    });
    //dispatch(getMyBoardID(conf));
  },
  setIsJoined: (isJoined) => dispatch(setIsJoined(isJoined)),
  setWriteAuth: (writeAuth) => dispatch(setWriteAuth(writeAuth))
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupBoardInfo);