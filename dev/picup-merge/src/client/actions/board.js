import axios from 'axios';
import { GET_BOARD_ID, GET_BOARD_INFO, GET_POST_LIST, GET_DETAIL_POST } from './types';
import { SET_POST_ID } from './types';
import { EMPTY_DETAIL_POST, EMPTY_BOARD, EMPTY_POST_LIST, EMPTY_BOARD_INFO } from './types';
import { SET_IS_JOINED, SET_WRITE_AUTH } from './types';
import { SET_DETAIL_POST_LIKE_INFO } from './types';
import { SET_TRAVEL_SCHEDULE_LIST } from './types';
import { SET_BOARD_STATE } from './types';

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

// board.boardID에 boardID 설정
export const getBoardID = (id) => {
  console.log('In Action getMyBoardID');
  return {
    type: GET_BOARD_ID,
    payload: id  
  }
}

// board info(name, profile) 설정
export const getBoardInfo = (name, profile, id) => { 
  console.log('In Action getBoardInfo');
  return {
    type: GET_BOARD_INFO,
    payload: {name: name, profile: profile, id}
  }
}

 // post list 설정
export const getPostList = (posts) => { 
  console.log('In Action getPostList');
  return {
    type: GET_POST_LIST,
    payload: posts
  }
}

// 상세 게시물 설정
export const getDetailPost = (post) => {
  console.log('In Action getDetailList');
  return {
    type: GET_DETAIL_POST,
    payload: post
  }
}

// 게시물 ID 설정
export const setPostID = (postID) => {
  console.log('In Action setPostID');
  return {
    type: SET_POST_ID,
    payload: postID
  }
}

// 그룹 가입 여부 설정
export const setIsJoined = (isJoined) => {
  console.log('In Action setIsJoined');
  return {
    type: SET_IS_JOINED,
    payload: isJoined
  }
}

// 글쓰기 권한 설정
export const setWriteAuth = (writeAuth) => {
  console.log('In Action writeAuth');
  return {
    type: SET_WRITE_AUTH,
    payload: writeAuth
  }
}

// DetailPost 정보 비우기
export const emptyDetailPost = () => {
  console.log('In Action emptyDetailPost');
  return {
    type: EMPTY_DETAIL_POST,
    payload: null
  }
}

// board 정보(전체) 비우기
export const emptyBoard = () => {
  console.log('In Action emptyBoard');
  return {
    type: EMPTY_BOARD,
    payload: null
  }
}

// post list 정보(게시물 목록) 비우기
export const emptyPostList = () => {
  console.log('In Action emptyPostList');
  return {
    type: EMPTY_POST_LIST,
    payload: null
  }
}

// board info 정보(이름, 프로파일) 비우기
export const emptyBoardInfo = () => {
  console.log('In Action emptyPostList');
  return {
    type: EMPTY_BOARD_INFO,
    payload: null
  }
}

// 상세 게시물 조회시 좋아요 수, 좋아요 여부 설정
export const setDetailPostLikeInfo = (numOfLike, pick) => {
  console.log('In Action setDetailPostLikeInfo');
  return {
    type: SET_DETAIL_POST_LIKE_INFO,
    numOfLike: numOfLike,
    pick: pick
  }
}

export const setTravelScheduleList = (travelScheduleList) => {
  console.log('In Action setTravelScheduleList');
  return {
    type: SET_TRAVEL_SCHEDULE_LIST,
    travelScheduleList: travelScheduleList
  }
}

export const setBoardState = (state) => {
  console.log('In Action setTravelScheduleList');
  return {
    type: SET_BOARD_STATE,
    boardState: state
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