var mongoose = require('mongoose');
var fs = require('fs');
var Schema = mongoose.Schema;

// mongodb는 기본적으로 _id라는 primary key가 생성된다.
// 1 : Squalions, 자식이 부모의 id를 가짐
var postSchema = mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId, // default로 존재
  postedBoardID: {
    type:Schema.Types.ObjectId,
    ref:'board',
    required:[true,'Board ID is required!'],
  },
  postWriterID: {
    type:Schema.Types.ObjectId,
    ref:'member',
    required:[true,'Writer ID is required!'],
  },
  postContents: {
    type:String,
    default:false,
  },
  postTime: {
    type:Date,
    default:new Date(),
  },
  numOfLike: {
    type:Number,
    default:0,
  },
  numOfVisitor: {
    type:Number,
    default:0,
  },
  visibility: {  // 전체 공개:0, 친구 공개:1, 혼자 보기:2
    type:Number,
    default:0,
  },
  geo: {
    type: [Number],
    index: '2d',
    default: null
  },
  //tag_list: [mongoose.Schema.Types.ObjectId],
  tagList: [String], // 태그 목록, N:N => 1:N, 코드가 복잡해져서 1:N으로 바꿈. 특히 objectID를 저장한다고 했을때 tag_name을 일일히 불러와야함
  pictureList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'picture' }], // 사진 목록, 1:N
  commentList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }], // 댓글 목록, 1:N
  videoLinkList: [String],
}, {
  toObject:{virtuals:true} // virtual 필드를 추가할 수 있음
});

postSchema.pre('remove', function(next) {
  pictureList = [];
  console.log('pre remove');
  for (var i = 0; i < this.pictureList.length; ++i) {
    pictureList.push(this.pictureList[i]);
  }

  for (var i = 0; i < pictureList.length; ++i) {
    console.log('pictureID: ' + pictureList[i]);
    this.model('picture').findById(pictureList[i])
    .then( picture => {
      
      fs.unlink("upload/" + picture.picture, (err) => {
        if (err) console.log(err);
        else console.log('file deleted!');
      });
      fs.unlink("upload/" + picture.thumbnail, (err) => {
        if (err) console.log(err);
        else console.log('file deleted!');
      });

      picture.delete(function(err, picture) {
        if (err) console.log(err);
        else console.log('picture document deleted!');
      });
    })
    .catch( err => {
      console.log(err);
    });
  }
  
  for (var i = 0; i < this.videoLinkList.length; ++i) {
    fs.unlink("upload/" + this.videoLinkList[i], (err) => {
      if (err) console.log(err);
      else console.log('file deleted!');
    });
  }


  for (var i = 0; i < this.commentList.length; ++i) {
    this.model('comment').findOneAndDelete({_id:this.commentList[i]})
    .then( comment => {
      console.log(comment);
    })
    .catch( err => {
      console.log(err);
    });
  }
  
  next();
});

var Post = mongoose.model('post', postSchema);

module.exports = Post;

