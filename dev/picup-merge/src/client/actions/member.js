import axios from 'axios';
import { SET_MEMBER_INFO } from './types';

/*
export const getMyBoardID = (config) => dispatch => {
  axios.get('/api/member/me', config )
  .then((result) => {
    console.log('In Action getMyBoardID');
    console.log(result.data.data);
    const id = result.data.data.privateBoard;
    return {
      type: GET_MY_BOARD_ID,
      payload: id
    }
  })
}
*/

export const setMemberInfo = (memberInfo) => {
  console.log('In Action setMemberInfo');
  console.log(memberInfo);
  return {
    type: SET_MEMBER_INFO,
    payload: memberInfo
  }
}

/*
export const getPostList = ( boardID, config ) => dispatch => {
  const result=axios.get('/api/board/' + boardID, config )
                    .then((result) => {
                          console.log(result)
                          dispatch ({
                            type: GET_POST,
                            payload: result.data.data
                          })
                        })
}
*/