
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBoardID } from '../actions/board';
import util from '../common/utils';
import axios from 'axios';
import isEmpty from '../validation/is-empty';
import MOkButton from './buttons/MOkButton';
import { withRouter } from 'react-router-dom';

import '../css/MessageListItem.scss';

class MessageListItem extends Component {
  constructor() {
    super();
  }

  onClick(e) {
    e.preventDefault();
    console.log(this.props.privateBoard);
    this.props.getBoardID(this.props.privateBoard); // groupID를 boardID로 설정
    this.props.history.push('/board');
  }

  onClickGroup(e) {
    e.preventDefault();
    this.props.getBoardID(this.props.inviteBoardID); // groupID를 boardID로 설정
    this.props.history.push('/board/group');
  }

  render() { // localhost/auth/facebook, express 서버를 통해 로그인 후 회원 여부에 따라 /member/new, /board/:id로 redirection
    console.log('MessageItem Render');
    console.log(this.props);
    if(!this.props.inviteBoardID){
      return (
        <div className = "MessageListItem" onClick={this.onClick.bind(this)}>
          <img src={this.props.memberProfile}/>
          <span className='groupName'> {this.props.memberName}님이 친구추가하였습니다.</span>
        </div>
      );
    }
    else{
      return (
        <div className = "MessageListItem">
          <img src={this.props.memberProfile} onClick={this.onClick.bind(this)}/>
          <span className='groupName'> {this.props.memberName}님이 "{this.props.boardName}"</span>
            <img onClick={this.onClickGroup.bind(this)} src={this.props.boardProfile} className="boardProfile"/>
            <span className="suffix">그룹 초대</span>
            <MOkButton
            boardID = {this.props.inviteBoardID}
            />
        </div>
      );
    }
  }

}

export default withRouter(MessageListItem);
