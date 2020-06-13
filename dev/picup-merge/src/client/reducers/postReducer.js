import { POST_SUCCESS, GET_POST, GET_BOARD_INFO } from '../actions/types';

const initialState = {
    id: '',
    boardInfo:{data:[], imgStr:''},
    postList:{},
};

const postReducer = (state = initialState, action ) => {
    switch(action.type) {
        case POST_SUCCESS:
            return {
                ...state, id:action.payload
            };

        case GET_BOARD_INFO:
            return {
                ...state, boardInfo:{data:action.payload.data, imgStr:action.payload.str}
            }
        default:
            return state;
    }
}

export default postReducer;
