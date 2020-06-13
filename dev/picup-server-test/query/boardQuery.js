var Board = require('../models/Board');
//var ObjectId = require('mongodb').ObjectId; 

var boardQuery = {};

boardQuery.getBoard = async function(boardID) {
  var board = await (Board.findById(boardID)
  .then((board) => {
    return board;
  })
  .catch ( (err) => {
    return null; 
  }));

  return board;
}

module.exports = boardQuery;