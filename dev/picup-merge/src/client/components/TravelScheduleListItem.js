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

import '../css/TravelScheduleListItem.scss';

import TravelSchedulePost from './TravelSchedulePost';

class TravelScheduleListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: false
    };
  }

  componentDidMount() {
  }

  onClick(e) {
    console.log(this.props);
    //this.props.setPostID(this.props.id);
    //this.props.history.push('/post/detail')
    this.setState({
      isClicked: !this.state.isClicked
    });
  }
  
  render() {
    console.log('in render TravelScheduleListItem');
    console.log(this.props);
    const { startTime, endTime, postList } = this.props;

    if (this.state.isClicked) {
      console.log('TravelScheduleListItem Show Post Clicked!!');
      return (
        <div className="TravelScheduleListItem" onClick={this.onClick.bind(this)}>
          <span className="schedule">{util.dateFormatting(startTime)} - {util.dateFormatting(endTime)} 여행</span>
          <TravelSchedulePost postList={postList}/>
        </div>
      );
    }
    else {
      console.log('TravelScheduleListItem Clicked!!');
      return (
        <div className="TravelScheduleListItem" onClick={this.onClick.bind(this)}>
          <span className="schedule">{util.dateFormatting(startTime)} - {util.dateFormatting(endTime)} 여행</span>
        </div>
      );
    }
  }
}

export default withRouter(TravelScheduleListItem);