import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authentication';
import isEmpty from './validation/is-empty';
import { connect } from 'react-redux';

import Login from './components/Login';   // 로그인 화면
import Home from './components/Home';     // 홈 화면(로그인, 나의 게시물 조회)
import Home2 from './components/Home2';     // 로그인 테스트용 홈 화면
import Board from './components/Board';     // 홈 화면(로그인, 나의 게시물 조회)
import Register from './components/Register'; // 회원 가입 화면
import GroupRegister from './components/GroupRegister'; // 회원 가입 화면
import PostForm from './components/PostForm'; // 게시물 작성 화면
import DetailPost from './components/DetailPost'; // 게시물 상세 보기 화면
import Header from './components/Header';
import Navbar from './components/Navbar';
import PicupMap from './components/PicupMap';  // 게시물 위치 지정 화면
import PicupPostListMap from './components/PicupPostListMap';  // 게시물 지도 보기 화면
import MyGroup from './components/MyGroup'; // 내 그룹 조회 화면
import GroupBoard from './components/GroupBoard'; // 그룹 게시판 화면
import Friend from './components/Friend'; // 그룹 게시판 화면
import FriendRecommend from './components/FriendRecommend'; // 친구추천 화면
import Search from './components/Search'; // 검색 화면
import SearchPicupMap from './components/SearchPicupMap'; // 검색 화면
import PicupColorfulMap from './components/PicupColorfulMap';
import Message from './components/Message';
import IdentifyHome from './components/IdentifyHome';
import MemberProfile from './components/MemberProfile';
import LoginConfirm from './components/LoginConfirm';

import axios from 'axios';

import './App.css';

import MemberContainer from './containers/MemberContainer';  // 멤버
//import MyFriend from './components/MyFriend';  // 내 친구
import FriendContainer from './containers/FriendContainer';  // 내 친구
import LogoutButton from './components/buttons/LogoutImgButton';
import MessageLinkButton from './components/buttons/MesageLinkButton';

//import FacebookLogin from './components/FacebookLogin';


//console.log(localStorage)
class App extends Component {
  render() {
    return (
        <Router>
                <div className="App">
                  <Header/>
                  <Navbar/>
                  <Route exact path="/" component={ Login } />
                  <Route exact path="/home" component={ Home2 } />
                  <Route exact path="/identify" component={ IdentifyHome }/>
                  <Route exact path="/member/new" component={ Register } />
                  <Route exact path="/group/new" component={ GroupRegister } />
                  <Route exact path="/post/new" component={ PostForm } />
                  <Route exact path="/post/detail" component={ DetailPost } />
                  <Route exact path="/post/location" component={ PicupMap } />
                  <Route exact path="/map" component={PicupPostListMap}/>
                  <Route exact path="/group" component={MyGroup}/>
                  <Route exact path="/board/group" component={GroupBoard}/>
                  <Route exact path="/search" component={Search}/>
                  <Route exact path="/around" component={SearchPicupMap}/>
                  <Route exact path="/member" component={MemberContainer}/>
                  <Route exact path="/friend" component={Friend}/>
                  <Route exact path="/board" component={Board}/>
                  <Route exact path="/friend/recommend" component={FriendRecommend}/>
                  <Route exact path="/colorfulmap" component={PicupColorfulMap}/>
                  <Route exact path="/message" component={Message}/>
                  <Route exact path="/profile" component={MemberProfile}/>
                  <Route exact path="/loginconfirm" component={LoginConfirm}/>
                </div>
          </Router>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(App);
