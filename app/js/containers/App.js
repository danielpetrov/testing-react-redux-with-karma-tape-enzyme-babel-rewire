import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { TopNavigationContainer } from '.'

class App extends Component {
    render() {
        const { children } = this.props

        return (
            <div>
                <TopNavigationContainer />
                <div className="main-app">
                    <div className="row">
                        <main className="col-sm-12">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

App.propTypes = {
    children: PropTypes.object
}

export default connect(
    state => ({
    }),
    dispatch => bindActionCreators({
    }, dispatch)
)(App)
