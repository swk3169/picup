export const GET_ERRORS = 'GET_ERRORS';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';

export const POST_SUCCESS='POST_SUCCESS';

export const GET_POST='GET_POST';

// 인증 관리
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const CONFIRM_USER = 'CONFIRM_USER';

export const SET_MEMBER_INFO = 'SET_MEMBER_INFO' // api/member/me를 통해서 받은 데이터 저장

export const SET_PARTY_LIST = 'SET_PARTY_LIST'; // api/board/

// 맵 좌표 관리
export const SET_MARKER_LIST = 'SET_MARKER_LIST';
export const SET_GPS_INFO = 'SET_GPS_INFO';

// 게시물 관리
export const GET_BOARD_ID = 'GET_BOARD_ID';    // BOARD_ID를 설정
export const GET_BOARD_INFO ='GET_BOARD_INFO';
export const GET_POST_LIST = 'GET_POST_LIST';
export const GET_DETAIL_POST = 'GET_DETAIL_POST';
export const SET_POST_ID = 'SET_POST_ID';  // 상세 게시물 조회를 할때 postID를 설정하여 DetailPost.js에서 postID를 이용하여 상세 게시물 조회를 한다.
export const EMPTY_DETAIL_POST = 'EMPTY_DETAIL_POST'; // 상세 게시물 조회 후 props를 초기화 하기 한다.
export const EMPTY_BOARD = 'EMPTY_BOARD'; // board정보를 비워준다.
export const EMPTY_POST_LIST = 'EMPTY_POST_LIST'; // post list 정보를 비워준다.
export const EMPTY_BOARD_INFO = 'EMPTY_BOARD_INFO'; // post list 정보를 비워준다.
export const SET_IS_JOINED = 'SET_IS_JOINED'; // board의 가입 여부를 설정한다.
export const SET_WRITE_AUTH = 'SET_WRITE_AUTH'; // board의 글쓰기 권한 여부를 설정한다.
export const SET_DETAIL_POST_LIKE_INFO = 'SET_DETAIL_POST_LIKE_INFO';  // Detail Post의 numOfLike, pick 상태를 수정한다.
export const SET_TRAVEL_SCHEDULE_LIST = 'SET_TRAVEL_SCHEDULE_LIST';
export const SET_BOARD_STATE = 'SET_BOARD_STATE';

// 친구관리
export const ADD_FRIEND = 'ADD_FRIEND';
export const DELETE_FRIEND = 'DELETE_FRIEND';
export const GET_FRIEND = 'GET_FRIEND';
export const GET_FRIEND_INFO = 'GET_FRIEND_INFO';
export const GET_FRIEND_ID = 'GET_FRIEND_ID';

// 멤버관리
export const GET_MEMBER = 'GET_MEMBER';

