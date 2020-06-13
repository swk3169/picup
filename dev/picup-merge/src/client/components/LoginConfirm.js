// 그룹 생성 페이지

import React, { Component } from 'react';
import '../css/LoginConfirm.scss';

import btn from '../css/Button.scss';

class LoginConfirm extends Component {

  constructor() {
    super();

    this.state = {
        check: false,
    }
    this.toggleCheckBox = this.toggleCheckBox.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  toggleCheckBox(e) {
    //console.log(e.target.checked);
    //console.log(e.target.name);

    this.setState({
        check: !this.state.check
    });
  }
  
  handleSubmit(e) {
    e.preventDefault();

    if (this.state.check) {
      this.props.history.push('/member/new');
    }
  }


  render() {
    return(
    <div className="LoginConfirm">
        <div className="form-group" align='center'>
          <textarea
              disabled
              rows="5"
              cols="50"
              placeholder="contents"
              className="contents"
              name="contents"
              resize="none"
              value="1. 개인정보의 처리 목적 ('https://picup.co.kr'이하 'Picup')은(는) 개인정보를 다음의 목적을 위해 처리합니다. 처리한 개인정보는 다음의 목적이외의 용도로는 사용되지 않으며 이용 목적이 변경될 시에는 사전동의를 구할 예정입니다.&#13;&#10;
              가. 홈페이지 회원가입 및 관리&#13;&#10;
              회원 가입의사 확인 등을 목적으로 개인정보를 처리합니다.&#13;&#13;&#10;&#13;&#10;
              
              나. 마케팅 및 광고에의 활용&#13;&#10;
              신규 서비스(제품) 개발 및 맞춤 서비스 제공 등을 목적으로 개인정보를 처리합니다.&#13;&#13;&#10;&#13;&#10;
              &#13;&#10;
              2. 개인정보 항목&#13;&#10;
              - 개인정보 항목 : 이메일, 성별, 생년월일, 이름&#13;&#10;
              - 수집방법 : 홈페이지&#13;&#10;
              - 보유근거 : 서비스 제공&#13;&#10;
              - 보유기간 : 탈퇴시 3개월 이내 파기&#13;&#13;&#10;&#13;&#10;
              &#13;&#10;
              3. 개인정보의 처리 및 보유 기간&#13;&#13;&#10;&#13;&#10;
              &#13;&#10;
              ① ('Picup')은(는) 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의 받은 개인정보 보유,이용기간 내에서 개인정보를 처리,보유합니다.&#13;&#13;&#10;&#13;&#10;
              &#13;&#10;
              ② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.&#13;&#10;
              가. 홈페이지 회원가입 및 관리&#13;&#10;
              <홈페이지 회원가입 및 관리>와 관련한 개인정보는 수집.이용에 관한 동의일로부터<탈퇴시 3개월 이내 파기>까지 위 이용목적을 위하여 보유.이용됩니다.&#13;&#10;
              -보유근거 : 서비스 제공&#13;&#10;"
            />
        </div>
        <div className="form-group" align='center'>
          <input
            type="checkbox"
            placeholder="글쓰기여부"
            className="canImmediateWrite"
            name="canImmediateWrite"
            onChange={ this.toggleCheckBox }
            checked={ this.state.check }
          /><span className='MyGroupSpan'>개인정보제공동의 확인</span>
        </div>
        <div><button className="btn btn-default" onClick={this.handleSubmit}>확인</button></div>
    </div>
    )
  }
}

export default LoginConfirm;
