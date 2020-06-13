import { LOGIN, LOGOUT, CONFIRM_USER } from '../actions/types';
import isEmpty from '../validation/is-empty';

const initialState = {
    isAuthenticated: false,
    user: {}
}

export default function(state = initialState, action ) {
    console.log('In auth Reducer');
    switch(action.type) {
        case LOGIN:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload
            }
        case LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                user: action.payload
            }
        case CONFIRM_USER:
            return {
                ...state,
                confirmUser: action.payload
            }
        default:
            return state;
    }
}
