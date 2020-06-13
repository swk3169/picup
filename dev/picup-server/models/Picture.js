var mongoose = require('mongoose');

// mongodb는 기본적으로 _id라는 primary key가 생성된다.
var pictureSchema = mongoose.Schema({
  /* mongodb schema design 원칙에 따라 1:Many인 경우 자식에서 부모의 Object ID를 가지지 않기 때문에 post_id는 삭제
  post_id: {
    type:mongoose.Schema.Types.ObjectId,
    required:[true,'Post ID is required!'],
  },*/
  // _id: mongoose.Schema.Types.ObjectId, // default로 존재
  picture: {
    type:Buffer,
    required:[true,'Picture is required!'],
  },
  thumnail: {
    type:Buffer,
    required:[true,'Thumnail is required!'],
  },
  pictureLocation: {
    isExisted: {  // picutre의 location 존재 여부
      type:Boolean,
      default:false,
    },
    lat: {
      type:Number,
      default:0,
    },
    long: {
      type:Number,
      default:0,
    },
  },
  address: {
    type:String,
    default:'',
  },
}, {
  toObject:{virtuals:true} // virtual 필드를 추가할 수 있음
});

var Picture = mongoose.model('picture', pictureSchema);

module.exports = Picture;

