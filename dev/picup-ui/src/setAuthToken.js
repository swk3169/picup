import axios from 'axios';

// 토큰 디폴트 설정
const setAuthToken = token => {
    console.log(token);
    if(token) {
        axios.defaults.headers.common['Authorization'] = token;
    }
    else {
        delete axios.defaults.headers.common['Authorization'];
    }
}

export default setAuthToken;
