import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Login from './Login';
import Board from './Board';
import LogoutButton from './buttons/LogoutButton';

import '../css/Home.scss';
import isEmpty from '../validation/is-empty';

import { loginUser, logoutUser, confirmUser } from '../actions/authentication';
import { getBoardID, getBoardInfo } from '../actions/board';
import { setMemberInfo } from '../actions/member';
import util from '../common/utils';

import axios from 'axios';

import '../css/MemberProfile.scss';

import btn from '../css/Button.scss';

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
      /* 수정 화면 전용 state */
      modifyName: '',
      modifyProfile:'',
      modifyBirth:'',
      modifyEmail:'',
      modifyProfile:'',
      profileImgFile:'',
      isModify:false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleSubmit(e) {
    e.preventDefault();

    const member = {
      memberProfile: this.state.profileImgFile,
      name: this.state.modifyName,
      email: this.state.modifyEmail,
      birth: this.state.modifyBirth,
    }
    console.log(member);

    let formData = new FormData();

    formData.append('memberName', member.name);
    formData.append('email', member.email);
    formData.append('gender', member.gender);
    formData.append('memberProfile', member.memberProfile);
    formData.append('birth', member.birth);

    var token = localStorage.getItem('token');
    
    console.log(formData);
    console.log(formData.get('memberName'));
    var config = {
        headers: {'Authorization': 'Bearer ' + token},
    };
    
    axios.put('/api/member/me', formData, config)
    .then( (result) => {
      console.log(result.data.data);
      this.props.history.push('/home')
    })

    //this.props.registerMember(formData, config, this.props.history);
  }

  onModifyButtonClick(e) {
    e.preventDefault();
    this.setState({
      isModify:true,
      modifyProfile:this.state.profile,
      modifyBirth: this.state.birth,
      modifyEmail:this.state.email,
      modifyName:this.state.name
    });
  }

  onCancleButtonClick(e) {
    e.preventDefault();
    this.setState({
      isModify:false,
    });
  }

  handleImageChange(e) {
    e.preventDefault();

    this.setState({
      profileImgFile:e.target.files[0]
    })

    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = () => {
          this.setState({
              modifyProfile: reader.result
          });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }
  
  handleInputChange(e) {
    //var nextState = {};
    //nextState[e.target.name] = e.target.value;
    console.log(e.target);
    this.setState({
        [e.target.name]: e.target.value
    })
    //this.setState(nextState);
    //console.log(this.state);
  }

  render() {
    console.log('MemberProfile');
    console.log(this.props);
    const { name, profile, birth, gender, email, id, isModify } = this.state;
      

    if (isModify) {
      return (
        <div className="MemberProfile">
        <form onSubmit={ this.handleSubmit }>
          <div className="form-group" align='center'>
            <br/><br/>
            <img className="modifyProfile" src={this.state.modifyProfile}/>
            <br/>
            <br/>
            <input
              type="file"
              placeholder="memberProfile"
              className="memberProfile"
              accept="image/*"
              onChange={ this.handleImageChange }
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              className="form-control form-control-lg"
              name="modifyName"
              onChange={ this.handleInputChange }
              value={ this.state.modifyName }
            />
          </div>
          <div className="form-group">
            <input
              type="date"
              placeholder="birth"
              className="form-control form-control-lg"
              name="modifyBirth"
              onChange={ this.handleInputChange }
              value={ this.state.modifyBirth }
            />
          </div>
          <div className="form-group" >
            <input
              type="email"
              placeholder="Email"
              className="form-control form-control-lg"
              name="modifyEmail"
              onChange={ this.handleInputChange }
              value={ this.state.modifyEmail }
            />
          </div>
          <div className="form-group" align='center'>
            <button type="submit" className='btn btn-default'>
              확인
            </button>
            <button type="submit" className='btn btn-default'  onClick={this.onCancleButtonClick.bind(this)}>
              취소
            </button>
          </div>
        </form>
      </div>
      )
    }
    else {
      return (
        <div className="MemberProfile">
          <br/>
          <img src={profile} />
          <div><span>{name}</span></div>
          <div><span>{birth}</span></div>
          <div><span>{email}</span></div>
          <div align='center'>{this.props.auth.isAuthenticated && this.props.memberInfo.id == id? <button className="btn btn-default btn-sm" onClick={this.onModifyButtonClick.bind(this)}>수정하기</button> : null}</div>
          <div align='center'>{this.props.auth.isAuthenticated && this.props.memberInfo.id == id? <LogoutButton/> : null}</div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  boardInfo: state.board.boardInfo,
  auth: state.auth,
  memberInfo: state.member.info
})


export default connect(mapStateToProps)(MemberProfile);