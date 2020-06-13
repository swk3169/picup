import { SET_MARKER_LIST, SET_GPS_INFO } from '../actions/types';
import isEmpty from '../validation/is-empty';

const initialState = {
    markerList : [],
    gps: {lat:null, lng:null}
}

export default function(state = initialState, action ) {
    console.log('In member Reducer');
    switch(action.type) {
      case SET_MARKER_LIST:
        //console.log(action.payload);
        return {
          ...state,
          markerList: action.payload
        };

      case SET_GPS_INFO:
        return {
          ...state,
          gps:action.payload
        };

      default:
        return state;
    }
}
