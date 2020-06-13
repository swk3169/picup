import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import styles from '../css/Post.css';
import axios from 'axios';
import util from '../common/utils';
import { connect } from 'react-redux';

import { setTravelScheduleList } from '../actions/board';

import TravelScheduleList from './TravelScheduleList';

import '../css/TravelSchedule.scss';

class TravelSchedule extends Component {
  componentDidMount() {
    this.props.getScheduleList(this.props.board.boardID); // boardID를 받아왔을 경우 postList를 불러옴
  }

  render() {
    if (this.props.board.travelScheduleList) {
      console.log('setTravelScheduleList done!')
      return (
        <div className='TravelSchedule'>
          <TravelScheduleList travelScheduleList={this.props.board.travelScheduleList}/>
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
  getScheduleList: (boardID) => {
    var token = localStorage.token;
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };
    
    axios.get('/api/board/' + boardID + '/schedule', config )
    .then((result) => {
      console.log('in Schedule');
      console.log(result.data.data);
      /*
      var postList = result.data.data;
      postList = postList.reverse();
      for (var i = 0; i < postList.length; ++i) {
        for (var j = 0; j < postList[i].pictureList.length; ++j) {
          postList[i].pictureList[j].thumnail = postList[i].pictureList[j].picture;
        }
      }
      dispatch(getPostList(postList));
      */
     dispatch(setTravelScheduleList(result.data.data));
    });
  },
  setPostID: (postID) => dispatch(setPostID(postID)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TravelSchedule);