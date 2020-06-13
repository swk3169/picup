import { GET_BOARD_ID, GET_BOARD_INFO, GET_POST_LIST, GET_DETAIL_POST, SET_POST_ID, EMPTY_DETAIL_POST, EMPTY_BOARD, EMPTY_POST_LIST, SET_IS_JOINED, SET_WRITE_AUTH, EMPTY_BOARD_INFO } from '../actions/types';
import { SET_DETAIL_POST_LIKE_INFO } from '../actions/types';

const initialState = {
    boardID: '',
    boardInfo:{name:[], profile:''},
    postList:{},
    
    postID: '',
    detailPost:'',
    isJoined: false,
};

const boardReducer = (state = initialState, action ) => {
  console.log('In board Reducer');
  //console.log(action.payload);
  switch(action.type) {
    case GET_BOARD_ID:
      return {
        ...state, boardID:action.payload
      };

    case GET_BOARD_INFO:
      return {
        ...state, boardInfo:{name:action.payload.name, profile:action.payload.profile, id:action.payload.id}
      }

    case GET_POST_LIST:
      return {
        ...state, postList:action.payload
      }

    case GET_DETAIL_POST:
      return {
        ...state, detailPost:action.payload
      }

    case SET_POST_ID:
      return {
        ...state, postID:action.payload, detailPost:null
      }
    
    case SET_IS_JOINED:
      return {
        ...state, isJoined:action.payload
      }

    case SET_WRITE_AUTH:
      return {
        ...state, writeAuth:action.payload
      }
      
    case EMPTY_DETAIL_POST:
      return {
        ...state, detailPost:action.payload
      }
    
    case EMPTY_BOARD: // 게시판 정보를 지운다.
      return {
      }

    case EMPTY_POST_LIST: // 게시판 정보를 지운다.
      return {
        ...state, postList: null
      }

    case EMPTY_BOARD_INFO:
      return {
        ...state, boardInfo: null
      }

    case SET_DETAIL_POST_LIKE_INFO:
      return {
        ...state,
        detailPost: {
          ...state.detailPost,
          numOfLike: action.numOfLike,
          pick: action.pick
        }
      }
      
    default:
      return state;
  }
}

export default boardReducer;
