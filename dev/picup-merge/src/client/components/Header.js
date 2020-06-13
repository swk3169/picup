// Picup 헤더 컴포넌트

import React, { Component } from 'react';

import '../css/Header.scss';
import './buttons/LogoutImgButton';
import LogoutImgButton from './buttons/LogoutImgButton';

import { withRouter } from 'react-router-dom';

import icon from '../img/icon.png';

import { connect } from 'react-redux';
import { setBoardState } from '../actions/board';

class Header extends Component {
  onClick(e) {
    e.preventDefault();
    this.props.setBoardState(0);
    this.props.history.push('/colorfulhome');
  }

  render() {
    return (
            <div className="Header">
              <div>
                <div className="Title" align='left' onClick={this.onClick.bind(this)}><img src={icon}/><a href="#">Picup</a></div>
              </div>
            </div>
    );
  }
}

const mapStateToProps = (state) => ({
  board: state.board
});

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
  setBoardState: (state) => dispatch(setBoardState(state)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
