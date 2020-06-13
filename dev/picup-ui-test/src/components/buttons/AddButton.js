// 친구 추가하기 컴포넌트

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'; // withRouter로 Component를 감싸면 this.props.history를 사용할 수 있게 해줌
import PropTypes from 'prop-types';

import '../../css/AddButton.css';

class AddButton extends Component {

  constructor() {
    super();
  }

  onClick(e) {
    e.preventDefault();
    this.props.history.goBack();
  }

  render() {
    return (
      <button className='btn btn-default' onClick={this.props.onClick}>+</button>
    )
  }
}

export default withRouter(AddButton)