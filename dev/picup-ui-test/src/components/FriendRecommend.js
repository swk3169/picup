// 친구 추천 컴포넌트
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'; // withRouter로 Component를 감싸면 this.props.history를 사용할 수 있게 해줌
import { getBoardID } from '../actions/board';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import util from '../common/utils';
import '../css/AddButton.css';
import '../css/FriendRecommend.css';
import isEmpty from '../validation/is-empty';
import axios from 'axios';

import FriendRecommendList from './FriendRecommendList';
import BackButton from './buttons/BackButton';

class FriendRecommend extends Component {

  constructor(props) {
    super(props);

    this.state = {
      friendRecommendList: []
    };
  }

  componentDidMount() {
    // this.props.history.push('/friend');
    console.log('did mount!');
    var token = localStorage.token;
    var config = {
        headers: { 'Authorization': 'Bearer ' + token },
    };

    axios.get('/api/friend/me/recommendation', config)
    .then((result) => {
      console.log('in /api/friend/me/recommendation');
      console.log(result);
      console.log(result.data.data);

      if (result.data.data) {
        var originRecommendFriendList = result.data.data;
        var friendRecommendList = [];
      
        for (var i = 0; i < originRecommendFriendList.length; ++i) {
          var friend = originRecommendFriendList[i].info;
          console.log(friend);
          var friendInfo = {
            num: originRecommendFriendList[i].num,
            id: friend._id,
            memberName: friend.memberName,
            memberProfile: util.getResource(friend.memberProfile),
            privateBoard: friend.privateBoard
          }
        
          friendRecommendList.push(friendInfo);
        }

        console.log(friendRecommendList);
        this.setState({
          friendRecommendList: friendRecommendList
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render() {
    if (!this.state.friendRecommendList) {
      return (
        <div>
       </div>
      )
    }
    else {
      return (
        <div className="FriendRecommend">
          <FriendRecommendList
            friendRecommendList={this.state.friendRecommendList}
            getBoardID={this.props.getBoardID}
          />
          <div className="form-group" align='center'>
            <BackButton/>
          </div>
        </div>
      )
    }
}
}

const mapStateToProps = (state) => ({
    board: state.board,
    member: state.member
});

const mapDispatchToProps = (dispatch) => ({ // 객체를 반환
    getBoardID: (boardID) => dispatch(getBoardID(boardID)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FriendRecommend));