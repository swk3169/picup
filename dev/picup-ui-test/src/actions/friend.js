import * as types from './types';
import axios from 'axios';

// 버퍼를 이미지로 바꿔주는 함수
function arrayBufferToBase64Img(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return 'data:image/jpeg;base64,' + window.btoa(binary);
}

// 친구 추가
export const addFriend = (memberID, config) => dispatch => {
    console.log('add Friend');
    var data = {
        "requestedMemberID" : memberID
    }
    const result = axios.post('/api/friend/me', data, config)
        .then((result) => {
            console.log(result)
            let str = arrayBufferToBase64Img(result.data.data); //이미지는 함수를 이용하여 버퍼를 이미지로 바꿔야함
            dispatch({
                type: types.ADD_FRIEND,
                payload: { data: result.data.data, str: str }
            })
        })
}

// 친구 삭제
export const deleteFriend = (memberID, config) => dispatch => {
    console.log('in deleteFriend action');
    console.log(memberID);
    const result = axios.delete('/api/friend/me/' + memberID, config)
        .then((result) => {
            console.log('in axios delete friend');
            console.log('AAAA');
            console.log(result.data)
            let str = arrayBufferToBase64Img(result.data.data); //이미지는 함수를 이용하여 버퍼를 이미지로 바꿔야함
            dispatch({
                type: types.DELETE_FRIEND,
                payload: { data: result.data.data, str: str }
            })
        })
}

// 회원 이름 조회
export const getMemberName = (memberName, config) => dispatch => {
    const result = axios.get('/api/member?name=' + memberName, config)
        .then((result) => {
            console.log(result)
            let str = arrayBufferToBase64Img(result.data.data); //이미지는 함수를 이용하여 버퍼를 이미지로 바꿔야함
            dispatch({
                type: types.GET_MEMBER,
                payload: { data: result.data.data, str: str }
            })
        })
}
// 친구 조회, 내 친구의 친구
export const getFriends = (memberID, config) => dispatch => {
    const result = axios.get('/api/friend/' + memberID, config)
        .then((result) => {
            console.log(result)
            let str = arrayBufferToBase64Img(result.data.data); //이미지는 함수를 이용하여 버퍼를 이미지로 바꿔야함
            dispatch({
                type: types.GET_FRIEND_INFO,
                payload: { data: result.data.data, str: str }
            })
        })
}

// 친구 조회
export const getFriend = (config) => dispatch => {
    const result = axios.get('/api/friend', config)
        .then((result) => {
            console.log(result)
            let str = arrayBufferToBase64Img(result.data.data); //이미지는 함수를 이용하여 버퍼를 이미지로 바꿔야함
            dispatch({
                type: types.GET_FRIEND,
                payload: { data: result.data.data, str: str }
            })
        })
}