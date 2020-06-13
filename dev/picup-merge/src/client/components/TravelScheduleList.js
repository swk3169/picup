// PostListItem 렌더 
// <PostList postList={this.props.postList} setPostID={this.props.setPostID}/>

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import util from '../common/utils';
import isEmpty from '../validation/is-empty';

//import ThumnailPost from './ThumnailPost';
import TravelScheduleListItem from './TravelScheduleListItem';

import '../css/TravelScheduleList.scss';

class TravelScheduleList extends Component {
  constructor() {
    super();

    this.renderPosts = this.renderPosts.bind(this);
  }

  renderPosts(travelScheduleList) {
    console.log('in render posts');
    console.log(travelScheduleList);

    return travelScheduleList.map((travelSchedule, key) => {
      return (
        <TravelScheduleListItem
          key={key}
          id={travelSchedule._id}
          startTime={travelSchedule.startTime}
          endTime={travelSchedule.endTime}
          postList={travelSchedule.postList}
        />
      );
    });
  }

  render(){
    console.log('in render TravelScheduleList')
    console.log(this.props.travelScheduleList);
    
    if (isEmpty(this.props.travelScheduleList)) {
      return (
        <div className="TravelScheduleList">
        </div>
      );
    }
    else {
      return (
        <div className="TravelScheduleList">
          {this.renderPosts(this.props.travelScheduleList)}
        </div>
      );
    }
  }
}

export default TravelScheduleList;
