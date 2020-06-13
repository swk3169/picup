// 게시물 등록 페이지

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getBoardID } from '../actions/board';

import '../css/CommentForm.css';
import isEmpty from '../validation/is-empty';
import axios from 'axios'
import isSuccessed from '../validation/is-successed';
import util from '../common/utils';

import CommentList from './CommentList';

class CommentForm extends Component {

  constructor() {
    super();

    this.state = {
        comment:'',
        commentList:[]
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

    var data = {
      comment: this.state.comment
    };

    var token = localStorage.getItem('token');
    
    console.log(token);
    var config = {
        headers: {'Authorization': 'Bearer ' + token},
    };
    
    const {boardID, postID} = this.props.board;

    axios.post('/api/board/' + this.props.board.boardID + '/post/' + postID + '/comment', data, config)
    .then( (result) => {
      console.log(result.data);
      if (result.data.data) {
        this.setState({
          commentList: result.data.data.commentList,
          comment:'',
        });
      }
    });
    
    //this.props.registerMember(formData, config, this.props.history);
  }

  componentDidMount() {
    console.log('in CommentForm Component Did Mount')

    const {boardID, postID} = this.props.board;
    console.log(boardID);
    console.log(postID);

    var token = localStorage.token;
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };

    axios.get('/api/board/' + boardID + '/post/' + postID + '/comment', config)
    .then( result => {
      console.log(result.data);
      if (result.data.data) {
        this.setState({
          commentList: result.data.data.commentList
        });
      }
    })
    .catch( (err) => {
      console.log(err);
    });

  }

  render() {

    return(
    <div className="CommentForm">
      <form onSubmit={ this.handleSubmit }>
        <div className="form-group" align='center'>
          <input
            type="text"
            placeholder="댓글입력"
            className="comment"
            name="comment"
            onChange={ this.handleInputChange }
            value={ this.state.comment }
          />
          <button type="submit" className="btn btn-default commentBtn">
            작성
          </button>
        </div>
        <div className="form-group" align='center'>

        </div>
      </form>
      
      <CommentList commentList={this.state.commentList}/>
    </div>
    )
  }
}


const mapStateToProps = (state) => ({
  board: state.board
});

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
  getBoardID: (boardID) => dispatch(getBoardID(boardID)),
})

export default connect(mapStateToProps)(CommentForm);
