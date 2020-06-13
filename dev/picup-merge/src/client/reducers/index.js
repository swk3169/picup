import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import postReducer from './postReducer';
import boardReducer from './boardReducer';
import memberReducer from './memberReducer';
import mapReducer from './mapReducer';
import friendReducer from './friendReducer';

const rootReducer =  combineReducers({
  errors: errorReducer,
  auth: authReducer, // authReducer가 auth 상태를 담당
  post: postReducer,  // postReducer가 post 상태를 담당
  board: boardReducer,
  member: memberReducer,  // 로그인한 member 정보을 담당
  map: mapReducer,
  friend: friendReducer,
});

export default rootReducer;
