// 게시물 등록 페이지

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPostList} from '../actions/board';

import classnames from 'classnames';
import '../css/Register.css';
import isEmpty from '../validation/is-empty';
import axios from 'axios'
import isSuccessed from '../validation/is-successed';
import util from '../common/utils';

import BackButton from './buttons/BackButton';

import '../css/PostForm.css';

class PostForm extends Component {

  constructor() {
    super();

    this.state = {
        src : '',
        photos: '',
        contents: '',
        visibility: '0',
        tag: '',
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.renderPhotos = this.renderPhotos.bind(this);
  }

  async handleImageChange(e) {
    e.preventDefault();
    
    this.setState({
        photos:e.target.files
    })

    console.log('뀨');
    const files = e.target.files;
    console.log(files);

    if (e.target.files && e.target.files[0]) {
        let reader = new FileReader();
        reader.onload = () => {
            this.setState({
                src: reader.result
            });
        };
        reader.readAsDataURL(e.target.files[0]);
    }

    var photoList = this.renderPhotos(e.target.files);
    for (var i = 0; i < photoList.length; ++i) {
      /*
      photoList[i] = await(photoList[i].then( (result) => {
        return result;
      }));
      */
      photoList[i] = await(photoList[i]); // photos.map(async(photo, key)) async 함수의 Promise를 기다려줌
    }

    //const files = e.target.files;
    console.log("뀨");
    console.log(files);
    let formData = new FormData();

    for (const file of files) {
      console.log('in formData file uploading')
      formData.append('files[]', file);
      console.log(file);
    }

    axios.post('/classfication/image', formData)
    .then( (result) => {
      var array = JSON.parse(result.data.prediction);

      console.log(array);
    });

    console.log('after renderPhotos');
    console.log(photoList);
    this.setState({
      photosStr: photoList
    });


  }

  onClick(e) {
    e.preventDefault();
    this.props.history.goBack();
  }

  handleInputChange(e) {
    //var nextState = {};
    //console.log(this.state);
    //nextState[e.target.name] = e.target.value;
    this.setState({
        [e.target.name]: e.target.value
    })
    //this.setState(nextState);
    //console.log(this.state);
  }

  handleSubmit(e) {
    e.preventDefault();

    const post = {
        photos: this.state.photos,
        contents: this.state.contents,
        visibility: this.state.visibility,
        tag: this.state.tag
    }
    console.log(post);

    //console.log(this.state);

    let formData = new FormData();

    
    // formData.append('photos', post.photos);
    for (const file of post.photos) {
      console.log('in formData file uploading')
      formData.append('photos[]', file);
      console.log(file);
    }

    formData.append('contents', post.contents);
    formData.append('visibility', post.visibility);
    formData.append('tag', post.tag);

    var token = localStorage.getItem('token');
    
    console.log(token);
    var config = {
        headers: {'Authorization': 'Bearer ' + token},
    };
    
    /*
    axios.post('/api/member', formData, config)
    .then( (result) => {
        if (result.data.data) {
            localStorage.removeItem('tempToken');
            console.log(result.data.data);
            this.props.loginUser(token);
        }
        this.props.history.push('/')
    })
    */
    console.log('in PostForm handleSubmit');
    console.log(this.state);
    console.log(this.props);
    console.log(formData);

    axios.post('/api/board/' + this.props.board.boardID + '/post', formData, config)
    .then( (result) => {
      console.log(result.data);
      if (result.data.data) {
        this.props.getPostList(this.props.board.boardID); // 새로 등록한 게시물을 업데이트
      }
    });
    this.props.history.goBack();

    //this.props.registerMember(formData, config, this.props.history);
  }

  componentDidMount() {
    console.log('in PostForm Component Did Mount')
    console.log(this.props);
    //console.log(this.props.location.state.boardID) // history push를 통해 준 state
    //this.setState({
    //  boardID: this.props.location.state.boardID
    //});
  }

  componentDidUpdate(prevProps, prevState) { // props를 받아온 후 이전 props와 다를 경우 getBoardInfo를 통해 게시판 정보를 받아옴
    console.log('in PostForm Component Did Update')
    //console.log(this.props.boardID);
    //console.log(this.state);
    console.log(this.props);
  }

  renderPhotos(photos) { // data url
    console.log(photos);
    var photos = Object.keys(photos).map(function(k) { return photos[k] });
    console.log(photos);
    
    return photos.map(async(photo, key) => {
      /*
      var photoStr = await(util.readUploadedFileAsDataURL(photo)
      .then( (result) => {
        console.log(result);
        return result;
      }));
      */
     
      var photoStr = await(util.readUploadedFileAsDataURL(photo));

      console.log(photoStr);
      if (photoStr.indexOf("image/jpeg") != -1) {
        return (
          <li key={key}>
            <img key={key} src={photoStr} className='rotate90'/>
          </li>
        );
      }
      else if (photoStr.indexOf("video/mp4") != -1) {
        return (
          <li key={key}>
            <video controls>
              <source src = {photoStr} type="video/mp4">
              </source>
            </video>
          </li>
        );
      }
    });
  }

  onClick(e) {
    e.preventDefault();
    this.props.history.goBack();
  }

  render() {
    if (this.state.photosStr) {
      //console.log('in Post Form render')
      //console.log(this.state.photosStr[0].props.src);
    }
    // const { errors } = this.state;
    return(
    <div className="PostForm">
      
      <form onSubmit={ this.handleSubmit }>
        <div className="form-group" align='right'>
          <select name="visibility" onChange={ this.handleInputChange }>
            <option value="0">전체공개</option>
            <option value="1">친구공개</option>
            <option value="2">혼자보기</option>
          </select>
        </div>
        <div align='center'>
          <ul className = "PictureInfo">
            {this.state.photosStr}
          </ul>
          
          <br/>
          <textarea
            rows="5"
            cols="50"
            placeholder="contents"
            className="contents"
            name="contents"
            onChange={ this.handleInputChange }
            value={ this.state.contents }
          />
        </div>
        <div className="form-group" align='center'>
          <br/>
          <input
            type="file"
            className="form-control-file"
            placeholder="photos"
            accept="image/*,video/*"
            multiple
            onChange={ this.handleImageChange }
          />
        </div>
        <div className="form-group" align='center'>
          <input
            type="text"
            placeholder="tag"
            className="tag"
            name="tag"
            onChange={ this.handleInputChange }
            value={ this.state.tag }
          />
        </div>
        <div className="form-group" align='center'>
          <button className="btn btn-default canclebutton" onClick={this.onClick.bind(this)}>취소</button>
          <button type="submit" className="btn btn-default postbutton">
            작성
          </button>
        </div>
        
      </form>

    </div>
    )
  }
}

/*
const mapStateToProps = (state) => ({
  board: state.board
});
*/

const mapStateToProps = (state) =>  {
  console.log('mapStateToProps');
  console.log(state);
  return {
    board: state.board
  }
};

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
  getPostList: (boardID) => { // 새로 등록한 게시물 업데이트 용도
    console.log('in getPostInfo props');
    console.log(boardID);

    var token = localStorage.token;
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };

    axios.get('/api/board/' + boardID + '/post', config )
    .then((result) => {
      console.log('in axios.get api board/:id/post');
      console.log(result.data.data);
      var postList = result.data.data;
      postList = postList.reverse();
      for (var i = 0; i < postList.length; ++i) {
        console.log(postList[i].pictureList)
        for (var j = 0; j < postList[i].pictureList.length; ++j) {
          postList[i].pictureList[j].thumnail = postList[i].pictureList[j].thumbnail
        }
      }
      
      console.log(postList);
      dispatch(getPostList(postList));
    });
    //dispatch(getMyBoardID(conf));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PostForm)
