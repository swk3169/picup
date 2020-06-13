// 내 그룹 보기 컴포넌트

import PropTypes from 'prop-types';
import { getPostList } from '../actions/board';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import util from '../common/utils';
import axios from 'axios';
import isEmpty from '../validation/is-empty';

import { withRouter } from 'react-router-dom';
import { getBoardID } from '../actions/board';

import MyGroupList from './MyGroupList';
import BackButton from './buttons/BackButton';

import '../css/MyGroup.scss';

class MyGroup extends Component {
  constructor() {
    super();

    this.state = {
      groupList: null
    };
  }

  onClick(e) {
    e.preventDefault();
    this.props.history.push('/group/new');
  }

  componentDidMount() {
    var token = localStorage.token;
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };

    axios.get('/api/board/me', config)
    .then( (result) => {
      console.log(result.data.data);
      if (result.data.data) {
        var originGroupList = result.data.data;

        var groupList = [];
        for (var i = 0; i < originGroupList.length; ++i) {
          if (originGroupList[i].boardID) {
            var originBoardInfo = originGroupList[i].boardID;
            console.log(originBoardInfo);
            var boardInfo = {
              groupName: originBoardInfo.boardName,
              groupID: originBoardInfo._id,
              groupProfile: util.getResource(originBoardInfo.boardProfile),
              numOfMember: originGroupList[i].numOfMember
            }
            groupList.push(boardInfo);
          }
        }
        
        console.log(groupList);
        this.setState({
          groupList: groupList
        });
      }
    })
    .catch( (err) => {
      console.log(err);
    });

  }

  render(){
    console.log(this.state);
    if (!this.state.groupList) {
      return (
        <div>
        </div>
      )
    }
    else {
      return (
        <div className='MyGroup'>
            <div align='right'>
              <button className='btn btn-default AddGroupBtn btn-sm' onClick={this.onClick.bind(this)}>그룹추가</button>
            </div>
            <MyGroupList
              groupList={this.state.groupList}
              getBoardID={this.props.getBoardID}
            />
            <BackButton/>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  board: state.board,
  member: state.member
});

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
  getBoardID: (boardID) => dispatch(getBoardID(boardID)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MyGroup));
