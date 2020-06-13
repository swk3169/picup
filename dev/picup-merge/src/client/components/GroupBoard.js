// 그룹 게시판 컴포넌트

import PropTypes from 'prop-types';
import { getPostList} from '../actions/board';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import util from '../common/utils';
import axios from 'axios';
import isEmpty from '../validation/is-empty';
import isSuccessed from '../validation/is-successed';

import GroupBoardInfo from './GroupBoardInfo';
import GroupMemberInfo from './GroupMemberInfo';
import Post from './Post';

import { withRouter } from 'react-router-dom'; // withRouter로 Component를 감싸면 this.props.history를 사용할 수 있게 해줌

import '../css/GroupBoard.scss';

import plus from '../img/plus4.png';

import btn from '../css/Button.scss';

class GroupBoard extends Component {
  constructor() {
    super();
  }

  onClick(e) {
    console.log('GroupBoard onClick!');
    console.log(this.props);

    if (!isEmpty(this.props.board.boardID))
      this.props.history.push('/post/new')
  }

  onReadMapClick(e) {
    if (!isEmpty(this.props.board.boardID)) 
    this.props.history.push('/map') // 게시물 지도 조회
  }

  render(){
    console.log('in GroupBoard Component render');
    console.log(this.props.board);
    console.log(this.props.board.postList);
    console.log(this.props.board.boardID);

    const postList = this.props.board.postList
    if (isEmpty(this.props.board.boardID)) {  
      return (
        <div>
        </div>
      );
    }
    else {
      return ( // get board id로 board id가 설정되었을 때 렌더
        <div className="GroupBoard" align='center'>
          <GroupBoardInfo />
          <br/>
          <br/>
          <GroupMemberInfo />
          <br/>
          <br/>
          <div className="buttonList">
            {this.props.board.writeAuth ? <button className='btn btn-default buttonItem' onClick={this.onClick.bind(this)}>글 작성</button> : null}
            <button className='btn btn-default buttonItem' onClick={this.onReadMapClick.bind(this)}>지도보기</button>
          </div>
          <Post/>
          <br/>
          <br/>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  board: state.board
});

export default connect(mapStateToProps)(withRouter(GroupBoard));
