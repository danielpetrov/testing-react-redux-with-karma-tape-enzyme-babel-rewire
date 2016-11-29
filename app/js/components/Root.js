import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRedirect, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from '../store/createStore'
import { App, TodosContainer, HomePageContainer } from '../containers'
import getLink from '../utils/getLink'

export const configureStoreWithBrowserHistory = () => {
    const store = configureStore()

    syncHistoryWithStore(browserHistory, store)

    return store
}

const defaultStore = configureStoreWithBrowserHistory()

export const createRoot = (store = defaultStore, name = 'Root') => {
    class Root extends Component {
        render() {
            return (
                <Provider store={store}>
                    <Router history={browserHistory}>
                        <Route path={getLink('')} component={App}>
                            <IndexRedirect to={getLink('home')} />
                            <Route path={getLink('home')} component={HomePageContainer} />
                            <Route path={getLink('todos')} component={TodosContainer} />
                        </Route>
                    </Router>
                </Provider>
            )
        }
    }

    Root.displayName = name

    return Root
}
