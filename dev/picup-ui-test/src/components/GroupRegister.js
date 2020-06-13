// 그룹 생성 페이지

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { getBoardID } from '../actions/board';

import '../css/GroupRegister.css';
import isEmpty from '../validation/is-empty';
import axios from 'axios'
import isSuccessed from '../validation/is-successed';
import util from '../common/utils';

import profile from '../img/group.png';

import BackButton from './buttons/BackButton';
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';

class GroupRegister extends Component {

  constructor() {
    super();

    this.state = {
        src : profile,
        boardName: '',
        isOpen: true,
        canImmediateWrite: true,
        memberList: [],
        boardProfile: '',
        friendList: [],
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.toggleIsOpenCheckBox = this.toggleIsOpenCheckBox.bind(this);
    this.toggleCanImmediateWriteCheckBox = this.toggleCanImmediateWriteCheckBox.bind(this);
  }

  handleImageChange(e) {
    e.preventDefault();

    this.setState({
        boardProfile:e.target.files[0]
    })

    if (e.target.files && e.target.files[0]) {
        let reader = new FileReader();
        reader.onload = () => {
            this.setState({
                src: reader.result
            });
        };
        reader.readAsDataURL(e.target.files[0]);
    }
  }

  handleInputChange(e) {
    console.log(e.target);
    //var nextState = {};
    //nextState[e.target.name] = e.target.value;
    this.setState({
        [e.target.name]: e.target.value
    })
    //this.setState(nextState);
    //console.log(this.state);
  }

  toggleIsOpenCheckBox(e) {
    console.log(e.target.checked);
    console.log(e.target.name);
    //var nextState = {};
    //nextState[e.target.name] = e.target.value;
    //e.target.checked = !e.target.checked;
    this.setState({
        isOpen: !this.state.isOpen
    });
    //this.setState(nextState);
    //console.log(this.state);
  }

  toggleCanImmediateWriteCheckBox(e) {
    console.log(e.target.checked);
    console.log(e.target.name);
    //var nextState = {};
    //nextState[e.target.name] = e.target.value;
    //e.target.checked = !e.target.checked;
    this.setState({
        canImmediateWrite: !this.state.canImmediateWrite
    });
    //this.setState(nextState);
    //console.log(this.state);
  }
  
  handleSubmit(e) {
    e.preventDefault();

    const board = {
        boardProfile: this.state.boardProfile,
        isOpen: this.state.isOpen,
        canImmediateWrite: this.state.canImmediateWrite,
        memberList: this.state.memberList,
        boardName : this.state.boardName
    }

    console.log(board);

    let formData = new FormData();

    formData.append('boardProfile', board.boardProfile);
    formData.append('isOpen', board.isOpen);
    formData.append('canImmediateWrite', board.canImmediateWrite);
    
    for (var i = 0; i < board.memberList.length; ++i) {
      formData.append('memberList[]', board.memberList[i]);
    }
    
    formData.append('boardName', board.boardName);

    
    var token = localStorage.getItem('token');
    
    console.log(token);
    var config = {
        headers: {'Authorization': 'Bearer ' + token},
    };
    
    axios.post('/api/board', formData, config)
    .then( (result) => {
        if (result.data.data) {
          console.log(result.data);
          console.log(result.data.data);
          
          this.props.getBoardID(result.data.data);
          this.props.history.push('/board/group');
        }
    })
    
    //this.props.registerMember(formData, config, this.props.history);
  }

  extractMemberInfo(originMemberInfoList) {
    console.log('in extractGroupInfo of Search');

    var memberInfoList = []
    for (var i = 0; i < originMemberInfoList.length; ++i) {
      var member = originMemberInfoList[i].requestedMemberID;

      var memberInfo = {
        memberProfile: util.getResource(member.memberProfile),
        memberName: member.memberName,
        id: member._id,
      };
      //console.log(groupInfo);
      memberInfoList.push(memberInfo);
    }

    return memberInfoList;
  }

  componentDidMount() { // tempToken이 없을 경우 token을 받아옴
    console.log('GroupRegister Component Did Update!');

    var token = localStorage.token;
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };

    axios.get('/api/friend/me/mutualfriend', config )
    .then((result) => {
      const originMutualfriendList = result.data.data;
      
      var mutualfriendList = this.extractMemberInfo(originMutualfriendList);

      console.log(mutualfriendList);
      this.setState({friendList : mutualfriendList});
    });
  }

  renderCheckBoxItem(memberList) {
    return memberList.map( (member, key) => {
      return (
        <div key={key} className="GroupMemberItem" align="left">
          <img src={member.memberProfile}/>
          <label>{member.memberName}</label>
          <Checkbox
            value={member.id}
          />
        </div>
      )
    });
  }

  memberListChanged = (memberList) => {
    console.log(memberList);
    this.setState({
      memberList: memberList
    });
  }

  render() {
    return(
    <div className="GroupRegister">
      <form onSubmit={ this.handleSubmit }>
        <div className="form-group" align='center'>
          <input
            type="text"
            placeholder="그룹명"
            className="boardName"
            name="boardName"
            onChange={ this.handleInputChange }
            value={ this.state.boardName }
          />
        </div>
        <div className="form-group" align='center'>
          <br/><br/>
          <img className="profile" src={this.state.src}/>
          <br/>
          <br/>
          <input
            type="file"
            placeholder="Profile"
            className="boardProfile"
            accept="image/*"
            onChange={ this.handleImageChange }
          />
        </div>
        <div className="form-group" align='center'>
          <input
            type="checkbox"
            placeholder="공개여부"
            className="isOpen"
            name="isOpen"
            value="공개여부"
            onChange={ this.toggleIsOpenCheckBox }
            value={ this.state.isOpen }
            checked={ this.state.isOpen }
          /><span className='MyGroupSpan'>공개 여부</span>
          <input
            type="checkbox"
            placeholder="글쓰기여부"
            className="canImmediateWrite"
            name="canImmediateWrite"
            onChange={ this.toggleCanImmediateWriteCheckBox }
            value="true"
            checked={ this.state.canImmediateWrite }
          /><span className='MyGroupSpan'>글쓰기 여부</span>
          <button type="submit" className='btn btn-default AddGroupButton'>
            만들기
          </button>
          <h1 className="canInviteText">초대 가능 친구 목록</h1>
          <CheckboxGroup
            checkboxDepth={2} // This is needed to optimize the checkbox group
            name="memberList"
            value={this.state.memberList}
            onChange={this.memberListChanged}>

            {this.renderCheckBoxItem(this.state.friendList)}
          </CheckboxGroup>
        </div>
      </form>
    </div>
    )
  }
}

const mapStateToProps = state => ({
    member: state.member
});

const mapDispatchToProps = (dispatch) => ({
  getBoardID: (boardID) => dispatch(getBoardID(boardID)),
})


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GroupRegister))
