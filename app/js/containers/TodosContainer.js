import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class AllocationsPageContainer extends Component {
    render() {
        return (
            <div>Hello world!</div>
        )
    }
}

AllocationsPageContainer.propTypes = {
}

export default connect(
    state => ({
    }),
    dispatch => bindActionCreators({
    }, dispatch)
)(AllocationsPageContainer)
