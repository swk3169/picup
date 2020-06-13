import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { registerMember } from '../actions/authentication';
import classnames from 'classnames';
import '../css/Register.css';
import isEmpty from '../validation/is-empty';
import axios from 'axios'
import isSuccessed from '../validation/is-successed';

class Register extends Component {

    constructor() {
        super();

        this.state = {
            src : '',
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


        this.props.registerMember(formData, config, this.props.history);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.auth.isAuthenticated) {
            this.props.history.push('/')
        }
        if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    async componentDidMount() {
        
        //const queryString = require('query-string');
        //const parsed = queryString.parse(this.props.location.search);
        //localStorage.setItem('token', parsed.token);
        if (isEmpty(localStorage.getItem('token'))) {
            await axios.get('/auth/token')
            .then( (result) => {
            console.log(result.data.data);
            if (isSuccessed(result.data.success))
                localStorage.setItem('token', result.data.data);
            });
        }
        //if(this.props.auth.isAuthenticated) {
        //    this.props.history.push('/');
        //}
    }


    render() {
        const { errors } = this.state;
        return(
        <div className="container">
            <h2>Picup Register</h2>
            <form onSubmit={ this.handleSubmit }>
                <div className="form-group">
                    <input
                    type="file"
                    placeholder="memberProfile"
                    className="memberProfile"
                    onChange={ this.handleImageChange }
                    />
                    <img className="profile" src={this.state.src}/>
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
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">
                        확인
                    </button>
                </div>
            </form>
        </div>
        )
    }
}

Register.propTypes = {
    registerMember: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps,{ registerMember })(withRouter(Register))
