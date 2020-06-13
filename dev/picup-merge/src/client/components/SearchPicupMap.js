// 현재 위치 주변 태그 검색

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setPostID, getBoardID } from '../actions/board';
import { setMarkerList } from '../actions/map';
import { setGPSInfo } from '../actions/map';

import classnames from 'classnames';

import '../css/SearchPicupMap.scss';

import isEmpty from '../validation/is-empty';
import axios from 'axios'
import isSuccessed from '../validation/is-successed';
import util from '../common/utils';

import { GoogleMap, Marker, withGoogleMap } from "react-google-maps";

import { withRouter } from 'react-router-dom';

class SearchPicupMap extends Component {

  constructor() {
    super();

    this.state = {
      marker:null,
      lat:null,
      lng:null,
      thumbnailList:[],
      tag:''
    }

    this.renderMarker = this.renderMarker.bind(this);
  }

  componentDidMount() {
    console.log('component did mount') // history push를 통해 준 state
    //this.setState({
    //  boardID: this.props.location.state.boardID
    //});

    const geolocation = navigator.geolocation;

    const location = new Promise((resolve, reject) => {
      if (!geolocation) {
        reject(new Error('Not Supported'));
      }

      geolocation.getCurrentPosition((position) => {
        console.log(position)
        resolve(position);
        
        /*
        this.setState({
          lat:position.coords.latitude,
          lng:position.coords.longitude
        })
        */
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        this.props.setGPSInfo({lat, lng});

      }, () => {
        reject (new Error('Permission denied'));
      })
    })
    .catch(err => {
    });
  }

  componentDidUpdate(prevProps, prevState) { // props를 받아온 후 이전 props와 다를 경우 getBoardInfo를 통해 게시판 정보를 받아옴
    //console.log('in BoardInfo Component Did Update')
    //console.log(this.props.boardID);
    console.log(this.state);
  }
  
  transformthumbnailList(thumbnailList) {
    console.log('in transform thumbnailList of PicupPostListMap');
    var tidyThumbnailList = []
    
    for (var i = 0; i < thumbnailList.length; ++i) {
      console.log(thumbnailList[i]);
      var postID = thumbnailList[i]._id;
      var boardID = thumbnailList[i].postedBoardID;
      //if (thumbnailList[i].postLocation.isExisted) {
      if (!isEmpty(thumbnailList[i].geo)) { // modify for geo data
        console.log('뀨');
        var img = util.getResource(thumbnailList[i].pictureList[0].thumbnail);
        //console.log(img);

        //var lat = thumbnailList[i].postLocation.lat;
        //var long = thumbnailList[i].postLocation.long;
        var lat = thumbnailList[i].geo[0];
        var long = thumbnailList[i].geo[1];
        tidyThumbnailList.push({
          postID: postID,
          marker: {position : { lat: lat, lng: long }},
          boardID,
          img:img
        });
      }

      for (var j = 0; j < thumbnailList[i].pictureList.length; ++j) {
        var picture = thumbnailList[i].pictureList[j];
        // if (picture.pictureLocation.isExisted) {
        if (!isEmpty(picture.geo)) {// modify for geo data 
          var img = util.getResource(picture.thumbnail);
          
          //var lat = picture.pictureLocation.lat;
          //var long = picture.pictureLocation.long;
          var lat = picture.geo[0];
          var long = picture.geo[1];

          tidyThumbnailList.push({
            postID: postID,
            marker: {position : { lat: lat, lng: long }},
            boardID,
            img:img
          });
        }
      }
    } // end for i
    return tidyThumbnailList;
  }

  handleInputChange(e) {
    //var nextState = {};
    //console.log(this.state);
    //nextState[e.target.name] = e.target.value;
    this.setState({
        [e.target.name]: e.target.value
    })

    console.log(this.state);
    //this.setState(nextState);
    //console.log(this.state);
  }

  handleButtonClick(e) {
    var token = localStorage.getItem('token');

    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };

    var lat = this.props.gps.lat;
    var lng = this.props.gps.lng;
    console.log('lat?lng?');
    console.log(lat);
    console.log(lng);
    //var query = '?lat=' + this.state.lat + '&long=' + this.state.lng + '&tag=' + this.state.tag;
    var query = '?lat=' + lat + '&long=' + lng + '&tag=' + this.state.tag;

