import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from '../css/FriendListItem.scss';
import AddButton from './buttons/AddButton';
import DeleteButton from './buttons/DeleteButton';
import FriendButton from './buttons/FriendButton';

import { withRouter } from 'react-router-dom';
import { setBoardState } from '../actions/board';

import { connect } from 'react-redux';

import '../css/FriendRecommendListItem.scss';

class FriendRecommendListItem extends Component {
  onClick(e) {
    e.preventDefault();
    console.log(this.props.privateBoard);
    this.props.getBoardID(this.props.privateBoard); // groupID를 boardID로 설정
    this.props.setBoardState(0);
    this.props.history.push('/board');
  }

  render() {
    console.log('FriendListItem');
    console.log(this.props);
    
    const { profile, id, name, num } = this.props;
    console.log('Num Knoews');
    console.log(num);
    return (
      <div className="FriendRecommendListItem" align='center'>
          <table>
            <tbody>
              <tr>
                <td rowSpan="3"><a onClick={this.onClick.bind(this)}><img className="tableProfile" src={profile}/></a></td>
                <td align='center'><span className="tableFriendName">{name}</span></td>
                <td rowSpan="3"><FriendButton isFriend={false} memberID={id}/></td>
              </tr>
              <tr>
                <td><span className="tableNum">함께 아는 친구 : {num}명</span></td>
              </tr>
            </tbody>
          </table>
      </div>
    );
  }
}

FriendRecommendListItem.propTypes = {
    profile: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
  setBoardState: (state) => dispatch(setBoardState(state)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FriendRecommendListItem));