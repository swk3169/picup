var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// mongodb는 기본적으로 _id라는 primary key가 생성된다.
var boardSchema = mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId, // default로 존재
  boardName:{
    type:String,
    required:[true,'Board name is required!'],
    match:[/^.{2,45}$/,'Should be 2-45 characters!'],
    trim:true
    //unique:true
  },
  boardKind:{  // 0: 공개 그룹 게시판, 1: 비공개 그룹 게시판, 2: 개인 게시판
    type:Number,
    required:[true,'Board kind is required!'],
  },
  managerID: {
    type:Schema.Types.ObjectId,
    ref:'member',
    required:[true,'Manager ID is required!'],
    trim:true,
  },
  canImmediateWrite: {
    type:Boolean,
    default:false,
  },
  totalVisitor: {
    type:Number,
    default:0,
  },
  totalLike: {
    type:Number,
    default:0,
  },
  boardProfile: {
    type:String,
    required:[true, 'Board Profile is required!'],
  },

  /*member_list: [{  3(3byte) * 45(45글자) * 500000(50만회원) = 67500000 > 16777216(16MB) ==> mongodb는 document당 16MB까지 저장할 수 있음.
    member_id: {
      type:String,
      ref:'Member'
    }, 
    write_auth: {
      type:Boolean,
      default:false
    }
  }] // 회원 목록*/

}, {
  toObject:{virtuals:true} // virtual 필드를 추가할 수 있음
});

var Board = mongoose.model('board', boardSchema);

module.exports = Board;

