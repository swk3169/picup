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

import '../css/CommentListItem.scss';

import btn from '../css/Button.scss';

class CommentListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDeleted:false,
      isModify:false,
      modifyContents:null,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
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

  onDeleteButtonClick(e) {
    e.preventDefault();

    console.log('in CommentListItem delete button clicked');

    const {boardID, postID, id} = this.props;
    console.log(boardID);
    console.log(postID);
    console.log(id);

    var token = localStorage.token;
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };

    axios.delete('/api/board/' + boardID + '/post/' + postID + '/comment/' + id, config)
    .then( result => {
      console.log(result.data);
      if (result.data.data) {
        this.setState({
          isDeleted:true
        });
      }
    })
    .catch( (err) => {
      console.log(err);
    });
  }

  onCancleButtonClick(e) {
    e.preventDefault();
    this.setState({
      isModify:false
    });
  }

  onModifyButtonClick(e) {
    e.preventDefault();
    this.setState({
      modifyContents:this.props.commentContents,
      isModify:true
    });
  }

  onConfirmClick(e) {
    e.preventDefault();
    this.props.commentContents = this.state.modifyContents;

    var body = {
      contents: this.state.modifyContents
    };

    var token = localStorage.token;
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };
    
    const {boardID, postID, id} = this.props;

    axios.put('/api/board/' + boardID + '/post/' + postID + '/comment/' + id, body, config)
    .then( result => {
      console.log(result.data);
      if (result.data.data) {
        this.setState({
          isModify:false
        });
      }
    })
    .catch( (err) => {
      console.log(err);
    });
  }


  render() {
    console.log('in render CommentListItem');
    console.log(this.props);

    const { memberID, memberName, commentTime, memberProfile, commentContents } = this.props;

    if (this.state.isDeleted) {
      return (
        <div>
        </div>
      )
    }
    else if (this.state.isModify) {
      return (
        <div className="CommentListItem" align='left'>
        <table border="0" className="commentInfoTable">
          <tbody>
            <tr>
              <td rowSpan="2"><img className="commentMemberProfile" src={memberProfile}/></td>
              <td><span className='memberName'>{memberName}</span><span className='date'>{util.dateFormatting(commentTime)}</span></td>
              <td><span className="commentButton>" onClick={this.onConfirmClick.bind(this)}>확인</span></td>
              <td onClick={this.onCancleButtonClick.bind(this)}><span className="commentButton>">취소</span></td>
            </tr>
            <tr>
              <td><input
                type="text"
                placeholder="Name"
                name="modifyContents"
                onChange={ this.handleInputChange }
                value={ this.state.modifyContents }
              /></td>
            </tr>
          </tbody>
        </table>
      </div>
      )
    }
    else {
      return (
        <div className="CommentListItem" align='left'>
          <table border="0" className="commentInfoTable">
            <tbody>
              <tr>
                <td rowSpan="2"><img className="commentMemberProfile" src={memberProfile}/></td>
                <td><span className='memberName'>{memberName}</span><span className='date'>{util.dateFormatting(commentTime)}</span></td>
                {this.props.memberInfo._id == memberID ? <td onClick={this.onModifyButtonClick.bind(this)}><span className="commentButton>">수정</span></td> : null}
                {this.props.memberInfo._id == memberID ? <td onClick={this.onDeleteButtonClick.bind(this)}><span className="commentButton>">삭제</span></td> : null}
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
}

const mapStateToProps = (state) => ({
  board: state.board,
  memberInfo: state.member.info
})

export default connect(mapStateToProps)(CommentListItem);