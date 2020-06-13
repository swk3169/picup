// 게시물 조회시 게시물 하나 하나를 나타내는 컴포넌트

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setPostID } from '../actions/board';
import util from '../common/utils';
import axios from 'axios';

import isEmpty from '../validation/is-empty';

import { withRouter } from 'react-router-dom';

import like from '../img/like.png';
import dot from '../img/more.png';

import '../css/CommentListItem.css';

class CommentListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isManyPicture: false
    };
  }

  onClick(e) {
    console.log(this.props);
    this.props.setPostID(this.props.id);
    this.props.history.push('/post/detail')
  }
  
  render() {
    const { id, memberName, commentTime, memberProfile, commentContents } = this.props;

    return (
      <div className="CommentListItem" align='left'>
        <table border="0" className="commentInfoTable">
          <tbody>
            <tr>
              <td rowSpan="2"><img className="commentMemberProfile" src={memberProfile}/></td>
              <td><span className='memberName'>{memberName}</span><span className='date'>{util.dateFormatting(commentTime)}</span></td>
            </tr>
            <tr>
              <td><span>{commentContents}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default withRouter(CommentListItem);