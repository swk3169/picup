// 그룹 회원 정보를 보여주는 컴포넌트

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBoardInfo } from '../actions/board';
import util from '../common/utils';
import axios from 'axios';
import isEmpty from '../validation/is-empty';

import '../css/GroupMemberInfo.scss';

class GroupMemberInfo extends Component {
  constructor() {
    super();

    this.state = {
      memberList: null
    };
  }

  renderMemberList(memberList) {
    if (!memberList) {
      return <div></div>
    }

    return memberList.map( (member, key) => {
      return (
        <li key={key}>
          <img className='memberProfile' src={member.memberProfile}/>
          <span className='memberName'>{member.memberName}</span>
        </li>
      )
    });
  }

  render() { // localhost/auth/facebook, express 서버를 통해 로그인 후 회원 여부에 따라 /member/new, /board/:id로 redirection
    //console.log('in BoardInfo!');
    //console.log(this.props.boardID);
    //console.log(this.props.board.boardInfo);
    //console.log(this.props)
    return (
      <ul className = "GroupMemberInfo">
        {this.renderMemberList(this.state.memberList)}
      </ul>
    );
  }

  componentDidMount() {
    console.log('GroupMemberInfo did mount!');
    console.log(this.props.board.boardID);

    var token = localStorage.token;
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };

    // 가입된 회원의 정보를 받아옴
    axios.get('/api/board/' + this.props.board.boardID + '/member', config)
    .then( (result) => {
      console.log('in axios /api/board/:id/member');
      var originMemberList = result.data.data;
      console.log(result.data.data);
      var memberList = [];
      for (var i = 0; i < originMemberList.length; ++i) {
        var member = originMemberList[i].boardMemberID;

        var memberInfo = {
          memberName: member.memberName,
          memberProfile: util.getResource(member.memberProfile)
        };

        memberList.push(memberInfo);
      }
      console.log(memberList);
      this.setState({
        memberList: memberList
      });
    })
    .catch( (err) => {
      console.log('in axios /api/board/:id/member error!');
      console.log(err);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('GroupMemberInfo Did Update!');
    if (prevProps.board.isJoined != this.props.board.isJoined) {
      console.log('board.isJoined is changed');

      var token = localStorage.token;
      var config = {
        headers: {'Authorization': 'Bearer ' + token},
      };

      axios.get('/api/board/' + this.props.board.boardID + '/member', config)
      .then( (result) => {
        console.log('in axios /api/board/:id/member');
        var originMemberList = result.data.data;
        console.log(result.data.data);
        var memberList = [];
        for (var i = 0; i < originMemberList.length; ++i) {
          var member = originMemberList[i].boardMemberID;

          var memberInfo = {
            memberName: member.memberName,
            memberProfile: util.getResource(member.memberProfile)
          };

          memberList.push(memberInfo);
        }
        console.log(memberList);
        this.setState({
          memberList: memberList
        });
      })
      .catch( (err) => {
        console.log('in axios /api/board/:id/member error!');
        console.log(err);
      });
    }
  }
}

const mapStateToProps = (state) => ({
  board: state.board
});

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupMemberInfo);