// 로그인한 회원의 친구 목록 조회

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from '../css/FriendListItem.css';
import { connect } from 'react-redux';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import BackButton from './buttons/BackButton';

class MyFriend extends Component {
    constructor() {
        super();

        this.state = {
            friendList: null
        };     
    }

    componentDidMount() {
        var token = localStorage.token;
        var config = {
            headers: {'Authorization': 'Bearer ' + token},
        };

        axios.get('/api/friend/', config)
        .then( (result) => {
            console.log(result.data.data);
            if(result.data.data) {
                var originFriendList = result.data.data;

                var friendList = [];
                for(var i = 0; i < originFriendList.length; ++i) {
                    if (originFriendList[i].requestID) {
                        var friendInfo = {
                            requestMemberID: originFriendList.requestID,
                            requestedMemberID: originFriendList.requestedID
                        }
                        friendList.push(friendInfo);
                    }
                }

                this.setState({
                    friendList: friendList
                });      
            }
        })
        .catch( (err) => {
            console.log(err);
        });
    }

    renderFriendList(friendList) {
        return friendList.map( (friend, key) => {
            return <ThumnailFriend key={key} requestMemberID={friend.requestID} requestedMemberID={friend.requestedID}/>
        });
    }
    render() {
        console.log('Friend Template Render');
        console.log(this.state);
        if(!this.state.friendList) {
            return <div>
                <div align='center'>
                    <BackButton/>
                </div>
            </div>
        }
        else {
            return <div>
                {this.renderFriendList(this.state.friendList)}
                <div align='center'>
                    <BackButton/>
                </div>
            </div>
        }
    }
}

MyFriend.propTypes = {
    friend: state.friend
}

// export default FriendTemplate;
export default connect(mapStateToProps)(withRouter(MyFriend));