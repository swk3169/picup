import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFriend } from '../actions/friend';
import util from '../common/utils';
import axios from 'axios';
import isEmpty from '../validation/is-empty';

import { withRouter } from 'react-router-dom';

import '../css/ThumnailFriend.scss';

// boardProfile, groupName, groupID(boardID), numOfMember
class ThumnailFriend extends Component {
  constructor() {
    super();
  }

  onClick(e) {
    console.log(this.props.groupID);
    this.props.getFriendID(this.props.friendID); // groupID를 boardID로 설정
  }
  
  render() { // localhost/auth/facebook, express 서버를 통해 로그인 후 회원 여부에 따라 /member/new, /board/:id로 redirection
    console.log('in ThumnailFriend!');
    //console.log(this.props.boardID);
    //console.log(this.props.board.boardInfo);
    console.log(this.props);

    return (
      <div className="ThumnailFriend" onClick={this.onClick.bind(this)}>
        <img src={this.props.groupProfile}/>
        <span className='groupName'> {this.props.groupName}</span><span className='numOfMember'>{this.props.numOfMember}명</span>
      </div>
    );
  }

  componentDidMount() {
    //console.log(localStorage.getItem('token'));
    console.log('in ThumnailPost Component Did Mount')
    //console.log(this.props.boardID);
    //if (!isEmpty(this.props.boardID)) {
    //  this.props.getBoardInfo(this.props.boardID);
    //}
    console.log(this.props);
  }
}

const mapStateToProps = (state) => ({
  friend: state.friend
})

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
  getFriendID: (friendID) => dispatch(getFriendID(friendID)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ThumnailFriend));