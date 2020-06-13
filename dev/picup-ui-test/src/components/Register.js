// 회원 가입 페이지

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { loginUser } from '../actions/authentication';
import classnames from 'classnames';
import '../css/Register.css';
import isEmpty from '../validation/is-empty';
import axios from 'axios'

import profile from '../img/profile.png';

class Register extends Component {

  constructor() {
    super();

    this.state = {
        src : profile,
        memberProfile: '',
        name: '',
        email: '',
        birth: '',
        gender: 'man',
        errors: {}
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }

  handleImageChange(e) {
    e.preventDefault();

    this.setState({
        memberProfile:e.target.files[0]
    })

    if (e.target.files && e.target.files[0]) {
        let reader = new FileReader();
        reader.onload = () => {
            this.setState({
                src: reader.result
            });
        };
        reader.readAsDataURL(e.target.files[0]);
    }
  }

  handleInputChange(e) {
    //var nextState = {};
    //nextState[e.target.name] = e.target.value;
    this.setState({
        [e.target.name]: e.target.value
    })
    //this.setState(nextState);
    //console.log(this.state);
  }

  handleSubmit(e) {
    e.preventDefault();

    const member = {
      memberProfile: this.state.memberProfile,
      name: this.state.name,
      email: this.state.email,
      birth: this.state.birth,
      gender: this.state.gender
    }
    console.log(member);

    let formData = new FormData();

    formData.append('memberName', member.name);
    formData.append('email', member.email);
    formData.append('gender', member.gender);
    formData.append('memberProfile', member.memberProfile);
    formData.append('birth', member.birth);

    var token = localStorage.getItem('token');
    
    console.log(token);
    var config = {
        headers: {'Authorization': 'Bearer ' + token},
    };
    
    axios.post('/api/member', formData, config)
    .then( (result) => {
        if (result.data.data) {
            this.props.loginUser(token);
        }
        this.props.history.push('/home')
    })

    //this.props.registerMember(formData, config, this.props.history);
  }

  async componentDidMount() { // tempToken이 없을 경우 token을 받아옴
    /*
    console.log(localStorage.getItem('tempToken'))
    if (isEmpty(localStorage.getItem('tempToken'))) {
      axios.get('/auth/token')
      .then( result => {
        console.log(result);
        var token = result.data.data;
        localStorage.setItem('tempToken', token);
      });
    }
    */
  }


  render() {
    const { errors } = this.state;
    return(
    <div className="Register">
      <form onSubmit={ this.handleSubmit }>
        <div className="form-group" align='center'>
          <br/><br/>
          <img className="profile" src={this.state.src}/>
          <br/>
          <br/>
          <input
            type="file"
            placeholder="memberProfile"
            className="memberProfile"
            accept="image/*"
            onChange={ this.handleImageChange }
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            className={classnames('form-control form-control-lg', {
            'is-invalid': errors.name
            })}
            name="name"
            onChange={ this.handleInputChange }
            value={ this.state.name }
          />
        {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
        </div>
        <div className="form-group" >
          <input
            type="email"
            placeholder="Email"
            className={classnames('form-control form-control-lg', {
            'is-invalid': errors.email
            })}
            name="email"
            onChange={ this.handleInputChange }
            value={ this.state.email }
          />
          {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
        </div>
        <div className="form-group">
          <input
            type="date"
            placeholder="birth"
            className={classnames('form-control form-control-lg')}
            name="birth"
            onChange={ this.handleInputChange }
            value={ this.state.date }
          />
        </div>
        <div className="form-group" align='center'>
          <input
            type="radio"
            placeholder="gender"
            className="gender"
            name="gender"
            onChange={ this.handleInputChange }
            value="man"
          />남자
          <input
            type="radio"
            placeholder="gender"
            className="gender"
            name="gender"
            onChange={ this.handleInputChange }
            value="woman"
          />여자
        </div>
        <div className="form-group" align='center'>
          <button type="submit" className='btn btn-default'>
            확인
          </button>
        </div>
      </form>
    </div>
    )
  }
}

Register.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
    loginUser: (token) => dispatch(loginUser(token)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Register))
