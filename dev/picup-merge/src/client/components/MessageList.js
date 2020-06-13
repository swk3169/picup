import PropTypes from 'prop-types';
import { getPostList } from '../actions/board';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import util from '../common/utils';
import axios from 'axios';
import isEmpty from '../validation/is-empty';

import { withRouter } from 'react-router-dom';

import MessageListItem from './MessageListItem';
import BackButton from './buttons/MOkButton';

import '../css/MyGroupList.scss';

class MessageList extends Component {
  constructor() {
    super();

    this.state = {
      messageList: null
    };
    this.renderMessageList = this.renderMessageList.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    this.props.history.push('/group/new');
  }

  componentDidMount() {

  }

  renderMessageList(messageList) {
    console.log('in renderMessageList');
    console.log(this.props);
    return messageList.map( (message, key) => {
      return <MessageListItem
        key={key}
        memberProfile={message.memberProfile}
        memberName={message.memberName}
        privateBoard={message.privateBoard}
        inviteBoardID={message.inviteBoardID}
        boardProfile={message.boardProfile}
        boardName={message.boardName}
        getBoardID={this.props.getBoardID}
      />
    });
  }

  render(){
    console.log(this.props);
    if (!this.props.messageList) {
      return (
      <div>
      </div>
      );
    }
    else {
      return (
        <div>
          {this.renderMessageList(this.props.messageList)}
        </div>
      );
    }
  }
}

export default MessageList;
