import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from '../css/FriendListItem.scss';
import AddButton from './buttons/AddButton';
import DeleteButton from './buttons/DeleteButton';
import btn from '../css/Button.scss';

class MemberListItem extends Component {

    render() {
        console.log('MemberListItem');
        console.log(this.props);
        const { profile, id, name, addFriend } = this.props;
        

        return (
            <li className={styles.friendListItem}>
                <div className={styles.friendInfos}>
                    <img src={profile} />
                    <div><span>{name}</span></div>
                </div>
                <div className={styles.friendActions}>
                    <AddButton className={`btn btn-default ${styles.btnAction}`} onClick={() => addFriend(id)}>
                    </AddButton>
                </div>
            </li>
        );
    }

}

MemberListItem.propTypes = {
    profile: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    addFriend: PropTypes.func.isRequired
}

export default MemberListItem;