import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import postReducer from './postReducer';


const rootReducer =  combineReducers({
  errors: errorReducer,
  auth: authReducer, // authReducer가 auth 상태를 담당
  post: postReducer  // postReducer가 post 상태를 담당
});

export default rootReducer;
