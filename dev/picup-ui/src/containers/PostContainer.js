import { connect } from 'react-redux'
import { getBoardID, getPostList } from '../actions/post';
import Board from '../components/Board';


const mapStateToProps = (state) => {
  return {
    id: state.post.id,
    boardInfo: state.post.boardInfo,
    postList: state.post.postList
  };
}

const mapDispatchToProps = (dispatch) => ({
    getPostList: (boardID, config) => dispatch(getPostList(boardID, config)),
    getBoardID: () => {
      var token = ''
      if (token)  // node에서 token을 url에 실어 redirect를 했을 경우 token이 존재
        localStorage.setItem('token', token)
      else
        token = localStorage.getItem('token') // 이미 로그인 됬을 경우 localStorage에서 token을 가져옴

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
