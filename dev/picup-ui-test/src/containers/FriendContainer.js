import { connect } from 'react-redux';
import { addFriend, deleteFriend } from '../actions/friend';
import Friend from '../components/Friend';

const mapStateToProps = (state) => {
    console.log('In MemberContainer');
    console.log(state.member);
    return {
    };
}

const mapDispatchToProps = (dispatch) => ({
    addFriend: async (id) => {
        //토큰값으로 config를 생성
        var token = localStorage.getItem('token');
        console.log('Add Friend');
        console.log(token);

        var config = {
            headers: { 'Authorization': 'Bearer ' + token },
        };

        dispatch(addFriend(id, config)) //action에 있는 addFriend를 실행
    },
    deleteFriend: async (id) => {
        //토큰값으로 config를 생성
        console.log("AAAA");
        var token = localStorage.getItem('token');
        console.log('Delete Friend');
        console.log(token);

        var config = {
            headers: { 'Authorization': 'Bearer ' + token },
        };

        dispatch(deleteFriend(id, config)) //action에 있는 addFriend를 실행
    }
})

const FriendContainer = connect(mapStateToProps, mapDispatchToProps)(Friend);

export default FriendContainer;