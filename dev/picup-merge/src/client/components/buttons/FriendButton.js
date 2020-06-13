// 친구 추가하기 컴포넌트
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'; // withRouter로 Component를 감싸면 this.props.history를 사용할 수 있게 해줌
import PropTypes from 'prop-types';

import '../../css/FriendButton.scss';
import isEmpty from '../../validation/is-empty';
import axios from 'axios';

class FriendButton extends Component {

  constructor(props) {
    super(props);
    console.log('In FriendButtn!');
    console.log(props);
    this.state = {
      isFriend:props.isFriend
    }
  }

  onAddButtonClick(e) {
    e.preventDefault();
    var data = {
      "requestedMemberID" :this.props.memberID
    }

    var token = localStorage.token;
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };

    axios.post('/api/friend/me', data, config)
      .then((result) => {
        console.log(result.data);
        if (!isEmpty(result.data.data)) {
          this.setState({
            isFriend: true
          });
        }
      })
  }

  onDeleteButtonClick(e) {
    e.preventDefault();

    var token = localStorage.token;
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };

    axios.delete('/api/friend/me/' + this.props.memberID, config)
      .then((result) => {
        console.log(result.data);
        if (!isEmpty(result.data.data)) {
          this.setState({
            isFriend: false
          });
        }
      })
  }

  onComponentDidUpdate() {
    this.setState({
      isFriend : this.props.isFriend
    });
  }

  render() {
    if (this.state.isFriend) {
      return (
        <button className='btn btn-default' onClick={this.onDeleteButtonClick.bind(this)}>친구 끊기</button>
      )
    }
    else {
      return (
        <button className='btn btn-default' onClick={this.onAddButtonClick.bind(this)}>친구 추가</button>
      )
    }
  }
}

export default FriendButton