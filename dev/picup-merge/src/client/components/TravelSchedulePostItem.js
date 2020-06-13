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

import '../css/TravelSchedulePostItem.scss';

class TravelSchedulePostItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isManyPicture: false
    };
  }
  componentDidMount() {
  }

  renderPictureList(pictureList) {  // 사진 정보에서 thumnail을 추출해 렌더
    var thumnailList = [];
    console.log('in TravelSchedulePostItem renderPictureList')

    for (var i = 0; i < pictureList.length; ++i) {
      console.log(pictureList[i]);
      thumnailList.push(pictureList[i].picture);
    }

    return thumnailList.map((thumnail, key) => {
      return (
        <div key={key} className="img-wrap" align='center'>
          <img width="400px" height="200px" key={key} src={util.getResource(thumnail)}/>
        </div>  
      );
    });
  }

  render() {
    const { id, memberName, postTime, numOfLike, postContents, pictureList, numOfVisitor } = this.props;
    console.log('numOfVisitor');
    console.log(numOfVisitor);

    return (
      <div className="TravelSchedulePostItem">
        <span className='writer'> {memberName}</span><span className='date'>{util.dateFormatting(postTime)}</span>
        
        <p/>
        { this.renderPictureList(pictureList) }
        <p className='contents'>{postContents}</p>
      </div>
    );
  }
}

export default withRouter(TravelSchedulePostItem);