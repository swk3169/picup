// 메세지보기 컴포넌트

import PropTypes from 'prop-types';
import { getPostList } from '../actions/board';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import util from '../common/utils';
import axios from 'axios';
import isEmpty from '../validation/is-empty';

import { withRouter } from 'react-router-dom';
import { getBoardID } from '../actions/board';

import MessageList from './MessageList';
import BackButton from './buttons/BackButton';

import '../css/MyGroup.scss';

class Message extends Component {
  constructor() {
    super();

    this.state = {
      messageList: null
    };
  }

  onClick(e) {
    e.preventDefault();
    this.props.history.push('/group/new');
  }

  componentDidMount() {
    var token = localStorage.token;
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };

    axios.get('/api/message', config)
    .then((result) => {
          console.log(result.data.data);
          if(result.data.data){
            var oMessageList = result.data.data;

            var messageList = [];
            for( var i = 0 ; i < oMessageList.length ; i++){
              if(oMessageList[i].messageKind == 0){
                var senderID = oMessageList[i].senderID;
                var message ={
                  memberName:senderID.memberName,
                  memberProfile:util.getResource(senderID.memberProfile),
                  privateBoard:senderID.privateBoard
                }
                console.log(message);
                messageList.push(message);
              }
              else{
                var senderID = oMessageList[i].senderID;
                var inviteBoardID = oMessageList[i].inviteBoardID;
                var message ={
                  memberName:senderID.memberName,
                  memberProfile:util.getResource(senderID.memberProfile),
                  privateBoard:senderID.privateBoard,
                  inviteBoardID:inviteBoardID._id,
                  boardProfile:util.getResource(inviteBoardID.boardProfile),
                  boardName: inviteBoardID.boardName,
                }
                console.log(message);
                messageList.push(message);
              }
            }

            console.log(messageList)
            this.setState({
              messageList:messageList
            });
          }
        })
    .catch( (err) => {
      console.log(err);
    });
  }

  render(){
    console.log(this.state);
    if (!this.state.messageList) {
      return (
        <div>
          <BackButton/>
        </div>
      )
    }
    else {
      return (
        <div className='Message'>
            <MessageList
              messageList={this.state.messageList}
              getBoardID={this.props.getBoardID}
            />
            <BackButton/>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  board: state.board,
  member: state.member
});

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
  getBoardID: (boardID) => dispatch(getBoardID(boardID)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Message));
