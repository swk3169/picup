import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'
import util from '../common/utils';
import BackButton from './buttons/BackButton';
import '../css/Search.scss';
import { connect } from 'react-redux';
import FriendList from './FriendList';

import { getBoardID } from '../actions/board';


const keyCodeEnter = 13;

class Friend extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      query: '',
      friendList: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.filterFriend = this.filterFriend.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    this.props.history.goBack();
  }

  onClickRecommendBtn(e) {
    e.preventDefault();
    this.props.history.push('/friend/recommend');
  }
  /*
  extractFriendInfo(originFriendInfoList) {
    console.log('in extractFriendInfo of Search');
    var friendInfoList = []
    
    for (var i = 0; i < originFriendInfoList.length; ++i) {
    
    var friendInfo = {
      friendProfile: util.arrayBufferToBase64Img(originFriendInfoList[i].friendProfile.data),
      friendName: originFriendInfoList[i].boardName,
      friendID: originFriendInfoList[i]._id,
      numOfMember: originFriendInfoList[i].numOfMember,
      totalLike: originFriendInfoList[i].totalLike
    };

    //console.log(friendInfo);
      friendInfoList.push(friendInfo);
    }

    return friendInfoList;
  }
  */
  handleChange(e) {
    this.setState({ query: e.target.value.trim() });
  }

  /*
  handleSubmit(e) {
    e.preventDefault();

    if (e.which === keyCodeEnter) {
      const query = e.target.value.trim();
      this.state = query;
      this.setState({ query: '' });
    }
  }
  */
  componentDidMount() {
    console.log('in FriendViewer Component Did Mount')
    console.log(this.props);

    var token = localStorage.getItem('token');

    var config = {
      headers: { 'Authorization': 'Bearer ' + token },
    };

    axios.get('/api/friend', config)
    .then((result) => {
      console.log('in /api/frieind');
      console.log(result);
      console.log(result.data.data);
      
      var originData = result.data.data;
      var friendList = [];
      for (var i = 0; i < originData.length; ++i) {
        var friend = originData[i].requestedMemberID;
        
        var friendInfo = {
          id: friend._id,
          memberName: friend.memberName,
          memberProfile: util.getResource(friend.memberProfile),
          isFriend: originData[i].isFriend,
          privateBoard: friend.privateBoard
        }
        friendList.push(friendInfo);
      }

      console.log(friendList);
      this.setState({
        friendList: friendList
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  filterFriend(friendList) {
    friendList = friendList.filter(
      (friend) => {
        var name = friend.memberName.toLowerCase();
        var query = this.state.query.toLowerCase();
        return name.indexOf(query) > -1;
      }
    );

    return friendList;
  }

  /*
  renderFriend(friendList) {
        console.log(this.props)
        console.log('renderFriendViewer');
        console.log(this.props);
        friendList = friendList.filter(
            (friend) => {
                var name = friend.memberName.toLowerCase();
                var query = this.state.query.toLowerCase();
                return name.indexOf(query) > -1;
            }
        );

        return friendList.map((friend, key) => {
            console.log(friend.id);
            return (
                <FriendListItem
                    key={friend.id}
                    id={friend.id}
                    profile={friend.memberProfile}
                    name={friend.memberName}
                    addFriend={this.props.addFriend}
                    deleteFriend={this.props.deleteFriend}
                />
            );
        })
    }
    */
    // <FriendList friendList={this.state.friendList} addFriend={this.props.addFriend} deleteFriend={this.props.deleteFriend} />
  render() {
    console.log('Friend render');
    var filterFriendList = this.filterFriend(this.state.friendList);
    console.log(filterFriendList);

    if (filterFriendList) {
      return (
      <div className="Friend">
        <form>
          <div className="form-friend" align='center'>
            <input
              type="text"
              placeholder="이름"
              className="query"
              name="query"
              value={this.state.query}
              onChange={this.handleChange}
              onKeyDown={this.handleSubmit}
            />
            <button className="btn btn-default" onClick={this.onClickRecommendBtn.bind(this)}>친구 추천</button>
            </div>
              <FriendList friendList={filterFriendList} getBoardID={this.props.getBoardID}/>
              <div className="form-friend" align='center'>
                <BackButton />
              </div>
            </form>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  board: state.board
})
  
const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
  getBoardID: (boardID) => dispatch(getBoardID(boardID)),
})
  
export default connect(mapStateToProps, mapDispatchToProps)(Friend)


//export default Friend