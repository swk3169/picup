// 게시물 상세 조회 컴포넌트
// 어느정도 완성..(하지만 페이지 로드시 이전에 저장되어 있던 props.board.detailPost 때문에 이전 post가 보임, 새로 고침시 props가 날라감), 이미지 태그 크기 설정
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getDetailPost, emptyDetailPost, setDetailPostLikeInfo } from '../actions/board';
import util from '../common/utils';
import axios from 'axios';
import isEmpty from '../validation/is-empty';
import BackButton from './buttons/BackButton';

import { withRouter } from 'react-router-dom';

import CommentForm from './CommentForm';

import like from '../img/like.png';
import dropdown from '../img/dropdown.png';

import { DropdownButton, MenuItem } from 'react-bootstrap';

import '../css/DetailPost.css';

class DetailPost extends Component {
  constructor() {
    super();

    //this.renderModifyButton = this.renderModifyButton.bind(this);
    this.renderDropdownMinuButton = this.renderDropdownMinuButton.bind(this);
  }

  // pictureList => img tags
  renderPictureList(pictureList) {
    return pictureList.map((picture, key) => {
      return (
        <div key={key} className="img-wrap" align='center'>
          <img width="400px" height="200px" key={key} src={picture}/>
        </div>  
      );
    });    
  }

  // tagList => b tags
  // ex. [맛집,여행] => <b>#맛집</b> <b>#여행</b>
  renderTagList(tagList) {
    return tagList.map((tag, key) => {
      return (
        <b key={key}>#{tag} </b>
      );
    })
  }

  // detail post state 초기화 후 이전 페이지로
  onClick(e) {
    this.props.emptyDetailPost();
    this.props.history.goBack();
  }

  onLocationButtonClick(e) {
    this.props.history.push('/post/location');
  }

  /*
  renderModifyButton() { // 작성자가 회원일 경우 위치설정 버튼에 보이게 함
    console.log('render modify button');
    
    if (isEmpty(this.props.board.detailPost)) {
      return (
        <div>
        </div>
      )
    }
    console.log(this.props)
    console.log(this.props.member.info._id);
    console.log(this.props.board.detailPost.postWriterID._id);
    if (this.props.member.info._id == this.props.board.detailPost.postWriterID._id) {
      return <button className='btn btn-default' onClick={this.onLocationButtonClick.bind(this)}>위치설정</button>
    }
    else
      return null;
  }
  */

  renderDropdownMinuButton() { // 작성자가 회원일 경우 위치설정 버튼에 보이게 함
    console.log('render modify button');
    
    if (isEmpty(this.props.board.detailPost)) {
      return (
        <div>
        </div>
      )
    }
    console.log(this.props)
    console.log(this.props.member.info._id);
    console.log(this.props.board.detailPost.postWriterID._id);
    if (this.props.member.info._id == this.props.board.detailPost.postWriterID._id) {
      return (
        <div className="dropdown" align='left'>
          <button className="btn btn-default dropdown-toggle btn-sm" type="button" data-toggle="dropdown">설정
          <span className="caret"></span></button>
          <ul className="dropdown-menu">
            <li><a onClick={this.onLocationButtonClick.bind(this)}>위치 설정</a></li>
            <li><a href="#">게시물 수정</a></li>
            <li><a href="#">게시물 삭제</a></li>
          </ul>
        </div>
      )
    }
    else
      return null;
  }

  renderVideo(videoList) {
    console.log('video list')
    console.log(videoList);
    return videoList.map((video, key) => {
      return (
        <div key={key} className='video-wrap'  align='center'>
          <video width="400px" height="200px" controls>
            <source src={util.getResource(video)} type="video/mp4"/>
          </video>
        </div>
      );
    });   
  }

  onPickButtonClick(e) {
    e.preventDefault();
    
    var boardID = this.props.board.boardID;
    var postID = this.props.board.postID;

    this.props.pickPost(boardID, postID);
  }

  onDePickButtonClick(e) {
    e.preventDefault();
    
    var boardID = this.props.board.boardID;
    var postID = this.props.board.postID;
    
    this.props.depickPost(boardID, postID);
  }

  renderPickButton(pick) {
    if (pick) {
      return <button onClick={this.onDePickButtonClick.bind(this)} className="btn btn-default btn-sm">Pic 취소</button>
    }
    else {
      return <button onClick={this.onPickButtonClick.bind(this)} className="btn btn-default btn-sm">Pic</button>
    }
  }

