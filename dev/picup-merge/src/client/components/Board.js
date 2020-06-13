// 개인 게시판 컴포넌트

import PropTypes from 'prop-types';
import { getPostList, setPostID } from '../actions/board';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import util from '../common/utils';
import axios from 'axios';
import isEmpty from '../validation/is-empty';

import PostList from './PostList';
import BoardInfo from './BoardInfo';
import Post from './Post';

import { withRouter } from 'react-router-dom'; // withRouter로 Component를 감싸면 this.props.history를 사용할 수 있게 해줌

import '../css/Board.scss';

import plus from '../img/plus4.png';

import btn from '../css/Button.scss';

class Board extends Component {
  constructor() {
    super();
  }

  onClick(e) {
    if (!isEmpty(this.props.board.boardID))
      this.props.history.push('/post/new')
  }

  onReadMapClick(e) {
    if (!isEmpty(this.props.board.boardID)) 
      this.props.history.push('/colorfulmap')
  }

  onScheduleClick(e) {
    if (!isEmpty(this.props.board.boardID)) {
      //this.props.history.push('/schedule')
      this.props.history.push('/picturepost')
    }
  }

  render(){
    const postList = this.props.board.postList
    if (isEmpty(this.props.board.boardID)) {
      return (
        <div className="Board">
          <BoardInfo />
          <br/>
          <br/>
        </div>
      );
    }
    else {
      return (
        <div className="Board">
          <BoardInfo />
          <br/>
          <br/>

          <div className="buttonList">
          {this.props.board.writeAuth ? <button className='btn btn-default' onClick={this.onClick.bind(this)}>글 작성</button> : null}
          <button className='btn btn-default' onClick={this.onReadMapClick.bind(this)}>지도보기</button>
          <button className='btn btn-default' onClick={this.onScheduleClick.bind(this)}>여행일정</button>
          </div>
          <Post/>
          
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  board: state.board
});

export default connect(mapStateToProps)(withRouter(Board));
