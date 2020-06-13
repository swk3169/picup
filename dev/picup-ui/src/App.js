import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authentication';
import isEmpty from './validation/is-empty';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Board from './components/Board';
import Header from './components/Header';
import CreatePost from './components/CreatePost';
import Footer from './components/Footer';
import PostContainer from'./containers/PostContainer';

import axios from 'axios';

//import FacebookLogin from './components/FacebookLogin';


//console.log(localStorage)
console.log(localStorage.getItem('token'));

if(!isEmpty(localStorage.token)) { // token이 존재할 경우
  //setAuthToken(localStorage.token);
  var config = {
    headers: {'Authorization': 'Bearer ' + localStorage.token},
  };
  axios.get('/api/member/me', config)
  .then( (result) => {
    if (!isEmpty(result.data.data)) { // 멤버 정보가 존재할 경우
      console.log("Out Of App");
      const decoded = jwt_decode(localStorage.token);
      store.dispatch(setCurrentUser(decoded)); // setCurrentUser를 통해 인증 여부를 참으로 변경
    }
  });
  //setAuthToken(localStorage.token);
  //const decoded = jwt_decode(localStorage.token);
  //store.dispatch(setCurrentUser(decoded));
}

//console.log(localStorage.getItem('token'));

class App extends Component {
  render() {
    return (
        <Router>
                <div className="container">
                  <Header />
                  {}
                  <Route exact path="/" component={ Home } />
                  <Route exact path="/member/new" component={ Register } />
                  <Route exact path="/login" component={ Login } />
                  <Route path="/board" component={ PostContainer } />
                  <Route path="/post/new" component={ CreatePost } />
                  <Footer />
                </div>
          </Router>
    );
  }
}

export default App;
