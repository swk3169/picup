// Search(부모)로 부터 groupList정보를 받아서 뿌려준다.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import '../css/SearchedGroupList.css';
import isEmpty from '../validation/is-empty';
import axios from 'axios'
import isSuccessed from '../validation/is-successed';
import util from '../common/utils';

import BackButton from './buttons/BackButton';
import SearchedGroupListItem from './SearchedGroupListItem';

import '../css/Search.css';

class SearchedGroupList extends Component {
  render() {
    console.log('in SearchGroup');
    console.log(this.props.groupList);
    console.log(this.props.getBoardID);
    if (!this.props.groupList) {
      return <div></div>;
    }

    var renderGroup = this.props.groupList.map( (group, key) => {
      return (
        <SearchedGroupListItem
          key={key}
          boardProfile={group.boardProfile}
          numOfMember={group.numOfMember}
          totalLike={group.totalLike}
          groupName={group.groupName}
          groupID={group.groupID}
          getBoardID={this.props.getBoardID}
        />
      )
    })

    return (
      <div className="SearchedGroupList">
        <span>그룹</span>
        {renderGroup}
      </div>
    );
  }
}

export default SearchedGroupList
