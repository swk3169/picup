// PostListItem 렌더 
// <PostList postList={this.props.postList} setPostID={this.props.setPostID}/>

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import util from '../common/utils';
import isEmpty from '../validation/is-empty';

//import ThumnailPost from './ThumnailPost';
import TravelSchedulePostItem from './TravelSchedulePostItem';

import '../css/PostList.scss';

class TravelSchedulePost extends Component {
  constructor() {
    super();

    this.renderPosts = this.renderPosts.bind(this);
  }

  renderPosts(postList) {
    console.log('in render posts');
    console.log(postList);

    return postList.map((post, key) => {
      return (
        <TravelSchedulePostItem
          key={key}
          id={post._id}
          memberName={post.postWriterID.memberName}
          postTime={post.postTime}
          numOfLike={post.numOfLike}
          postContents={post.postContents}
          numOfVisitor={post.numOfVisitor}
          pictureList={post.pictureList}
        />
      );
    });
  }

  render(){
    console.log('in TravelSchedulePost Component render');
    console.log(this.props.postList);
    
    if (isEmpty(this.props.postList)) {
      return (
        <div className="TravelSchedulePost">
        </div>
      );
    }
    else {
      return (
        <div className="TravelSchedulePost">
          {this.renderPosts(this.props.postList)}
        </div>
      );
    }
  }
}

export default TravelSchedulePost;
