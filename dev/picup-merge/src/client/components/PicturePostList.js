// PostListItem 렌더 
// <PostList postList={this.props.postList} setPostID={this.props.setPostID}/>

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import util from '../common/utils';
import isEmpty from '../validation/is-empty';

//import ThumnailPost from './ThumnailPost';
import PicturePostListItem from './PicturePostListItem';

import '../css/PicturePostList.scss';

class PicturePostList extends Component {
  constructor() {
    super();

    this.renderPosts = this.renderPosts.bind(this);
  }

  renderPosts(postList) {
    console.log('in render posts');
    console.log(postList);

    if (postList.length > 0) {
      return postList.map((post, key) => {
        return (
          <PicturePostListItem
            key={key}
            id={post._id}
            memberName={post.postWriterID.memberName}
            postTime={post.postTime}
            numOfLike={post.numOfLike}
            postContents={post.postContents}
            numOfVisitor={post.numOfVisitor}
            pictureList={post.pictureList}
            setPostID={this.props.setPostID}
          />
        );
      });
    }
  }

  render(){
    console.log('in Board Component render');
    console.log(this.props.postList);
    
    if (isEmpty(this.props.postList)) {
      return (
        <div className="PicturePostList">
          <div align='center'> 
            <span>여행후기를 올려주세요!</span>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="PicturePostList" align='center'>
          <div className="ImageList" align='center'>
            {this.renderPosts(this.props.postList)}
          </div>
        </div>
      );
    }
  }
}

export default PicturePostList;
