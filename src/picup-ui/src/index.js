import React from 'react';
import ReactDOM from 'react-dom';

import {Route} from 'react-router'
import {BrowserRouter} from 'react-router-dom'

import './index.css';
//import App from './App';
import Home from './routes/Home';
import MemberForm from './routes/MemberForm';

import registerServiceWorker from './registerServiceWorker';

//ReactDOM.render(<App />, document.getElementById('root'));
//ReactDOM.render(<Home />, document.getElementById('root'));
ReactDOM.render(
  <BrowserRouter>
    <div>
      <Route exact path="/" component={Home}></Route>
      <Route exact path="/member/new" component={MemberForm}></Route>
    </div>
  </BrowserRouter>,
  document.getElementById('root')  
);

registerServiceWorker();
