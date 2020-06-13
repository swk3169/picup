import axios from 'axios';
import { LOGIN, LOGOUT } from './types';
import { CONFIRM_USER } from './types';

import setAuthToken from '../setAuthToken';
import jwt_decode from 'jwt-decode';

//get 로그인
export const loginUser = (token) => {
    console.log('in Action loginUser');
    localStorage.setItem('token', token);
    const decoded = jwt_decode(token);
    //console.log(decoded);
    return {
        type: LOGIN,
        payload: decoded
    }
}


export const logoutUser = () => {
    localStorage.removeItem('token');
    return {
        type: LOGOUT,
        payload: null
    }
}

export const confirmUser = (confirm) => {
    return {
        type: CONFIRM_USER,
        payload: confirm
    }
}
