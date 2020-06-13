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
import PicturePost from './PicturePost';

import { withRouter } from 'react-router-dom'; // withRouter로 Component를 감싸면 this.props.history를 사용할 수 있게 해줌

import '../css/Board.scss';

import plus from '../img/plus4.png';
import PicupColorfulMap from './PicupColorfulMap';

import { setBoardState } from '../actions/board';

import btn from '../css/Button.scss';

class ColorfulBoard extends Component {
  constructor() {
    super();

    this.state = { // state 0이면 컬러맵, state가 1이면 게시물, state가 3이면 여행일정을 보여줌
      state: 0
    };
  }

  onClick(e) {
    if (!isEmpty(this.props.board.boardID))
      this.props.history.push('/post/new')
  }

  onToggleClick(e) {
    //if (!isEmpty(this.props.board.boardID)) 
    //  this.props.history.push('/colorfulmap')
    this.setState({
      flag: !this.state.flag
    });
  }

  onReadMapClick(e) {
    //if (!isEmpty(this.props.board.boardID)) 
    //  this.props.history.push('/colorfulmap')
    /*
    this.setState({
      state:0
    });
    */
    this.props.setBoardState(0);
  }

  onReadPostClick(e) {
    //if (!isEmpty(this.props.board.boardID)) 
    //  this.props.history.push('/colorfulmap')
    /*
    this.setState({
      state:1
    });
    */
   this.props.setBoardState(1);
  }

  onReadScheduleClick(e) {
    //if (!isEmpty(this.props.board.boardID)) 
    //  this.props.history.push('/colorfulmap')
    /*
    this.setState({
      state:2
    });
    */
   this.props.setBoardState(2);
  }

  renderItem(state) {
    if (state == 0) {
      return (
        <PicupColorfulMap/>
      )
    }
    else if (state == 1) {
      return (
        <Post/>
      )
    }
    else if (state == 2) {
      return (
        <PicturePost/>
      )
      //this.props.history.push('/picturepost')
    }
    else {
      return (
        <PicupColorfulMap/>
      )
    }
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
      /*
      return (
        <div className="Board">
          <BoardInfo />
          <br/>
          <br/>

          <div className="buttonList">
          {this.props.board.writeAuth ? <button className='btn btn-default' onClick={this.onClick.bind(this)}>글 작성</button> : null}
          {this.state.flag ? <button className='btn btn-default' onClick={this.onToggleClick.bind(this)}>글보기</button> : <button className='btn btn-default' onClick={this.onToggleClick.bind(this)}>지도 보기</button>}
          <button className='btn btn-default' onClick={this.onScheduleClick.bind(this)}>여행일정</button>
          </div>
          
          {this.state.flag ? <PicupColorfulMap/> : <Post/> }
          
        </div>
      );
      */

      return (
        <div className="Board">
          <BoardInfo />
          <br/>
          <br/>

          <div className="buttonList">
          {this.props.board.writeAuth ? <button className='btn btn-default' onClick={this.onClick.bind(this)}>글 작성</button> : null}
          <button className='btn btn-default' onClick={this.onReadMapClick.bind(this)}>지도 보기</button>
          <button className='btn btn-default' onClick={this.onReadPostClick.bind(this)}>글보기</button>
          <button className='btn btn-default' onClick={this.onReadScheduleClick.bind(this)}>앨범</button>
          </div>
          
          {this.renderItem(this.props.board.boardState)}
          
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  board: state.board
});

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
  setBoardState: (state) => dispatch(setBoardState(state)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ColorfulBoard));
