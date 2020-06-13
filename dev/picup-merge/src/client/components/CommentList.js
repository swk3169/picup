// PostListItem 렌더 
// <PostList postList={this.props.postList} setPostID={this.props.setPostID}/>

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import util from '../common/utils';
import isEmpty from '../validation/is-empty';

//import ThumnailPost from './ThumnailPost';
import CommentListItem from './CommentListItem';

import '../css/CommentList.scss';

import btn from '../css/Button.scss';

class CommentList extends Component {
  constructor() {
    super();

    this.renderCommentList = this.renderCommentList.bind(this);
  }

  renderCommentList(commentList) {
    console.log('in render CommentList');
    console.log(commentList);

    return commentList.map((comment, key) => {
      return (
        <CommentListItem
          key={key}
          id={comment._id}
          postID={this.props.postID}
          boardID={this.props.boardID}
          memberID={comment.commentWriterID._id}
          memberName={comment.commentWriterID.memberName}
          memberProfile={util.getResource(comment.commentWriterID.memberProfile)}
          commentTime={comment.commentTime}
          commentContents={comment.commentContents}
        />
      );
    });
  }

  render(){
    console.log('in CommentList Component render');
    
    if (isEmpty(this.props.commentList)) {
      return (
        <div className="CommentList">
        </div>
      );
    }
    else {
      console.log(this.props.commentList);
      return (
        <div className="CommentList">
          {this.renderCommentList(this.props.commentList)}
        </div>
      );
    }
  }
}

export default CommentList;
