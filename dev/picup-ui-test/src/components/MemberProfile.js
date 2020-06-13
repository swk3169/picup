import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Login from './Login';
import Board from './Board';
import LogoutButton from './buttons/LogoutButton';

import '../css/Home.css';
import isEmpty from '../validation/is-empty';

import { loginUser, logoutUser, confirmUser } from '../actions/authentication';
import { getBoardID, getBoardInfo } from '../actions/board';
import { setMemberInfo } from '../actions/member';
import util from '../common/utils';

import axios from 'axios';

import '../css/MemberProfile.css';

class MemberProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      profile:'',
      birth:'',
      gender:'',
      email:'',
      id:'',
    }
  }

  componentDidMount() {
    var memberID = this.props.boardInfo.id;

    var token = localStorage.token;
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };
    
    axios.get('/api/member/' + memberID, config )
    .then((result) => {
      console.log('in Post');
      if (result.data.data) {
        console.log(result.data.data);
        var member = result.data.data;
        this.setState({
          name:member.memberName,
          profile:util.getResource(member.memberProfile),
          birth:util.birthFormatting(member.birth),
          gender:util.genderFormatting(member.gender),
          email:member.email,
          id:member.id,
        });
      }
    });
  }

  render() {
    console.log('MemberProfile');
    console.log(this.props);
    const { name, profile, birth, gender, email, id } = this.state;
      

    return (
        <div className="MemberProfile">
          <br/>
          <img src={profile} />
          <div><span>{name}</span></div>
          <div><span>{birth}</span></div>
          <div><span>{email}</span></div>
          <div align='center'>{this.props.auth.isAuthenticated && this.props.memberInfo.id == id? <LogoutButton/> : null}</div>
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
  boardInfo: state.board.boardInfo,
  auth: state.auth,
  memberInfo: state.member.info
})


export default connect(mapStateToProps)(MemberProfile);