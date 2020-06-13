import * as types from '../actions/types';
import lodash from 'lodash';

const initialState = {
    id: '',
    friendInfo: { data: [], imgStr: '' },
};

const friendReducer = (state = initialState, action) => {
    switch (action.type) {

        // case types.ADD_FRIEND:
        //     const newId = state.friends[state.friends.length - 1] + 1;
        //     return {
        //         ...state,
        //         friends: state.friends.concat(newId),
        //         friendsById: {
        //             ...state.friendsById,
        //             [newId]: {
        //                 id: newId,
        //                 name: action.name
        //             }
        //         },
        //     }

        // case types.DELETE_FRIEND:
        //     return {
        //         ...state,
        //         friends: state.friends.filter(id => id !== action.id),
        //         friendsById: lodash.omit(state.friendsById, action.id)
        //     }

        // case types.STAR_FRIEND:
        //     return {
        //         ...state,
        //         friendsById: lodash.mapValues(state.friendsById, (friend) => {
        //             return friend.id === action.id ?
        //                 lodash.assign({}, friend, { starred: !friend.starred }) :
        //                 friend
        //         })
        //     }
        // case types.ADD_FRIEND:
        //     let friends = [...state.friendInfo];
        //     friends.unshift({
        //         data: action.payload.data,
        //         imgStr: action.payload.str
        //     })
        //     return {
        //         ...state,
        //         // friendInfo: { data: action.payload.data, imgStr: action.payload.str }
        //         friendInfo: friends
        //     }
        case types.ADD_FRIEND:
            return {
                ...state, friendInfo: { data: action.payload.data, imgStr: action.payload.str }
            }
        case types.DELETE_FRIEND:
            return {
                ...state, friendInfo: { data: action.payload.data, imgStr: action.payload.str }
            }
        case types.GET_FRIEND_INFO: //getFriendInfo실행시 날아오는 타입
            console.log('in Get Friends info Actions')
            console.log(action.payload);
            return { //friendInfo에 state덮어쓰기
                ...state, friendInfo: { data: action.payload.data, imgStr: action.payload.str }//payload설정했던 변수 받아옴
            }
        case types.GET_FRIEND: //getFriendInfo실행시 날아오는 타입
            console.log('in Get Friend Actions')
            console.log(action.payload);
            return { //friendInfo에 state덮어쓰기
                ...state, friendInfo: { data: action.payload.data, imgStr: action.payload.str }//payload설정했던 변수 받아옴
            }
        default:
            return state;
    }
}

export default friendReducer;