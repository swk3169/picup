// 게시판을 지도에 표시하는 컴포넌트

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPostList} from '../actions/board';

import { setPostID, getBoardID } from '../actions/board';

import '../css/PicupMap.scss';

import classnames from 'classnames';
import '../css/Register.scss';
import isEmpty from '../validation/is-empty';
import axios from 'axios'
import isSuccessed from '../validation/is-successed';
import util from '../common/utils';

import { GoogleMap, Marker, withGoogleMap } from "react-google-maps";
import { default as MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";

import { withRouter } from 'react-router-dom';

class PicupPostListMap extends Component {  // PostList의 위치를 지도에 마킹하는 컴포넌트

  constructor() {
    super();

    this.state = {
      marker:null,
      lat:36.212848,
      lng:127.733154,
      thumbnailList:[]
    }

    this.renderMarker = this.renderMarker.bind(this);
  }

  componentDidMount() {
    console.log('PicupPostListMap component did mount') // history push를 통해 준 state
    //this.setState({
    //  boardID: this.props.location.state.boardID
    //});

    /*
    const geolocation = navigator.geolocation;

    const location = new Promise((resolve, reject) => {
      if (!geolocation) {
        reject(new Error('Not Supported'));
      }

      geolocation.getCurrentPosition((position) => {
        console.log(position)
        resolve(position);
        this.setState({
          lat:position.coords.latitude,
          lng:position.coords.longitude
        })
      }, () => {
        reject (new Error('Permission denied'));
      });
    })
    .catch(err => {
      }
    );
    */
    var token = localStorage.getItem('token');
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };

    console.log('PicupPostListMap before axios');
    console.log(this.props.board.boardID);
    axios.get('/api/board/' + this.props.board.boardID + '/map', config)
    .then( result => {
      console.log(result.data);
      console.log(result.data.data);
      var tidyThumbnailList = this.transformThumnailList(result.data.data);
      console.log('tidy result:');
      console.log(tidyThumbnailList);

      this.setState({
        thumbnailList: tidyThumbnailList
      });
    })
    .catch( error => {
      
    })
  }

  transformThumnailList(thumnailList) {
    var tidyThumnailList = []
    console.log(thumnailList.length);
    for (var i = 0; i < thumnailList.length; ++i) {
      var postID = thumnailList[i]._id;
      //if (thumnailList[i].postLocation.isExisted) {
      if (!isEmpty(thumnailList[i].geo)) { // modify for geo data
        var img = util.getResource(thumnailList[i].pictureList[0].thumbnail);
        //console.log(img);

        //var lat = thumnailList[i].postLocation.lat;
        //var long = thumnailList[i].postLocation.long;
        var lat = thumnailList[i].geo[0];
        var long = thumnailList[i].geo[1];
        tidyThumnailList.push({
          postID: postID,
          marker: {position : { lat: lat, lng: long }},
          img:img
        });
      }

      for (var j = 0; j < thumnailList[i].pictureList.length; ++j) {
        var picture = thumnailList[i].pictureList[j];
        // if (picture.pictureLocation.isExisted) {
        if (!isEmpty(picture.geo)) {// modify for geo data 
          var img = util.getResource(picture.thumbnail);
          
          //var lat = picture.pictureLocation.lat;
          //var long = picture.pictureLocation.long;
          var lat = picture.geo[0];
          var long = picture.geo[1];

          tidyThumnailList.push({
            postID: postID,
            marker: {position : { lat: lat, lng: long }},
            img:img
          });
        }
      }
    } // end for i

    return tidyThumnailList;
  }

  componentDidUpdate(prevProps, prevState) { // props를 받아온 후 이전 props와 다를 경우 getBoardInfo를 통해 게시판 정보를 받아옴
    console.log('in PicupPostListMap Component Did Update')
    //console.log(this.props.boardID);
    console.log(this.state);
    console.log(this.props);
    console.log(prevProps.board);

    /*
    if (prevProps.board.boardID != this.props.board.boardID) {
      console.log('in componentDidUpdate')
      var token = localStorage.getItem('token');
      var config = {
        headers: {'Authorization': 'Bearer ' + token},
      };

      console.log(this.props.board.boardID)
      axios.get('/api/board/' + this.props.board.boardID + '/map', config)
      .then( result => {
        console.log(result.data)
        console.log(result.data.data)
        this.setState({
          thumnailList: result.data.data
        })
      })
    }
    */
  }
  
  renderMarker(thumbnailList) {
    console.log('in render Marker!')
    return thumbnailList.map((thumbnail, key) => {
      console.log(thumbnail);
      var marker = thumbnail.marker;
      console.log(marker);
      console.log('postID?');
      console.log(thumbnail.postID);
      console.log(thumbnail);
      const onClick = function() {
        console.log('onClick!');
        console.log(thumbnail.boardID);
        this.props.setPostID(thumbnail.postID);
        this.props.getBoardID(this.props.board.boardID); // 
        this.props.history.push('/post/detail');
      }.bind(this);

      //console.log(...thumnail.marker);
      return (<Marker
        {...marker}
        key={key}
        icon={{
          url: thumbnail.img, // pass your image here
          scaledSize: { width: 40, height: 40},
          anchor: { x: 20, y: 20 },
        }}
        onClick={onClick}
      />)
    })
  }

  onClick(e) {
    this.props.history.goBack();
  }

  render() {
    console.log('PicupPostListMap render');
    console.log(this.state)
    var marker = this.state.marker;

    var testMarker = {
      position: {
        lat: 35.875415,
        lng: 128.62365
      }
    }

    if (this.state.lat) {
      var lat = this.state.lat;
      var lng = this.state.lng;

      const GoogleMapExample = withGoogleMap(props => (
        <GoogleMap
          defaultCenter = { { lat: lat, lng: lng } }
          defaultZoom = { 6 }
          defaultOptions={{mapTypeControl: false}}
          options={{streetViewControl: false, mapTypeControl: false}}
        >
          {this.renderMarker(this.state.thumbnailList)}
        </GoogleMap>
      ));

      // const { errors } = this.state;
      return(
        <div className='PicupMap'>
          <div align='center'> 
            <GoogleMapExample
              containerElement={ <div style={{ height: '600px', width: '100%' }} /> }
              mapElement={ <div style={{ height: '100%' }} /> }
            />
          </div>
          <br/>
          <button className='btn btn-default' onClick={this.onClick.bind(this)}>돌아가기</button>
        </div>
      )
    }
    else {
      return (
        <div></div>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  board: state.board
})

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
  setPostID: (postID) => dispatch(setPostID(postID)),
  getBoardID: (boardID) => dispatch(getBoardID(boardID)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PicupPostListMap))
