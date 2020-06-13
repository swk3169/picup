import axios from 'axios';
import { GET_POST, GET_ERRORS, POST_SUCCESS, GET_BOARD_INFO } from './types';


export const createPost = (formData, config, history) => dispatch => {
    axios.post('/api/member', formData, config)
            .then(res => history.push('/home'))
            .catch(err => {
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                });
            });
}

export const getBoardID = (config) => dispatch => {
  const response=axios.get('/api/member/me', config )
                    .then((result) =>{
                      let id = result.data.data.privateBoard;
                      dispatch(getBoardInfo(id, config))
                    })
}

function arrayBufferToBase64Img( buffer ) {
  let binary = '';
  let bytes = new Uint8Array( buffer );
  let len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return 'data:image/jpeg;base64,' + window.btoa( binary );
}

export const getBoardInfo = ( boardID, config ) => dispatch => {
  const result=axios.get('/api/board/' + boardID, config )
                    .then((result) => {
                          let str = arrayBufferToBase64Img(result.data.data.boardProfile.data);
                          console.log(str)

                          dispatch ({
                            type: GET_BOARD_INFO,
                            payload: {data:result.data.data, str:str}
                          })
                        })
}

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
