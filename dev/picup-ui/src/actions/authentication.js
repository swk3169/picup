import axios from 'axios';
import { GET_ERRORS, SET_CURRENT_USER } from './types';
import setAuthToken from '../setAuthToken';
import jwt_decode from 'jwt-decode';

//post 회원가입
export const registerMember = (formData, config, history) => dispatch => { // dispatch를 이미 했기 때문에 Register Component에서 dispatch를 할 필요가 없음....
    axios.post('/api/member', formData, config)
            .then( (result) => {
                if (result.data.data) { // 회원 가입 후 setCurrentUser를 통해 인증 여부를 참으로 만듬
                    console.log(result.data.data);
                    const decoded = jwt_decode(localStorage.token);
                    dispatch(setCurrentUser(decoded));
                }
                history.push('/home')
            })  // home으로 이동
            .catch(err => {
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                });
            });
}

//get 로그인
export const loginUser = (user) => dispatch => {
    axios.post('/api/users/login', user)
            .then(res => {
                const { token } = res.data;
                localStorage.setItem('jwtToken', token);
                setAuthToken(token);
                const decoded = jwt_decode(token);
                dispatch(setCurrentUser(decoded));
            })
            .catch(err => {
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                });
            });
}

export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

export const logoutUser = (history) => dispatch => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
    history.push('/login');
}
