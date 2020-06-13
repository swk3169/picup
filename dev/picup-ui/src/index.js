import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import store from './store';
import { createStore } from 'redux';
import { Provider } from 'react-redux';


// 스토어와 컴포넌트 사이의 커뮤니케이션을 준비한다. 루트 컴포넌트는 공급 컴포넌트로 서브 컴포넌트를 감싸고 스토어와 공급 컴포넌트 사이를 연결한다. 
// 공급 컴포넌트는 기본적으로 컴포넌트를 업데이트하기 위한 네트워크를 생성한다. 똑똑한 컴포넌트는 connect()로 네트워크에 연결한다. 이렇게 상태 업데이트를 받을 수 있게 만든다.
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
