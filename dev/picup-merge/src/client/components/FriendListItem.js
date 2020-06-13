import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from '../css/FriendListItem.scss';
import AddButton from './buttons/AddButton';
import DeleteButton from './buttons/DeleteButton';
import FriendButton from './buttons/FriendButton';

import { setBoardState } from '../actions/board';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';

class FriendListItem extends Component {
  onClick(e) {
    e.preventDefault();
    console.log(this.props.privateBoard);
    this.props.getBoardID(this.props.privateBoard); // groupID를 boardID로 설정
    this.props.history.push('/board');
  }

  render() {
    console.log('FriendListItem');
    console.log(this.props);
    
    const { profile, id, name, isFriend } = this.props;
    
    return (
      <div className="FriendListItem" align='center'>
        <div>
          <div className='box'><a onClick={this.onClick.bind(this)}><img className="FriendProfile" src={profile}/></a></div>
          <div className='box'><span>{name}</span></div>
          <div className='box'><FriendButton isFriend={isFriend} memberID={id}/></div>
        </div>
      </div>
    );
  }
}

FriendListItem.propTypes = {
    profile: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
  setBoardState: (state) => dispatch(setBoardState(state)),
})


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FriendListItem));