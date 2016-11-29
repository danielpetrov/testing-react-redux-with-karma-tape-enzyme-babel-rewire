import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class HomePageContainer extends Component {
    render() {
        return (
            <div>THIS IS HOME</div>
        )
    }
}

export default connect(
    state => ({
    }),
    dispatch => bindActionCreators({
    }, dispatch)
)(HomePageContainer)
