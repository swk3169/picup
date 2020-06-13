var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//  schema : require 에 true 대신 배열이 들어갔습니다. 첫번째는 true/false 값이고, 두번째는 에러메세지입니다.
//  그냥 true/false을 넣을 경우 기본 에러메세지가 나오고, 배열을 사용해서 custom(사용자정의) 에러메세지를 만들 수 있습니다.
var memberSchema = mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId, // default로 존재
  memberID:{
    type:String,
    required:[true,'Member_id is required!'], 
    trim:true,
    unique:true
  },
  memberName:{
    type:String,
    required:[true,'Name is required!'],
    match:[/^.{2,45}$/,'Should be 2-45 characters!'],
    trim:true,
    //unique:true
  },
  email:{
    type:String,
    required:[true,'Email is required!'],
    match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'Should be a vaild email address!'],
    trim:true
  },
  account: {
    type:String,
    required:false,
    match:[/^.{10,45}$/,'Should be 4-45 characters!'],
    trim:true,
  },
  isManager: {
    type:Boolean,
    default:false,
  },
  gender: {
    type:Number,
    required:[true, 'Gender is required!'],
  },
  birth: {
    type:Date,
    required:[true, 'Birth is required!'],
  },
  memberProfile: {
    type:Buffer,
    required:[true, 'Profile is required!'],
  },
  privateBoard: {
    type: Schema.Types.ObjectId,
    ref:'board'
  }
  //board_list: [mongoose.Schema.Types.ObjectId],
}, {
  toObject:{virtuals:true} // virtual 필드를 추가할 수 있음
});

// virtual: document(row)에는 없지만 객체에는 있는 가상의 필드를 만들어줍니다.
//userSchema.virtual('passwordConfirmation')
//.get(function(){ return this._passwordConfirmation; })
//.set(function(value){ this._passwordConfirmation=value; });

// password validation
// DB에 정보를 생성, 수정하기 전에 mongoose가 값이 유효(valid)한지 확인(validate)을 하게 되는데 password항목에 custom(사용자정의) validation 함수를 지정할 수 있습니다.
// virtual들은 직접 validation이 안되기 때문에(DB에 값을 저장하지 않으니까 어찌보면 당연합니다) password에서 값을 확인하도록 했습니다.
// validation callback 함수 속에서 this는 user model입니다.
/* 
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
var passwordRegexErrorMessage = 'Should be minimum 8 characters of alphabet and number combination!';
userSchema.path('password').validate(function(v) {
  var user = this;

  // create user
  // model.isNew 항목이 true이면 새로 생긴 model(DB에 한번도 기록되지 않았던 model) 즉, 새로 생성되는 user
  // 회원가입의 경우 password confirmation값이 없는 경우, password와 password confirmation값이 다른 경우에 유효하지않음처리(invalidate)
  if(user.isNew){
    if(!user.passwordConfirmation){
      user.invalidate('passwordConfirmation', 'Password Confirmation is required!');
    }
    if(!passwordRegex.test(user.password)){
      user.invalidate('password', passwordRegexErrorMessage);
    } else if(user.password !== user.passwordConfirmation) {
      user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
    }
  }

  // update user
  // 값이 false이면 DB에서 읽어 온 model 즉, 회원정보를 수정하는 경우
  // 회원정보 수정의 경우 current password값이 없는 경우, current password값이 original password랑 다른 경우, new password 와 password confirmation값이 다른 경우 invalidate
  // 회원정보 수정시에는 항상 비밀번호를 수정하는 것은 아니기 때문에 new password와 password confirmation값이 없어도 에러는 아닙니다.
  if(!user.isNew){
    if(!user.currentPassword){
      user.invalidate('currentPassword', 'Current Password is required!');
    }
    if(user.currentPassword && !bcrypt.compareSync(user.currentPassword, user.originalPassword)){ // original password와 current password가 맞는지 비교
      user.invalidate('currentPassword', 'Current Password is invalid!');
    }
    if(user.newPassword && !passwordRegex.test(user.newPassword)){ // user의 새로운 비밀번호가 있을 경우 정규식을 만족하는지 확인한다.
      user.invalidate('newPassword', passwordRegexErrorMessage);
    } else if(user.newPassword !== user.passwordConfirmation) {
      user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
    }
  }
});
*/

// hash password
// 저장하기 전 호출되는 함수
/* 
memberSchema.pre('save', function (next){
  var user = this;
  if(!user.isModified('password')){
    return next();
  } else {
    user.password = bcrypt.hashSync(user.password);
    return next();
  }
});
*/

// model methods
// 인증 메소드
/* 
memberSchema.methods.authenticate = function (password) {
  var user = this;
  return bcrypt.compareSync(password,user.password);
};
*/

// model & export
// 몽구스는 model의 첫 번째 인자로 컬렉션(테이블) 이름을 만듭니다. User이면 소문자화 후 복수형으로 바꿔서 users 컬렉션이 됩니다.

var Member = mongoose.model('member',memberSchema);

module.exports = Member;
//module.exports = mongoose.model('member',memberSchema);
