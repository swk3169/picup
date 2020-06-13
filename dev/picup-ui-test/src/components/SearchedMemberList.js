import React, { Component } from 'react';
import styles from '../css/SearchedMemberList.css';
import SearchedMemberListItem from './SearchedMemberListItem';
import PropTypes from 'prop-types';
import lodash from 'lodash';
import util from '../common/utils';

class SearchedMemberList extends Component {
  
  render() {
    console.log('In SearchedMemberList');
    console.log(this.props.addFriend);
    console.log(this.props.deleteFriend);
    
    var memberList = this.props.memberList;
    console.log(memberList);
    
    if (!this.props.memberList) {
      return <div></div>;
    }

    const renderMember = this.props.memberList.map( (member, key) => {
      console.log(member);
        return (
          <SearchedMemberListItem
            key={key}
            memberID={member.memberID}
            profile={member.memberProfile}
            name={member.memberName}
            getBoardID={this.props.getBoardID}
            privateBoard={member.privateBoard}
            isFriend={member.isFriend}
            me={member.me}
          />);
      })

    return (
      <div className="SearchedMemberList">
        <span>회원</span>
        {renderMember}
      </div>
    );

    /*
    if (memberList) {
      console.log('this is memberList');
      console.log(memberList);
      console.log(this.props.memberList);
      const renderMember = this.props.memberList.map( (member, key) => {
        console.log(member);
          return (
            <SearchedMemberListItem
              key={key}
              id={member._id}
              profile={util.arrayBufferToBase64Img(member.memberProfile.data)}
              name={member.memberName}
              getBoardID={this.props.getBoardID}
              privateBoard={member.privateBoard}
              isFriend={member.isFriend}
            />);
        })

      return (
        <div className="SearchedMemberList">
          <span>회원</span>
          {renderMember}
        </div>
      );
    }
    else {
      return (
        <div></div>
      )
    }
    */
  }
}

export default SearchedMemberList;