import React, { Component } from 'react';
import styles from '../css/FriendList.css';
import FriendListItem from './FriendListItem';
import PropTypes from 'prop-types';
import lodash from 'lodash';

class FriendList extends Component {
  render() {
    console.log('FriendList Render');
    console.log(this.props);
    const friendList = this.props.friendList;

    if (friendList) {
      var renderFriendList = friendList.map((friend, key) => {
        console.log(friend);
        return (
          <FriendListItem
            key={friend.id}
            id={friend.id}
            profile={friend.memberProfile}
            name={friend.memberName}
            isFriend={friend.isFriend}
            getBoardID={this.props.getBoardID}
            privateBoard={friend.privateBoard}
          />);
      })

      return (
        <div>
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

FriendList.propTypes = {
    friendList: PropTypes.array.isRequired,
}

export default FriendList;