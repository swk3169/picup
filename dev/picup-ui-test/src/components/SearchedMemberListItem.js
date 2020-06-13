import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from '../css/SearchedMemberListItem.css';
import AddButton from './buttons/AddButton';
import DeleteButton from './buttons/DeleteButton';
import FriendButton from './buttons/FriendButton';

import util from '../common/utils';

import { withRouter } from 'react-router-dom';

class SearchedMemberListItem extends Component {

    onClick(e) {
      e.preventDefault();
      console.log(this.props.privateBoard);
      this.props.getBoardID(this.props.privateBoard); // groupID를 boardID로 설정
      this.props.history.push('/board');
    }

    render() {
        console.log('MemberListItem');
        console.log(this.props);
        const { profile, memberID, name, addFriend, isFriend, me } = this.props;
        

        return (
            <div className="SearchedMemberListItem" align='center'>
                <div>
                    <div className="box"><a onClick={this.onClick.bind(this)}><img className="profile" src={profile} /></a></div>
                    <div className="box"><span>{name}</span></div>
                    <div className="box">{me ? null: <FriendButton isFriend={isFriend} memberID={memberID}/>}</div>
                </div>
            </div>
        );
    }

}

SearchedMemberListItem.propTypes = {
    profile: PropTypes.string.isRequired,
    memberID: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
}

export default withRouter(SearchedMemberListItem);