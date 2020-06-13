// 로그아웃 버튼 컴포넌트 

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authentication';
import axios from 'axios';

import { withRouter } from 'react-router-dom';

import '../../css/Logout.css';

class Logout extends Component {
  constructor() {
    super();
    //this.handleClick = this.handleClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    this.props.history.push('/');
    this.props.logoutUser();
  }

  render() { // localhost/auth/facebook, express 서버를 통해 로그인 후 회원 여부에 따라 /member/new, /board/:id로 redirection
      return (
          <div className='Logout'>
              <button className='btn btn-default' onClick={this.onClick.bind(this)}>Logout</button>
          </div>
      );
  }

  componentDidMount() {
      //console.log(localStorage.getItem('token'));
  }
}

const mapStateToProps = (state) => {
  return {
    board: state.board
  }
}

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
  logoutUser: () => dispatch(logoutUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Logout));


