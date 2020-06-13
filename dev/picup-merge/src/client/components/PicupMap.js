// 게시물 위치 설정 페이지

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPostList} from '../actions/board';

import classnames from 'classnames';

import '../css/PicupMap.scss';

import isEmpty from '../validation/is-empty';
import axios from 'axios'
import isSuccessed from '../validation/is-successed';
import util from '../common/utils';

import { GoogleMap, Marker, withGoogleMap } from "react-google-maps";

import { withRouter } from 'react-router-dom';

class PicupMap extends Component {

  // lat: 37.212848, lng: 127.733154
  constructor() {
    super();

    this.state = {
      marker:null,
      lat:37.212848,
      lng:127.733154
    }
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
        this.setState({
          lat:position.coords.latitude,
          lng:position.coords.longitude
        })
      }, () => {
        reject (new Error('Permission denied'));
      });
    })
   .catch(err => {
    }); 
  }

  componentDidUpdate(prevProps, prevState) { // props를 받아온 후 이전 props와 다를 경우 getBoardInfo를 통해 게시판 정보를 받아옴
    //console.log('in BoardInfo Component Did Update')
    //console.log(this.props.boardID);
    console.log(this.state);
  }
  
  handleMapClick(e) {
    var lat = e.latLng.lat();
    var lng = e.latLng.lng();
    console.log(lat)
    console.log(lng)

    this.setState({
      lat: lat,
      lng: lng,
      marker : {position: {
        lat:lat,
        lng:lng
      }
    }});
  }

  handleButtonClick(e) {
    var token = localStorage.getItem('token');

    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };

    /*
    var body = {
      postLocation: {
        isExisted: true,
        lat: this.state.lat,
        long: this.state.lng
      }
    };
    */

    var body = {
      geo: [this.state.lat, this.state.lng]
    };


    console.log(body);

    axios.put('/api/board/' + this.props.board.boardID + '/post/' + this.props.board.postID, body, config)
    .then( (result) => {
      console.log(result.data);
      if (result.data.success) {
        this.props.history.goBack();
      }
    });
  }

  onClick(e) {
    this.props.history.goBack();
  }

  render() {
    var marker = this.state.marker
    console.log(marker);

    if (this.state.lat) {
      var lat = this.state.lat;
      var lng = this.state.lng;

      const GoogleMapExample = withGoogleMap(props => (
        <GoogleMap
          defaultCenter = { { lat: lat, lng: lng } }
          defaultZoom = { 13 }
          defaultOptions={{mapTypeControl: false}}
          options={{streetViewControl: false, mapTypeControl: false}}
          onClick={(e) => this.handleMapClick(e)}
        >
          <Marker {
            ...marker
          }/>
        </GoogleMap>
      ));

      // const { errors } = this.state;
      return(
        <div className='PicupMap'>
          <div align='center'>
          <GoogleMapExample
            containerElement={ <div style={{ height: '600px', width: '100%' }} /> }
            mapElement={ <div style={{ height: `100%` }} /> }
          />
          <button className='btn btn-default' onClick={this.onClick.bind(this)}>돌아가기</button>
          <button className="btn btn-default" onClick={this.handleButtonClick.bind(this)}>확인</button>
          </div>
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

export default connect(mapStateToProps)(withRouter(PicupMap))
