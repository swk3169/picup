// Picup 헤더 컴포넌트

import React, { Component } from 'react';

import { withRouter } from 'react-router-dom'; // withRouter로 Component를 감싸면 this.props.history를 사용할 수 있게 해줌
import { connect } from 'react-redux';
import { emptyPostList, emptyBoardInfo, emptyBoard, getBoardID } from '../actions/board';
import { setMarkerList } from '../actions/map'

import '../css/Home.scss';
import '../css/Navbar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUser, faUserFriends, faSearch, faMapMarker} from '@fortawesome/free-solid-svg-icons'

import '../css/Home.scss';

class Navbar extends Component {
  
  onHome(e) {
    //this.props.emptyPostList();
    //this.props.emptyBoardInfo();
    this.props.emptyBoard();
    this.props.emptyMarkerList();
    //this.props.history.push('/');
    this.props.history.push('/colorfulhome');
  }
  
  onSearch(e) {
    //this.props.emptyPostList();
    //this.props.emptyBoardInfo();
    this.props.emptyBoard();
    this.props.emptyMarkerList();
    this.props.history.push('/search');
  }

  onGroup(e) {
    //this.props.emptyPostList();
    //this.props.emptyBoardInfo();
    this.props.emptyBoard();
    this.props.emptyMarkerList();
    this.props.history.push('/group');
  }

  onAround(e) {
    this.props.emptyPostList();
    this.props.emptyBoardInfo();
    this.props.emptyMarkerList();
    this.props.history.push('/around');
  }

  onFriend(e) {
    //this.props.emptyPostList();
    //this.props.emptyBoardInfo();
    this.props.emptyBoard();
    this.props.emptyMarkerList();
    this.props.history.push('/friend');
  }

  render() {
    const isAuthenticated = this.props.auth.isAuthenticated; // 인증 여부 확인
    if (isAuthenticated) {
      return (
        <div className="Navbar">
          <a className="Icon" onClick={this.onHome.bind(this)}><FontAwesomeIcon icon={faHome}/></a>
          <a className="Icon" onClick={this.onFriend.bind(this)}><FontAwesomeIcon icon={faUser}/></a>
          <a className="Icon" onClick={this.onGroup.bind(this)}><FontAwesomeIcon icon={faUserFriends}/></a>
          <a className="Icon" onClick={this.onSearch.bind(this)}><FontAwesomeIcon icon={faSearch}/></a>
          <a className="Icon" onClick={this.onAround.bind(this)}><FontAwesomeIcon icon={faMapMarker}/></a>
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
  emptyMarkerList: () => dispatch(setMarkerList([])),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Navbar));