import React, { Component } from 'react';
import styles from '../css/FriendList.css';
import MemberListItem from './MemberListItem';
import PropTypes from 'prop-types';
import lodash from 'lodash';
import util from '../common/utils';

class MemberList extends Component {

    render() {
        console.log('memberlist');
        console.log('MemberList Render');
        console.log(this.props.addFriend);
        console.log(this.props.deleteFriend);
        const memberInfo = this.props.memberInfo.data;

        if (memberInfo) {
            const memberList = lodash.map(memberInfo, (member) => {
                console.log(member);
                return (
                    <MemberListItem
                        key={member._id}
                        id={member._id}
                        profile={util.arrayBufferToBase64Img(member.memberProfile.data)}
                        name={member.memberName}
                        addFriend={this.props.addFriend}
                        deleteFriend={this.props.deleteFriend}
                    />);
            })

            return (
                <ul className={styles.friendList}>
                    {memberList}
                </ul>
            );
        }
        else {
            return (
                <div></div>
            )
        }
    }
}

MemberList.propTypes = {
    memberInfo: PropTypes.object.isRequired,
    addFriend: PropTypes.object.isRequired,
    deleteFriend: PropTypes.object.isRequired
}

export default MemberList;