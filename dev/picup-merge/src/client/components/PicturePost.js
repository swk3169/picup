import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import styles from '../css/Post.css';
import axios from 'axios';
import util from '../common/utils';
import { connect } from 'react-redux';

import { getPostList, setPostID } from '../actions/board';

import BoardInfo from './BoardInfo';
import PicturePostList from './PicturePostList';
import BackButton from './buttons/BackButton';

import '../css/PicturePost.scss';

class PicturePost extends Component {
  componentDidMount() {
    this.props.getPostList(this.props.board.boardID); // boardID를 받아왔을 경우 postList를 불러옴
  }

  render() {
    if (this.props.board.postList) {
      return (
        <div className='PicturePost'>
          <PicturePostList postList={this.props.board.postList} setPostID={this.props.setPostID}/>
        </div>
      );
    }
    else {
      return (
        <div></div>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  board: state.board
})

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
  getPostList: (boardID) => {
    var token = localStorage.token;
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };
    
    axios.get('/api/board/' + boardID + '/post', config )
    .then((result) => {
      console.log('in Post');
      console.log(result.data.data);
      var postList = result.data.data;
      postList = postList.reverse();
      for (var i = 0; i < postList.length; ++i) {
        for (var j = 0; j < postList[i].pictureList.length; ++j) {
          postList[i].pictureList[j].picture = postList[i].pictureList[j].picture;
        }
      }
      dispatch(getPostList(postList));
    });
  },
  setPostID: (postID) => dispatch(setPostID(postID)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PicturePost);