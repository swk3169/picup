// 내 그릅 조회시 하나 하나의 그룹을 나타내는 컴포넌트

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBoardID } from '../actions/board';
import util from '../common/utils';
import axios from 'axios';
import isEmpty from '../validation/is-empty';

import { withRouter } from 'react-router-dom';

import '../css/MyGroupListItem.scss';

// boardProfile, groupName, groupID(boardID), numOfMember
class MyGroupListItem extends Component {
  constructor() {
    super();
  }

  onClick(e) {
    console.log(this.props.groupID);
    this.props.getBoardID(this.props.groupID); // groupID를 boardID로 설정
    this.props.history.push('/board/group');
  }
  
  render() { // localhost/auth/facebook, express 서버를 통해 로그인 후 회원 여부에 따라 /member/new, /board/:id로 redirection
    console.log('in ThumnailGroup!');
    //console.log(this.props.boardID);
    //console.log(this.props.board.boardInfo);
    console.log(this.props);

    return (
      <div className = "MyGroupListItem" onClick={this.onClick.bind(this)}>
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

export default withRouter(MyGroupListItem);