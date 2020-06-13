// 게시물 정보 컴포넌트

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBoardInfo, setIsJoined, setWriteAuth } from '../actions/board';
import util from '../common/utils';
import axios from 'axios';
import isEmpty from '../validation/is-empty';
import isSuccessed from '../validation/is-successed';

import MessageLinkButton from './buttons/MesageLinkButton';
import { withRouter } from 'react-router-dom';

import '../css/BoardInfo.scss';

import message from '../img/mail.png';

class BoardInfo extends Component {
  constructor() {
    super();
  }

  render() { // localhost/auth/facebook, express 서버를 통해 로그인 후 회원 여부에 따라 /member/new, /board/:id로 redirection
    //console.log('in BoardInfo!');
    //console.log(this.props.boardID);
    //console.log(this.props.board.boardInfo);
    //console.log(this.props)
    if (this.props.board.boardInfo) {
      var privateBoard = this.props.member.info.privateBoard;
      var boardID = this.props.board.boardID;
      console.log('BoardInfo render!');
      console.log(privateBoard);
      console.log(this.props.member.info);
      console.log(boardID);
      console.log(this.props)
      return (
        <div className = "BoardInfo">          
          <img className="profileImg" src={util.getResource(this.props.board.boardInfo.profile)} onClick={this.onProfileClick.bind(this)}/>
          <div className="flexinfo">
            <div><span> {this.props.board.boardInfo.name} </span></div>
            {privateBoard === boardID ? <div><MessageLinkButton/></div> : null}
          </div>
        </div>
      );
    }
    else {
      return (
        <div></div>
      )
    }
  }

  onClick(e) {
    e.preventDefault();
    this.props.history.push('/message');
  }

  onProfileClick(e) {
    e.preventDefault();
    this.props.history.push('/profile');
  }

  componentDidMount() {
    if (!isEmpty(this.props.board.boardID)) {
      console.log("GET BOARD INFO!")
      
      this.props.getBoardInfo(this.props.board.boardID);

      var boardID = this.props.board.boardID;

      // 가입 여부 확인
      var token = localStorage.token;
      var config = {
        headers: {'Authorization': 'Bearer ' + token},
      };
      console.log('in BoardInfo Component Did Mount')
      console.log(boardID);
      
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
    
    //console.log(localStorage.getItem('token'));
    //console.log('in BoardInfo Component Did Mount')
    //console.log(this.props.boardID);
    //if (!isEmpty(this.props.boardID)) {
    //  this.props.getBoardInfo(this.props.boardID);
    //}
    //console.log("뀨뀨뀨뀪뀨뀨");
    this.props.getBoardInfo(this.props.board.boardID); // 값이 null
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

        var boardID = this.props.board.boardID;

        // 가입 여부 확인
        var token = localStorage.token;
        var config = {
          headers: {'Authorization': 'Bearer ' + token},
        };
        console.log('in BoardInfo Component Did Mount')
        console.log(boardID);
        
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
    }
  }
}

const mapStateToProps = (state) => ({
  board: state.board,
  member: state.member
});

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
  getBoardInfo: (boardID) => {
    console.log('in getBoardInfo props');
    //console.log(boardID);
    var token = localStorage.token;
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };

    axios.get('/api/board/' + boardID, config )
    .then((result) => {
      //console.log('뀨');
      //console.log(result.data.data);
      if (result.data.success) {
        console.log('in api/board');
        console.log(result.data.data);
        const name = result.data.data.boardName;
        const id = result.data.data.managerID;
        //console.log(name);
        //console.log(result.data.data.boardProfile);
        //const profile = util.arrayBufferToBase64Img(result.data.data.boardProfile.data)
        const profile = result.data.data.boardProfile;
        dispatch(getBoardInfo(name, profile, id));
      }
      //console.log(profile);
      
    });
    //dispatch(getMyBoardID(conf));
  },
  setIsJoined: (isJoined) => dispatch(setIsJoined(isJoined)),
  setWriteAuth: (writeAuth) => dispatch(setWriteAuth(writeAuth))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BoardInfo));