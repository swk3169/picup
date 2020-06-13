import PropTypes from 'prop-types';
import { getPostList } from '../actions/board';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import util from '../common/utils';
import axios from 'axios';
import isEmpty from '../validation/is-empty';

import { withRouter } from 'react-router-dom';

import MyGroupListItem from './MyGroupListItem';
import BackButton from './buttons/BackButton';

import '../css/MyGroupList.scss';

class MyGroupList extends Component {
  constructor() {
    super();

    this.state = {
      groupList: null
    };

    this.renderGroupList = this.renderGroupList.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    this.props.history.push('/group/new');
  }

  componentDidMount() {
    //console.log(localStorage.getItem('token'));
    console.log('in Group Component Did Mount');
    console.log(this.props);
  }

  renderGroupList(groupList) {
    console.log('in renderGroupList');
    console.log(this.props);
    return groupList.map( (group, key) => {
      return <MyGroupListItem
        key={key}
        groupProfile={group.groupProfile}
        boardID={group.boardID}
        groupName={group.groupName}
        groupID={group.groupID}
        numOfMember={group.numOfMember}
        getBoardID={this.props.getBoardID}
      />
    });
  }

  render(){
    console.log(this.props);
    if (!this.props.groupList) {
      return (
      <div>
      </div>
      );
    }
    else {
      return (
        <div>
          {this.renderGroupList(this.props.groupList)}
        </div>
      );
    }
  }
}

export default MyGroupList;
