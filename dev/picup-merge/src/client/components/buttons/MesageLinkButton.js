// 친구 추가하기 컴포넌트

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'; // withRouter로 Component를 감싸면 this.props.history를 사용할 수 있게 해줌
import PropTypes from 'prop-types';

import message from '../../img/email.png';
import '../../css/MessageLinkButton.scss';

class MessageLinkButton extends Component {

  constructor() {
    super();
  }

  onClick(e) {
    e.preventDefault();
    this.props.history.push('/message');
  }

  render() {
    return (
      <img src={message} onClick={this.onClick.bind(this)} className="MessageLinkButton"/>
    )
  }
}

export default withRouter(MessageLinkButton)