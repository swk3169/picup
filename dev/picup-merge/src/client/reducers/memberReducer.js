import { SET_MEMBER_INFO, GET_MEMBER } from '../actions/types';
import isEmpty from '../validation/is-empty';

const initialState = {
  memberInfo: { data: [], imgStr: '' },
  info: ''
}

const memberReducer = (state = initialState, action) => {
  console.log('In member Reducer');
  switch (action.type) {
    case SET_MEMBER_INFO:
      //console.log(action.payload);
      return {
        ...state,
        info: action.payload
      }
    case GET_MEMBER: //getFriendInfo실행시 날아오는 타입
      return { //friendInfo에 state덮어쓰기
        ...state, memberInfo: { data: action.payload.data, imgStr: action.payload.str }//payload설정했던 변수 받아옴
      }
    default:
      return state;
  }
}

export default memberReducer;