import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from '../css/SearchMember.css';

const keyCodeEnter = 13;

class SearchFriend extends Component {

    componentDidMount() {
        this.props.getFriends();
    }

    render() {
        console.log(this.props)
        return (
            <div>
                <input
                    type="text"
                    autoFocus="true"
                    className={classnames('form-control', styles.searchMember)}
                    placeholder="회원검색"
                    value={this.state.id}
                    onChange={this.handleChange.bind(this)}
                    onKeyDown={this.handleSubmit.bind(this)}
                />
            </div>
        );
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            id: this.props.id || '',
        };
    }

    handleChange(e) {
        this.setState({ id: e.target.value });
    }

    handleSubmit(e) {
        if (e.which === keyCodeEnter) {
            console.log("getFriendSubmit")
            const id = e.target.value.trim();
            this.props.getFriends(id);
            this.setState({ id: '' });
        }
    }
}

SearchFriend.propTypes = {
    getFriends: PropTypes.func.isRequired
}

export default SearchFriend;