// 색상 지도 페이지

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPostList} from '../actions/board';

import '../css/PicupMap.scss';

import classnames from 'classnames';
import '../css/Register.scss';
import isEmpty from '../validation/is-empty';
import axios from 'axios'
import isSuccessed from '../validation/is-successed';
import util from '../common/utils';

import { GoogleMap, Marker, withGoogleMap } from "react-google-maps";
import { default as MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";

import { loginUser, logoutUser, confirmUser } from '../actions/authentication';
import { getBoardID, getBoardInfo } from '../actions/board';

import { setMemberInfo } from '../actions/member';

import BackButton from './buttons/BackButton';

import { withRouter } from 'react-router-dom';
import map from '../img/map.png';
import bone from '../img/bone.jpg';

import 강원도 from '../img/강원도2.png';
import 경기도 from '../img/경기도2.png';
import 경상남도 from '../img/경상남도2.png';
import 경상북도 from '../img/경상북도2.png';
import 광주광역시 from '../img/광주광역시2.png';
import 대구광역시 from '../img/대구광역시2.png';
import 대전광역시 from '../img/대전광역시2.png';
import 부산광역시 from '../img/부산광역시2.png';
import 서울 from '../img/서울2.png';
import 울산광역시 from '../img/울산광역시2.png';
import 인천광역시 from '../img/인천2.png';
import 전라남도 from '../img/전라남도2.png';
import 전라북도 from '../img/전라북도2.png';
import 제주도 from '../img/제주도2.png';
import 충청남도 from '../img/충청남도2.png';
import 충청북도 from '../img/충청북도2.png';
import 평안남도 from '../img/평안남도2.png';
import 평안북도 from '../img/평안북도2.png';
import 함경남도 from '../img/함경남도2.png';
import 함경북도 from '../img/함경북도2.png';
import 황해도 from '../img/황해도2.png';

import BoardInfo from './BoardInfo';

import jimp from 'jimp';

class PicupColorfulMapHome extends Component {  // PostList의 위치를 지도에 마킹하는 컴포넌트

  constructor() {
    super();

    this.state = {
      marker:null,
      thumbnailList:[],
      loadmap:false,
      loadinfo:false,
    }

    this.drawThumbnailList.bind(this);
  }

  componentDidMount() {
    console.log('PicupColorfulMapHome component did mount') // history push를 통해 준 state

    var token = localStorage.getItem('token');
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };

    this.props.loginUser(token);
    this.props.getMyBoardID();
  }

  componentDidUpdate() {
    console.log('Component Did Update!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log(this.props.board.boardInfo);

    if (!this.state.loadmap && this.props.board.boardInfo) { // 맵을 아직 불러오지 않았을 경우
      var token = localStorage.getItem('token');
      var config = {
        headers: {'Authorization': 'Bearer ' + token},
      };

      
      console.log('PicupColorfulMap before axios');
      if (this.props.board.boardInfo) {
        console.log(this.props.board.boardID);
        axios.get('/api/board/' + this.props.board.boardID + '/map', config)
        .then( result => {
          console.log(result.data);
          console.log(result.data.data);
          var tidyThumbnailList = this.transformthumbnailList(result.data.data);
          console.log('tidy result:');
          console.log(tidyThumbnailList);
          this.setState({
            loadmap:true,
            thumbnailList: tidyThumbnailList
          });
          console.log('setState done:');
          console.log('tidy done:');
        })
        .catch( error => {
        })
        
        this.updateCanvas();
      }
    }
  }

  transformthumbnailList(thumbnailList) { // axios로 입력받은 데이터를 출력하기 쉽도록 정리
    console.log('in transform thumbnailList of PicupColorfulMap');
    var tidythumbnailList = []
    
    for (var i = 0; i < thumbnailList.length; ++i) {
      console.log(thumbnailList[i]);
      var postID = thumbnailList[i]._id;
      if (!isEmpty(thumbnailList[i].geo)) {
        console.log('Thumbnail Item');
        console.log(thumbnailList[i])
        var img = util.getResource(thumbnailList[i].pictureList[0].thumbnail);
        //console.log(img);

        //var lat = thumbnailList[i].postLocation.lat;
        //var long = thumbnailList[i].postLocation.long;
        var lat = thumbnailList[i].geo[0];
        var long = thumbnailList[i].geo[1];
        tidythumbnailList.push({
          postID: postID,
          marker: {position : { lat: lat, lng: long }},
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

          tidythumbnailList.push({
            postID: postID,
            marker: {position : { lat: lat, lng: long }},
            img:img
          });
        }
      }
    } // end for i

    return tidythumbnailList;
  }

  drawThumbnailList(thumbnailList) { // 썸네일 목록을 지도에 색상으로 그려준다.
    var sources = {
      bone,
      경기도,
      서울,
      인천광역시,
      강원도,
      경상북도,
      충청북도,
      충청남도,
      대전광역시,
      대구광역시,
      전라북도,
      전라남도,
      광주광역시,
      경상남도,
      울산광역시,
      부산광역시,
      제주도,
    };
    
    var widthDelta = 300 / 1080;
    var heightDelta = 400 / 1620;

    if (this.refs.canvas) {
      var canvas = this.refs.canvas;
      const ctx = this.refs.canvas.getContext('2d');
      
      this.loadImages(sources, async function(images) {
        var thumbnailInRegionList = [];
        for (var i = 0; i < thumbnailList.length; ++i) {
          let thumbnail = thumbnailList[i];
          let marker = thumbnail.marker;
          let lat = marker.position.lat;
          let lng = marker.position.lng;
          let latlng = String(lat) + ',' + String(lng);
          let thumbnailImg = thumbnail.img;
          var startPoint = await(axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng + '&language=ko&key=AIzaSyBZ9i7YDlGSqZHlDDeyy70ddqTLDgYMvOM')
          .then( result => {
            console.log(result.data);
            var region = null;

            try {
              region = util.extractRegion(result.data);
            }
            catch {
              region = util.extractRegion(result.data);
            } 
            console.log(region);
            //this.drawRegion(ctx, region, widthDelta, heightDelta, images);
            var x, y;

            if (region == "경상북도")
            {
              ctx.drawImage(images.경상북도, 515 * widthDelta, 891 * heightDelta, 539 * widthDelta, 330 * heightDelta);
              x = 515 * widthDelta + 30;
              y = 891 * heightDelta + 30;
            }
            else if (region == "경기도")
            {
              ctx.drawImage(images.경기도, 326 * widthDelta, 779 * heightDelta, 176 * widthDelta, 212 * heightDelta);
              x = 326 * widthDelta + 5;
              y = 779 * heightDelta + 5;
            }
            else if (region == "서울특별시") 
            {
              ctx.drawImage(images.서울, 383 * widthDelta, 883 * heightDelta, 43 * widthDelta, 26 * heightDelta);

              x = 383 * widthDelta + 10;
              y = 883 * heightDelta;
            }
            else if (region == "전라북도")
            {
              ctx.drawImage(images.전라북도, 340 * widthDelta, 1136 * heightDelta, 169 * widthDelta, 123 * heightDelta);

              x = 340 * widthDelta + 10;
              y = 1136 * heightDelta + 5;
            }
            else if (region == "전라남도")
            {
              ctx.drawImage(images.전라남도, 291 * widthDelta, 1245 * heightDelta, 196 * widthDelta, 164 * heightDelta);

              x = 291 * widthDelta + 10;
              y = 1245 * heightDelta + 5;
            }
            else if (region == "경상남도")
            {
              ctx.drawImage(images.경상남도, 492 * widthDelta, 1178 * heightDelta, 185 * widthDelta, 133 * heightDelta);

              x = 492 * widthDelta + 10;
              y = 1178 * heightDelta + 5;
            }
            else if (region == "충청북도")
            {
              ctx.drawImage(images.충청북도, 454 * widthDelta, 955 * heightDelta, 143 * widthDelta, 181 * heightDelta);

              x = 454 * widthDelta + 10;
              y = 955 * heightDelta + 5;
            }
            else if (region == "강원도")
            {
              ctx.drawImage(images.강원도, 377 * widthDelta, 659 * heightDelta, 321 * widthDelta, 316 * heightDelta);

              x = 337 * widthDelta + 40;
              y = 659 * heightDelta + 30;
            }
            else if (region == "대구광역시")
            {
              ctx.drawImage(images.대구광역시, 565 * widthDelta, 1150 * heightDelta, 62 * widthDelta, 57 * heightDelta);

              x = 565 * widthDelta + 10;
              y = 1150 * heightDelta + 5;
            }
            else if (region == "부산광역시")
            {
              ctx.drawImage(images.부산광역시, 651 * widthDelta, 1258 * heightDelta, 44 * widthDelta, 39 * heightDelta);

              x = 651 * widthDelta + 5;
              y = 1258 * heightDelta + 5;
            }
            else if (region == "충청남도")
            {
              ctx.drawImage(images.충청남도, 301 * widthDelta, 990 * heightDelta, 172 * widthDelta, 159 * heightDelta);

              x = 301 * widthDelta + 5;
              y = 990 * heightDelta + 5;
            }
            else if (region == "대전광역시")
            {
              ctx.drawImage(images.대전광역시, 429 * widthDelta, 1075 * heightDelta, 39 * widthDelta, 45 * heightDelta);

              x = 429 * widthDelta + 5;
              y = 1075 * heightDelta + 5;
            }
            else if (region == "울산광역시")
            {
              ctx.drawImage(images.울산광역시, 661 * widthDelta, 1198 * heightDelta, 57 * widthDelta, 53 * heightDelta)

              x = 661 * widthDelta + 5;
              y = 1198 * heightDelta + 5;
            }
            else if (region == "광주광역시")
            {
              ctx.drawImage(images.광주광역시, 365 * widthDelta, 1271 * heightDelta, 31 * widthDelta, 22 * heightDelta)

              x = 365 * widthDelta + 5;
              y = 1271 * heightDelta + 5;
            }
            else if (region == "제주특별자치도")
            {
              ctx.drawImage(images.제주도, 292 * widthDelta, 1544 * heightDelta, 89 * widthDelta, 36 * heightDelta)

              x = 292 * widthDelta + 10;
              y = 1544 * heightDelta - 10;
            }
            else if (region == "인천광역시")
            {
              ctx.drawImage(images.인천광역시, 324 * widthDelta, 864 * heightDelta, 53 * widthDelta, 60 * heightDelta)

              x = 324 * widthDelta + 10;
              y = 864 * heightDelta + 10;
            }
            
            var startPoint = {
              x: x,
              y: y
            }
            return startPoint         
          })); // end of axios
          console.log('ㄹㅇㅁㄴㄻㅇㄴㄹㅇㄴㅁ');
          if (startPoint.x != null) {
            var thumbnailInRegion = {
              thumbnail: thumbnailImg,
              startPoint: startPoint
            }
            thumbnailInRegionList.push(thumbnailInRegion);
          }
        }

        console.log('now draw thumbnail list');
        console.log(thumbnailInRegionList);
        for (var i = 0; i < thumbnailInRegionList.length; ++i) {
          let thumbnail = thumbnailInRegionList[i].thumbnail;
          let startPoint = thumbnailInRegionList[i].startPoint;
          let x = startPoint.x;
          let y = startPoint.y;

          let img = new Image;
          img.src = thumbnail;
          
          img.onload = function(){
            ctx.drawImage(img, x, y, 25, 25); // Or at whatever offset you like
          };
          console.log(img);
        }
      });
    } // end if this.refs.canvas
  }
  
  onClick(e) {
    this.props.history.push('/board');
  }

  loadImages(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    // get num of sources
    for(var src in sources) {
      numImages++;
    }
    for(var src in sources) {
      images[src] = new Image();
      images[src].onload = function() {
        if(++loadedImages >= numImages) {
          callback(images);
        }
      };
      images[src].src = sources[src];
    }
  }

  handleMapClick(e) {
    e.preventDefault();

    this.props.history.push('/map')
  }

  updateCanvas() {
    var canvas = this.refs.canvas;
    const ctx = this.refs.canvas.getContext('2d');
    
    var sources = {
      bone,
    };

    var widthDelta = 300 / 1080;
    var heightDelta = 400 / 1620;
    this.loadImages(sources, function(images) {
      ctx.drawImage(images.bone, 0, 0, 300, 400);
    });
  }

  render() {
    //this.drawthumbnailList(this.state.thumbnailList);
    if (this.state.loadmap) {
      this.drawThumbnailList(this.state.thumbnailList);
    }
    // const { errors } = this.state;
    return(
      <div>
        <BoardInfo />
        <div onClick={this.handleMapClick.bind(this)}>
          <canvas ref="canvas" width={300} height={400}/>
        </div>
        <div>
          <button className='btn btn-default' onClick={this.onClick.bind(this)}>글 보기</button>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({  // 객체를 반환
  loginUser: (token) => dispatch(loginUser(token)),
  logoutUser: () => dispatch(logoutUser()),
  getMyBoardID: () => {
    var token = localStorage.token;
    var config = {
      headers: {'Authorization': 'Bearer ' + token},
    };
    axios.get('/api/member/me', config )
    .then((result) => { // axios는 비동기 방식이라서 return 값을 호출한 곳에서 받지 못함
      console.log('in getMyBoardID axios')
      console.log(result.data.data);
      if (result.data.success) {
        const name = result.data.data.memberName;
        const id = result.data.data._id;
        const profile = result.data.data.memberProfile;
        console.log('memberInfo : ');

        console.log(name);
        console.log(profile);
        //console.log(privateBoardID);

        dispatch(getBoardID(id));                   // boardID 업데이트
        dispatch(setMemberInfo(result.data.data));  // 멤버 정보 
        dispatch(getBoardInfo(name, profile, id));
        dispatch(confirmUser(true));
      }
      else {
        dispatch(confirmUser(false));
        dispatch(logoutUser());
      }
    });
    //dispatch(getMyBoardID(conf));
  },
})

const mapStateToProps = (state) => ({
  board: state.board
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PicupColorfulMapHome))
