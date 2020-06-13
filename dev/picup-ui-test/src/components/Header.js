// Picup 헤더 컴포넌트

import React, { Component } from 'react';

import '../css/Header.css';
import './buttons/LogoutImgButton';
import LogoutImgButton from './buttons/LogoutImgButton';

class Header extends Component {
  render() {
    return (
            <div className="Header">
              <div>
                <div className="Title" align='left'><span>Picup</span></div>
              </div>
            </div>
    );
  }
}

export default Header;
