// 그룹 검색시 나오는 그룹 썸네일
// groupID, boardProfile, groupName, numOfMember, totalLike

// 내 그릅 조회시 하나 하나의 그룹을 나타내는 컴포넌트

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBoardID } from '../actions/board';
import util from '../common/utils';
import axios from 'axios';
import isEmpty from '../validation/is-empty';

import { withRouter } from 'react-router-dom';

import '../css/SearchedGroupListItem.scss';

import like from '../img/like.png';

// boardProfile, groupName, groupID(boardID), numOfMember
class SearchedGroupListItem extends Component {
  constructor() {
    super();
  }

  onClick(e) {
    e.preventDefault();
    console.log(this.props.groupID);
    this.props.getBoardID(this.props.groupID); // groupID를 boardID로 설정
    this.props.history.push('/board/group');
  }
  
  onImageClick(e) {
    e.preventDefault();
    console.log(this.props.groupID);
    this.props.getBoardID(this.props.groupID); // groupID를 boardID로 설정
    this.props.history.push('/board/group');
  }

  render() { // localhost/auth/facebook, express 서버를 통해 로그인 후 회원 여부에 따라 /member/new, /board/:id로 redirection
    console.log('in ThumnailGroup!');
    //console.log(this.props.boardID);
    //console.log(this.props.board.boardInfo);
    console.log(this.props);
    const {boardProfile, groupName, totalLike, numOfMember} = this.props;

    /*
    return (
      <div className = "ThumnailGroupMoreData" align='center'>
        <table border="0" className="groupInfoTable">
          <tbody>
            <tr>
              <td rowSpan="3"><img className="tableBoardProfile" src={boardProfile}/></td>
              <td><span className="tableGroupName">{groupName}</span></td>
            </tr>
            <tr>
              <td><span className="tableTotalLike">좋아요<img className="tableLikeImage" src={like}/>{totalLike}</span></td>
              <td><button className='btn btn-default' onClick={this.onClick.bind(this)}>방문</button></td>
            </tr>
            <tr>
              <td><span className="tableNumOfMember">회원수:{numOfMember}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
    */
   return (
    <div className = "ThumnailGroupMoreData" align='center'>
      <div>
        <div className="box"><a onClick={this.onImageClick.bind(this)}><img className="tableBoardProfile" src={boardProfile}/></a></div>
        <div className="box">
          <table border="0" className="groupInfoTable">
            <tbody>
              <tr>
                <td><span className="tableGroupName">{groupName}</span></td>
              </tr>
              <tr>
                <td><span className="tableTotalLike">좋아요<img className="tableLikeImage" src={like}/>{totalLike}</span></td>
              </tr>
              <tr>
                <td><span className="tableNumOfMember">회원수:{numOfMember}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="box">
          <button className='btn btn-default' onClick={this.onClick.bind(this)}>방문</button>
        </div>
      </div>
    </div>
  );
  }

  componentDidMount() {
    //console.log(localStorage.getItem('token'));
    console.log('in ThumnailGroupMoreData Component Did Mount')
    //console.log(this.props.boardID);
    //if (!isEmpty(this.props.boardID)) {
    //  this.props.getBoardInfo(this.props.boardID);
    //}
    console.log(this.props);
  }
}


//export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchedGroupListItem));
export default withRouter(SearchedGroupListItem);