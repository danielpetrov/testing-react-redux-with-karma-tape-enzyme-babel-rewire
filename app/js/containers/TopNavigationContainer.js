import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import getLink from '../utils/getLink'
import { routingPathnameSelector } from '../reducers'
import { TopNavigationLinks } from '../components/Navigation'

class TopNavigationContainer extends Component {
    render() {
        const { currentPathname } = this.props

        return (
            <header>
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <Link to={getLink('home')} className="navbar-brand">
                                <span>Home</span>
                            </Link>
                        </div>
                        <TopNavigationLinks {...{ currentPathname }} />
                    </div>
                </nav>
            </header>
        )
    }
}

TopNavigationContainer.propTypes = {
    currentPathname: PropTypes.string
}

export default connect(
    state => ({
        currentPathname: routingPathnameSelector(state)
    }),
    dispatch => bindActionCreators({
    }, dispatch)
)(TopNavigationContainer)
