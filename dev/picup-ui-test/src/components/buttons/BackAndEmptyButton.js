// 뒤로 가기 컴포넌트(액션을 이용하여 this.props.board를 초기화)
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'; // withRouter로 Component를 감싸면 this.props.history를 사용할 수 있게 해줌
import PropTypes from 'prop-types';
import { emptyBoard } from '../actions/board';
import '../../css/BackButton.css';

class BackAndEmptyButton extends Component {

  constructor() {
    super();
  }

  onClick(e) {
    e.preventDefault();
    this.props.emptyBoard();
    this.props.history.goBack();
  }

  render() {
    return(
      <button className='btn btn-default' onClick={this.onClick.bind(this)}>돌아가기</button>
    )
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
  emptyBoard: () => dispatch(emptyBoard())
    //dispatch(getMyBoardID(conf));
});


export default withRouter(BackAndEmptyButton)
