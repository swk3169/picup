import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getBoardID } from '../actions/board';

import classnames from 'classnames';
import isEmpty from '../validation/is-empty';
import axios from 'axios'
import isSuccessed from '../validation/is-successed';
import util from '../common/utils';

import BackButton from './buttons/BackButton';
import SearchedGroupList from './SearchedGroupList';
import SearchedMemberList from './SearchedMemberList';

import '../css/Search.css';

class Search extends Component {

  constructor() {
    super();

    this.state = {
        query: '',
        groupList: null,
        memberList: null,
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    this.props.history.goBack();
  }

  extractGroupInfo(originGroupInfoList) {
    console.log('in extractGroupInfo of Search');

    var groupInfoList = []
    for (var i = 0; i < originGroupInfoList.length; ++i) {
      var groupInfo = {
        boardProfile: util.getResource(originGroupInfoList[i].boardProfile),
        groupName: originGroupInfoList[i].boardName,
        groupID: originGroupInfoList[i]._id,
        numOfMember: originGroupInfoList[i].numOfMember,
        totalLike: originGroupInfoList[i].totalLike
      };
      //console.log(groupInfo);
      groupInfoList.push(groupInfo);
    }

    return groupInfoList;
  }

  extractMemberInfo(originMemberInfoList) {
    console.log('in extractGroupInfo of Search');
    console.log(originMemberInfoList);
    var memberInfoList = []
    for (var i = 0; i < originMemberInfoList.length; ++i) {
      var memberInfo = {
        memberProfile: util.getResource(originMemberInfoList[i].memberProfile),
        memberName: originMemberInfoList[i].memberName,
        memberID: originMemberInfoList[i]._id,
        privateBoard: originMemberInfoList[i].privateBoard,
        isFriend: originMemberInfoList[i].isFriend,
        me: originMemberInfoList[i].me
      };
      //console.log(groupInfo);
      memberInfoList.push(memberInfo);
    }

    return memberInfoList;
  }

  handleInputChange(e) {
    //var nextState = {};
    //console.log(this.state);
    //nextState[e.target.name] = e.target.value;
    this.setState({
        [e.target.name]: e.target.value
    })
    //this.setState(nextState);
    //console.log(this.state);
  }

  handleSubmit(e) {
    e.preventDefault();
    
    console.log('in Search handleSubmit');

    var token = localStorage.getItem('token');

    var config = {
        headers: {'Authorization': 'Bearer ' + token},
    };

    axios.get('/api/board?name=' + this.state.query, config)
    .then( (result) => {
      console.log(result);
      console.log(result.data.data);
      var groupInfoList = this.extractGroupInfo(result.data.data);
      this.setState({
        groupList: groupInfoList
      });
    })
    .catch( (err) => {
      console.log(err);
    });

    axios.get('/api/member?name=' + this.state.query, config)
    .then( (result) => {
      console.log('in axios /api/member?name')
      console.log(result.data.data);
      //var memberList = result.data.data;
      var memberInfoList = this.extractMemberInfo(result.data.data);
      this.setState({
        memberList: memberInfoList
      });
    })
    .catch( (err) => {
      console.log(err);
    })
    //console.log(this.state);
    //console.log(this.props);
    
    //this.props.registerMember(formData, config, this.props.history);
  }

  componentDidMount() {
    console.log('in Search Component Did Mount')
    console.log(this.props);

  }

  render() {
    console.log('In Search Component');
    console.log(this.props);
    console.log(this.state);
    
    return(
    <div className="PostForm">
      <form>
        <div className="form-group" align='center'>
          <input
            type="text"
            placeholder="검색어"
            className="query"
            name="query"
            
            onChange={ this.handleInputChange }
            value={ this.state.query }
          />
          <button type="submit" className="btn btn-default" onClick={this.handleSubmit}>
            검색
          </button>
        </div>
        <SearchedGroupList
          groupList={this.state.groupList}
          getBoardID={this.props.getBoardID}
        />

        <SearchedMemberList
          memberList={this.state.memberList}
          getBoardID={this.props.getBoardID}
        />

        <div className="form-group" align='center'>
          <BackButton/>
        </div>
      </form>

    </div>
    )
  }
}

/*
const mapStateToProps = (state) => ({
  board: state.board
});
*/

const mapStateToProps = (state) => ({
  board: state.board
})

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
  getBoardID: (boardID) => dispatch(getBoardID(boardID)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Search)
