import React, { Component } from 'react';
import styles from '../css/FriendList.css';
import FriendRecommendListItem from './FriendRecommendListItem';
import PropTypes from 'prop-types';
import lodash from 'lodash';

import '../css/FriendRecommendListItem.css';

class FriendRecommendList extends Component {
  render() {
    console.log('FriendList Render');
    console.log(this.props);
    const friendRecommendList = this.props.friendRecommendList;

    if (friendRecommendList) {
      var renderFriendList = friendRecommendList.map((friend, key) => {
        console.log(friend);
        return (
          <FriendRecommendListItem
            key={friend.id}
            id={friend.id}
            profile={friend.memberProfile}
            name={friend.memberName}
            num={friend.num}
            isFriend={friend.isFriend}
            getBoardID={this.props.getBoardID}
            privateBoard={friend.privateBoard}
          />);
      })

      return (
        <div className="FriendRecommendList">
          {renderFriendList}
        </div>
      );
    }
    else {
      return (
        <div></div>
      )
    }
  }
}

FriendRecommendList.propTypes = {
  friendRecommendList: PropTypes.array.isRequired
}

export default FriendRecommendList;