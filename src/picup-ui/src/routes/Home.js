import React, { Component } from 'react';

const queryString = require('query-string');

//import { Link } from 'react-router-dom'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {  // 컴포넌트가 보여진 후 서버에서 site 정보를 불러와 state에 설정합니다.
    const parsed = queryString.parse(this.props.location.search);
    //console.log(parsed.token)
    localStorage.setItem('token', parsed.token)
    //console.log(localStorage.getItem('token'))
  }

  render() {
    /*
    return (
      <div className="Home">
        Picup
        <Link to="/auth/facebook"><button>Facebook</button></Link>
      </div>
    );
    */
    return (
      <div className="Home">
        Picup
      </div>
    );
  }
}

export default Home;
//module.exports = Home