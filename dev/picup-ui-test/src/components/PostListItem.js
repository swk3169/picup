// 게시물 조회시 게시물 하나 하나를 나타내는 컴포넌트

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setPostID } from '../actions/board';
import util from '../common/utils';
import axios from 'axios';

import isEmpty from '../validation/is-empty';

import { withRouter } from 'react-router-dom';

import like from '../img/like.png';
import dot from '../img/more.png';

import '../css/PostListItem.css';

class PostListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isManyPicture: false
    };
  }
  componentDidMount() {
    if (this.props.pictureList.length >= 4)  // 이미지의 갯수가 4개를 초과하면 3개로 줄임
    {
      this.setState({
        isManyPicture: true
      })
    }
  }

  renderPictureList(pictureList) {  // 사진 정보에서 thumnail을 추출해 렌더
    var thumnailList = [];
    if (pictureList.length >= 4)  // 이미지의 갯수가 4개를 초과하면 3개로 줄임
    {
      pictureList = pictureList.slice(0, 3);
    }

    for (var i = 0; i < pictureList.length; ++i) {
      thumnailList.push(pictureList[i].thumnail);
    }

    return thumnailList.map((thumnail, key) => {
      return (
        <img className="thumnail" key={key} src={util.getResource(thumnail)}/>
      );
    });
  }

  onClick(e) {
    console.log(this.props);
    this.props.setPostID(this.props.id);
    this.props.history.push('/post/detail')
  }
  
  render() {
    const { id, memberName, postTime, numOfLike, postContents, pictureList, numOfVisitor } = this.props;
    console.log('numOfVisitor');
    console.log(numOfVisitor);

    return (
      <div className="PostListItem" onClick={this.onClick.bind(this)}>
        <span className='writer'> {memberName}</span><span className='date'>{util.dateFormatting(postTime)}</span><span className='like'>좋아요 <img src={like}/> {numOfLike}</span>
        
        <p/>
        { this.renderPictureList(pictureList) }
        { this.state.isManyPicture ? <img src={dot} className="dot"/> : null}
        <p className='contents'>{postContents}</p>
      </div>
    );
  }
}

export default withRouter(PostListItem);