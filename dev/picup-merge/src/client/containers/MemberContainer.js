import { connect } from 'react-redux';
import { getMemberName, addFriend, deleteFriend } from '../actions/friend';
import Member from '../components/Member';

const mapStateToProps = (state) => {
    console.log('In MemberContainer');
    console.log(state.member);
    return {
        memberInfo: state.member.memberInfo
    };
}
const mapDispatchToProps = (dispatch) => ({
    getMemberName: async (name) => {
        //토큰값으로 config를 생성
        var token = localStorage.getItem('token');
        console.log('Get MemberName');
        console.log(token);

        var config = {
            headers: { 'Authorization': 'Bearer ' + token },
        };

        dispatch(getMemberName(name, config)) //action에 있는 getFriendName을 실행
    },
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
        var token = localStorage.getItem('token');
        console.log('Delete Friend');
        console.log(token);

        var config = {
            headers: { 'Authorization': 'Bearer ' + token },
        };

        dispatch(deleteFriend(id, config)) //action에 있는 addFriend를 실행
    }
})

const MemberContainer = connect(mapStateToProps, mapDispatchToProps)(Member);

export default MemberContainer;