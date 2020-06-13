import PropTypes from 'prop-types';
import React, { Component } from 'react';

import '../css/Home.css';

class Board extends Component {

  componentDidMount() {
    this.props.getBoardID();
  }

  renderPosts(posts) {
    return posts.map((post) => {
      return (
        <li className="list-group-item" key={post._id}>
          <a style={{color:'black'}} to={"posts/" + post._id}>
            <h3 className="list-group-item-heading">{post.title}</h3>
          </a>
            {/* {this.renderCategories(post.categories)} */}
        </li>
      );
    });
  }

  renderBoardInfo() {
    let info = (
      <div>
        <img className="profileImg" src={this.props.boardInfo.imgStr}/>
        <a>{this.props.boardInfo.data.boardName}</a>
      </div>
    );
    return (info);
  }


  render(){
    return (
        <div className="body">
          { this.renderBoardInfo() }
        </div>
      );
    }
}


export default Board;
