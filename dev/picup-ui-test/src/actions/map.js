import { SET_MARKER_LIST } from './types';
import { SET_GPS_INFO } from './types';

export const setMarkerList = (markerList) => {
  console.log('In Action getMyBoardID');
  return {
    type: SET_MARKER_LIST,
    payload: markerList
  }
}

export const setGPSInfo = (gps) => {
  return {
    type: SET_GPS_INFO,
    payload:gps
  }
}