  render() { 
    console.log('in DetailPost!');
    console.log(this.props)

    
    var pictureList = null;
    var tagList = null;
    var videoList = null;
    var numOfVisitor = null;
    var pick = null;  // 좋아요 여부

    if (!isEmpty(this.props.board.detailPost)) {
      var detailPost = this.props.board.detailPost;
      numOfVisitor = detailPost.numOfVisitor;
      pick = detailPost.pick;

      console.log(detailPost);
      var propsPictureList = [];
      for (var i = 0; i < detailPost.pictureList.length; ++i) {
        propsPictureList.push(util.getResource(detailPost.pictureList[i].picture));
      }

      pictureList = this.renderPictureList(propsPictureList);
      tagList = this.renderTagList(detailPost.tagList);
      videoList = this.renderVideo(detailPost.videoLinkList);
    }
    else {
      return (
        <div>
        </div>
      )
    }

    return (
      <div className='DetailPost'>
        {this.renderDropdownMinuButton()}
        <p align="right" className='visitor'>{numOfVisitor}명이 이 글을 봤습니다!</p>
        { pictureList }
        { videoList }
        <span className='writer'> {detailPost.postWriterID.memberName}</span><span className='date'>{this.dateFormatting(detailPost.postTime)}</span>
        <p className='contents'>{detailPost.postContents}</p>
        
        <div align='right'>
          <p className='tag'>{ tagList }</p>
          <p className='like'>{this.renderPickButton(pick)} <img src={like}/> {detailPost.numOfLike}</p>
        </div>
        <BackButton/>
        <CommentForm/>
      </div>
    );
  }

  dateFormatting(date) {
    var items = date.split('T');
    return items[0] + ' ' + items[1].substring(0, 8);
  }

  componentDidMount() {
    //console.log(localStorage.getItem('token'));
    console.log('in DetailPost Component Did Mount')
    console.log(this.props);
    //console.log(this.props.boardID);
    //if (!isEmpty(this.props.boardID)) {
    //  this.props.getBoardInfo(this.props.boardID);
    //}
    this.props.getDetailPost(this.props.board.boardID, this.props.board.postID);
    this.setState({
      completeDownLoad:true
    });
  }
}

const mapStateToProps = (state) => ({
  board: state.board,
  member: state.member
})

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
  getDetailPost: (boardID, postID) => {
    console.log('in getDetailPost props');
    //console.log(boardID);
    var token = localStorage.token;
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };

    axios.get('/api/board/' + boardID + '/post/' + postID, config )
    .then((result) => {
      console.log('뀨');
      console.log(result.data.data);
      //const name = result.data.data;
      //console.log(name);
      //console.log(result.data.data.boardProfile);
      //const profile = util.arrayBufferToBase64Img(result.data.data.boardProfile.data);
      //console.log(profile);
      console.log(result.data.data);
      dispatch(getDetailPost(result.data.data));
    });
    //dispatch(getMyBoardID(conf));
  },
  emptyDetailPost: () => dispatch(emptyDetailPost()),
  pickPost: (boardID, postID) => {
    var token = localStorage.token;
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };

    axios.post('/api/board/' + boardID + '/post/' + postID + '/pick', {}, config )
    .then((result) => {
      console.log('success pick post!');
      console.log(result.data);
      console.log(result.data.data);
      //const name = result.data.data;
      //console.log(name);
      //console.log(result.data.data.boardProfile);
      //const profile = util.arrayBufferToBase64Img(result.data.data.boardProfile.data);
      //console.log(profile);
      console.log(result.data.data);
      var numOfLike = result.data.data;
      if (numOfLike)
        dispatch(setDetailPostLikeInfo(numOfLike, true));
      
    });
  },
  depickPost: (boardID, postID) => {
    var token = localStorage.token;
    console.log(token);
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };

    axios.delete('/api/board/' + boardID + '/post/' + postID + '/pick', config )
    .then((result) => {
      console.log(result.data);
      console.log('success depick post!');
      console.log(result.data.data);
      //const name = result.data.data;
      //console.log(name);
      //console.log(result.data.data.boardProfile);
      //const profile = util.arrayBufferToBase64Img(result.data.data.boardProfile.data);
      //console.log(profile);
      console.log(result.data.data);
      var numOfLike = result.data.data;
      if (result.data.success)
        dispatch(setDetailPostLikeInfo(numOfLike, false));
    });
  },
  setDetailPostLikeInfo: (numOfLike, pick) => {
    dispatch(setDetailPostLikeInfo(numOfLike, pick));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DetailPost));