    axios.get('/api/board/map' + query, config)
    .then( (result) => {
      console.log(result.data);
      if (result.data.success) {
        console.log(result.data);
        console.log(result.data.data);

        var tidyThumbnailList = this.transformthumbnailList(result.data.data);
        this.props.setMarkerList(tidyThumbnailList);

        console.log('tidy result:');
        console.log(tidyThumbnailList);
  
        this.setState({
          thumbnailList: tidyThumbnailList
        });
        
      }
    });
  }

  renderMarker(thumbnailList) {
    console.log('in render Marker!')
    return thumbnailList.map((thumbnail, key) => {
      console.log(thumbnail);
      var marker = thumbnail.marker;
      console.log(marker);

      const onClick = function() {
        console.log('onClick!');
        console.log(thumbnail.boardID);
        this.props.setPostID(thumbnail.postID);
        this.props.getBoardID(thumbnail.boardID);
        this.props.history.push('/post/detail');
      }.bind(this);

      //console.log(...thumbnail.marker);
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

  handleMapClick(e) {
    var lat = e.latLng.lat();
    var lng = e.latLng.lng();
    console.log(lat)
    console.log(lng)
    this.props.setGPSInfo({lat, lng});
    /*
    this.setState({
      lat: lat,
      lng: lng,
    });
    */
  }
  
  onClick(e) {
    this.props.setMarkerList([]);
    this.props.history.goBack();
  }

  onLocationSetClick(e) {
    this.props.setGPSInfo({lat:null, lng:null});
    //this.props.history.goBack();
  }

  render() {
    var marker = this.state.marker
    console.log('in SearchPicupMap render!');
    console.log(marker);
    console.log(this.state);
    console.log(this.props);
    var lat = this.props.gps.lat;
    var lng = this.props.gps.lng;

    //if (this.state.lat) {
    if (lat && lng) {
      console.log('in If!!!!');
      //var lat = this.state.lat;
      //var lng = this.state.lng;

      const GoogleMapExample = withGoogleMap(props => (
        <GoogleMap
          defaultCenter = { { lat: lat, lng: lng } }
          defaultZoom = { 13 }
          options={{streetViewControl: false, mapTypeControl: false}}
        >
          {this.renderMarker(this.props.markerList)}
        </GoogleMap>
      ));

      // const { errors } = this.state;
      return(
        <div className='SearchPicupMap'>
          <input
            type="text"
            placeholder="태그"
            className="tagSearch"
            name="tag"
            
            onChange={ this.handleInputChange.bind(this) }
            value={ this.state.tag }
          />
          <button className="btn btn-default" onClick={this.handleButtonClick.bind(this)}>확인</button>
          <br/>
          <div align='center'>
          <GoogleMapExample
            containerElement={ <div style={{ height: '600px', width: '100%' }} /> }
            mapElement={ <div style={{ height: `100%` }} /> }
          />
          <button className='btn btn-default' onClick={this.onLocationSetClick.bind(this)}>위치설정</button>
          <button className='btn btn-default' onClick={this.onClick.bind(this)}>돌아가기</button>
          </div>
        </div>
      )
    }
    else {
      const GoogleMapExample = withGoogleMap(props => (
        <GoogleMap
          defaultCenter = { { lat: 37.212848, lng: 127.733154 } }
          defaultOptions={{mapTypeControl: false}}
          options={{streetViewControl: false, mapTypeControl: false}}
          defaultZoom = { 6 }
          onClick={(e) => this.handleMapClick(e)}
        >
          {this.renderMarker(this.props.markerList)}
        </GoogleMap>
      ));

      return (
        <div className='SearchPicupMap'>
          <div align='center'>
            <span className='locationSpan'>위치를 정해주세요!</span>
            <GoogleMapExample
              containerElement={ <div style={{ height: '600px', width: '100%' }} /> }
              mapElement={ <div style={{ height: `100%` }} /> }
            />
            <button className='btn btn-default' onClick={this.onClick.bind(this)}>돌아가기</button>
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  board: state.board,
  markerList: state.map.markerList,
  gps: state.map.gps
})

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
  setPostID: (postID) => dispatch(setPostID(postID)),
  getBoardID: (boardID) => dispatch(getBoardID(boardID)),
  setMarkerList: (markerList) => dispatch(setMarkerList(markerList)),
  setGPSInfo: (gps) => dispatch(setGPSInfo(gps))
})


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchPicupMap))
