// 뒤로 가기 컴포넌트

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'; // withRouter로 Component를 감싸면 this.props.history를 사용할 수 있게 해줌
import PropTypes from 'prop-types';

import '../../css/BackButton.css';

class BackButton extends Component {

  constructor() {
    super();
  }

  onClick(e) {
    e.preventDefault();
    this.props.history.goBack();
  }

  render() {
    return(
      <div className="BackButton" align='center'>
        <button className='btn btn-default' onClick={this.onClick.bind(this)}>돌아가기</button>
      </div>
    )
  }
}

export default withRouter(BackButton)
