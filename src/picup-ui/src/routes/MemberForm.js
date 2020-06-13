import React, { Component } from 'react';
import { Redirect } from 'react-router'
import axios from 'axios';

const queryString = require('query-string');

//import { Link } from 'react-router-dom'

class MemberForm extends Component {
  constructor(props) {
    super(props);    
      this.state = {
        memberName: '',
        email:'',
        gender:'',
        memberProfile: '',
        fireRedirect: false
      };
    
      this.handleClick = this.handleClick.bind(this);
      this.handleChange = this.handleChange.bind(this);
  }
    
  componentDidMount() { // 서버에서 카테고리 목록을 받아와 state에 저장 후 카테고리 선택지를 렌더링 해줍니다.
    const parsed = queryString.parse(this.props.location.search);
    localStorage.setItem('token', parsed.token)
  }
    
    
  handleChange(e) {
    /*
    var nextState = {};
    //console.log(e.target.value);
    nextState[e.target.name] = e.target.value;    
    this.setState(nextState);
    */
    var nextState = {};
    switch (e.target.name) {
      case 'memberProfile':  // input name이 memberProfile를 가진 태그를 수정했을 경우
        nextState['memberProfile'] = e.target.files[0];  // 이벤트가 발생된 객체의 0번째 파일
        console.log(e.target.files[0]);
        //this.setState({ selectedFile: e.target.files[0] });
        break;
      default:
        nextState[e.target.name] = e.target.value;
        //this.setState({ [e.target.name]: e.target.value });
     }
     this.setState(nextState);
  }
    
  handleClick(e) {
    /*
    e.preventDefault(); // submit 후 refresh(새로고침)를 하지 않도록 이벤트를 전파 하지 않습니다.
    axios.post('/member', {   // axios 모듈을 이용해 '/sites'에 post형식으로 request 합니다.
      
      member_name: this.state.member_name, 
      email: this.state.email,
      gender: this.state.gender,
      member_profile: this.state.member_profile
    }).then(response => {
      this.setState({ fireRedirect: true });
    });
    */
    e.preventDefault();
    const { memberName, email, gender, memberProfile } = this.state;
  
    let formData = new FormData();

    formData.append('memberName', memberName);
    formData.append('email', email);
    formData.append('gender', gender);
    formData.append('memberProfile', memberProfile);

    var token = localStorage.getItem('token');

    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };

    axios.post('/member', formData, config) // post를 하면서 data와 header를 보냄
    .then((result) => {
      this.setState({ fireRedirect: true });
    });
  }
    
  render() {
    if (this.state.fireRedirect === true) { // fireRedirect가 참일 경우 홈으로 이동 합니다.
      return (<Redirect to={'/'}/>)
    }

    var form = (
      <div>
        <form>
          <div>
            <label htmlFor='memberName'>이름</label>
            <input type='text' id='memberName' name='memberName' onChange={this.handleChange}/>
          </div>
          <div>    
            <label htmlFor='email'>이메일</label>
            <input type='email' id='email' name='email' onChange={this.handleChange}/>
          </div>
          <div>
            <label htmlFor='gender'>성별</label>
            <input type='radio' id='gender' name='gender' value='남자' onChange={this.handleChange}/>남자
            <input type='radio' id='gender' name='gender' value='여자' onChange={this.handleChange}/>여자
          </div>
          <div>    
            <label htmlFor='memberProfile'>프로필 사진</label>
            <input type='file' id='file' name='memberProfile' accept='image/*' onChange={this.handleChange}/>
          </div>
          <input type='submit' value='확인' onClick={this.handleClick}/>
        </form>
      </div>
    );
    
    return (
      form
    );
  }
}

export default MemberForm;
//module.exports = Home