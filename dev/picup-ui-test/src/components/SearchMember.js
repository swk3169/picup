import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from '../css/SearchMember.css';

const keyCodeEnter = 13;

class SearchMember extends Component {

    componentDidMount() {
        this.props.getMemberName();
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
                    value={this.state.name}
                    onChange={this.handleChange.bind(this)}
                    onKeyDown={this.handleSubmit.bind(this)}
                />
            </div>
        );
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            name: this.props.name || '',
        };
    }

    handleChange(e) {
        this.setState({ name: e.target.value });
    }

    handleSubmit(e) {
        if (e.which === keyCodeEnter) {
            console.log("getMemberNameSubmit")
            const name = e.target.value.trim();
            this.props.getMemberName(name);
            this.setState({ name: '' });
        }
    }
}

SearchMember.propTypes = {
    getMemberName: PropTypes.func.isRequired
}

export default SearchMember;