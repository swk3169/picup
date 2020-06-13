// 홈 화면 컴포넌트
// ---------------------- depreciated -----------------------------

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Login from './Login';
import Board from './Board';

import '../css/Home.css';
import isEmpty from '../validation/is-empty';

import { loginUser, logoutUser, confirmUser } from '../actions/authentication';
import { getBoardID, getBoardInfo } from '../actions/board';
import { setMemberInfo } from '../actions/member';

import axios from 'axios';

class Home extends Component {

  componentDidMount() {
    console.log('in Home Component Did Mount')
    var token = localStorage.getItem('token')
    console.log(token);

    if (isEmpty(token)) {
      console.log("Token Not Exist!");
      axios.get('/auth/token')
      .then( result => {
        console.log(result);
        var token = result.data.data;
        console.log(token);
        if (!isEmpty(token)) {
          this.props.loginUser(token);

          var config = {
            headers: {'Authorization': 'Bearer ' + token},
          };

          // this.props.getMyBoardID(config); 
          this.props.getMyBoardID(); 
        }
        else {
          this.props.logoutUser();
        }
      });
    }
    else {
      console.log("Token Exist!");
      var config = {
        headers: {'Authorization': 'Bearer ' + token},
      };
      this.props.loginUser(token);
      //this.props.getMyBoardID(config); 
      this.props.getMyBoardID(); 
    }

    /*
    var token = localStorage.getItem('token');

    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };

    this.props.getMyBoardID(config);   // 처음 로그인 시 token이 저장되지 않아 에러 발생
    */
  }

  /*
  refresh() {
    window.location.refresh();
  }
*/
  componentDidUpdate(prevProps, prevState) { // props를 받아온 후 이전 props와 다를 경우 getBoardInfo를 통해 게시판 정보를 받아옴
    console.log('in Home Component Did Update')
    //console.log(this.props.boardID);
    //console.log('prev:' + this.prevProps.boardID);
    console.log(prevProps);
    console.log(this.props);
    console.log(this.props.board.boardID);
    if (!this.props.board.boardID) {
       console.log('뀨')
      //this.props.loginUser(token);
      //this.props.getMyBoardID(config); 
      this.props.getMyBoardID(); 
    }
  }

  render() {
    const isAuthenticated = this.props.auth.isAuthenticated; // 인증 여부 확인
    const isConfirm = this.props.auth.confirmUser;
    //console.log("in Home!");
    //console.log(isAuthenticated);
    //console.log(isAuthenticated);
    //console.log(this.props.board);
    //console.log(this.props.board.boardID);
    const authLinks = (
    <div className="body">
        <Board boardID={this.props.board.boardID}/>
    </div>
    )

    const guestLinks = (
    <div className="body">
        <Login />
    </div>
    )

    const emptyLinks = (
      <div>
      </div>
    )

    console.log('in render');
    console.log(this.props.board.boardID);
    //if (isAuthenticated && this.props.board.boardID) {
    if (isAuthenticated && isConfirm) {
      return authLinks;
    }
    else if (isAuthenticated) {
      return emptyLinks;
    }
    else {
      return guestLinks;
    }

    /*
    return ( // 인증 여부에 따라 home화면 guest화면을 보여줌
    <div className = "Home">
        {isAuthenticated ? authLinks : guestLinks}
    </div>
    );
    */
  }
}
Home.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    board: state.board,
    member: state.member
})

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
    loginUser: (token) => dispatch(loginUser(token)),
    logoutUser: () => dispatch(logoutUser()),
    getMyBoardID: () => {
      var token = localStorage.token;
      var config = {
        headers: {'Authorization': 'Bearer ' + token},
      };
      axios.get('/api/member/me', config )
      .then((result) => { // axios는 비동기 방식이라서 return 값을 호출한 곳에서 받지 못함
        console.log('in getMyBoardID axios')
        console.log(result.data.data);
        if (result.data.success) {
          const id = result.data.data.privateBoard;
          dispatch(getBoardID(id));                   // boardID 업데이트
          dispatch(setMemberInfo(result.data.data));  // 멤버 정보 
          dispatch(confirmUser(true));
        }
        else {
          dispatch(confirmUser(false));
          dispatch(logoutUser());
        }
      });
      //dispatch(getMyBoardID(conf));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Home);
