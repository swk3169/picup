import { connect } from 'react-redux'
import { getBoardID, getPostList } from '../actions/post';
import Board from '../components/Board';

import axios from 'axios'
import isEmpty from '../validation/is-empty';
import isSuccessed from '../validation/is-successed';
import jwt_decode from 'jwt-decode';
import { setCurrentUser } from '../actions/authentication';

// mapStateToProps(state, [ownProps]): (Function) store 의 state 를 컴포넌트의 props 에 매핑 시켜줍니다.
// ownProps 인수가 명시될 경우, 이를 통해 함수 내부에서 컴포넌트의 props 값에 접근 할 수 있습니다.
const mapStateToProps = (state) => {
  return {
    id: state.post.id,
    boardInfo: state.post.boardInfo,
    postList: state.post.postList
  };
}

// mapDispatchToProps(dispatch, [ownProps]): (Function or Object)  컴포넌트의 특정 함수형 props 를 실행 했을 때, 
// 개발자가 지정한 action을 dispatch 하도록 설정합니다. ownProps의 용도는 위 인수와 동일합니다.
const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
    getPostList: (boardID, config) => dispatch(getPostList(boardID, config)),
    getBoardID: async () => {
      /*
      var token = ''
      if (token)  // node에서 token을 url에 실어 redirect를 했을 경우 token이 존재
        localStorage.setItem('token', token)
      else
        token = localStorage.getItem('token') // 이미 로그인 됬을 경우 localStorage에서 token을 가져옴
      */
      var token = localStorage.getItem('token');
      console.log('Get Board!');
      console.log(token);
      
      if (isEmpty(token)) { // 토큰이 없을 경우 처음 로그인한 회원의 경우 localhost/board로 온다. 따라서 토큰이 등록되어 있지 않을 경우 board에서 /auth/token을 통해 token을 받아와 저장해야한다.
        token = await axios.get('/auth/token') // 처음 로그인시 /auth/token을 통해 토큰 값을 가져옴
        .then( (result) => {
          console.log(result.data.data);
          console.log(result.data.success);
          if (isSuccessed(result.data.success)) {
            console.log("Success!");
            const decoded = jwt_decode(result.data.data);
            dispatch(setCurrentUser(decoded));
            return result.data.data;
          }
        });
        localStorage.setItem('token', token);
      }

      var config = {
        headers: {'Authorization': 'Bearer ' + token},
      };
      console.log(config)

      dispatch(getBoardID(config))
    }
})

const PostContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Board);

export default PostContainer;
