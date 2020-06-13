// Picup 헤더 컴포넌트

import React, { Component } from 'react';

import { withRouter } from 'react-router-dom'; // withRouter로 Component를 감싸면 this.props.history를 사용할 수 있게 해줌
import { connect } from 'react-redux';
import { emptyPostList, emptyBoardInfo, emptyBoard, getBoardID } from '../actions/board';

import group from '../img/group.png';
import search from '../img/search.png';
import home from '../img/home.png';
import marker from '../img/marker.png';
import friend from '../img/friend.png';

import '../css/Home.css';

class Navbar extends Component {
  
  onHome(e) {
    //this.props.emptyPostList();
    //this.props.emptyBoardInfo();
    this.props.emptyBoard();
    //this.props.history.push('/');
    this.props.history.push('/home');
  }
  
  onSearch(e) {
    //this.props.emptyPostList();
    //this.props.emptyBoardInfo();
    this.props.emptyBoard();
    this.props.history.push('/search');
  }

  onGroup(e) {
    //this.props.emptyPostList();
    //this.props.emptyBoardInfo();
    this.props.emptyBoard();
    this.props.history.push('/group');
  }

  onAround(e) {
    this.props.emptyPostList();
    this.props.emptyBoardInfo();
    this.props.history.push('/around');
  }

  onFriend(e) {
    //this.props.emptyPostList();
    //this.props.emptyBoardInfo();
    this.props.emptyBoard();
    this.props.history.push('/friend');
  }

  render() {
    const isAuthenticated = this.props.auth.isAuthenticated; // 인증 여부 확인
    if (isAuthenticated) {
      return (
        <div className="Navbar">
          <a onClick={this.onHome.bind(this)}><img src={home}/></a>
          <a onClick={this.onFriend.bind(this)}><img src={friend}/></a>
          <a onClick={this.onGroup.bind(this)}><img src={group}/></a>
          <a onClick={this.onSearch.bind(this)}><img src={search}/></a>
          <a onClick={this.onAround.bind(this)}><img src={marker}/></a>
        </div>
      );
    }
    else {
      return (
        <div className="Navbar"><a> </a></div>
      )
    }
  }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
})

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
  emptyPostList: () => dispatch(emptyPostList()),
  emptyBoardInfo: () => dispatch(emptyBoardInfo()),
  emptyBoard: () => dispatch(emptyBoard()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Navbar));