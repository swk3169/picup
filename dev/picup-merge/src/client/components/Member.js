import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchMember from '../components/SearchMember';
import { addFriend, deleteFriend } from '../actions/friend';
import MemberList from '../components/MemberList';
import styles from '../css/Friend.scss';

class Member extends Component {
    componentDidMount() {
        this.props.getMemberName();
        this.props.addFriend();
        this.props.deleteFriend();
    }
    render() {
        console.log('In FriendContainer render');
        console.log(this.props);
        console.log(addFriend);
        console.log(deleteFriend);

        return (
            <div className={styles.friend}>
                <h1>회원검색</h1>
                <SearchMember getMemberName={this.props.getMemberName} />
                <MemberList memberInfo={this.props.memberInfo} addFriend={this.props.addFriend} deleteFriend={this.props.deleteFriend} />
            </div>
        );
    }
}

Member.propTypes = {
    memberInfo: PropTypes.object.isRequired,
    addFriend: PropTypes.func.isRequired,
    deleteFriend: PropTypes.func.isRequired
}

export default Member;