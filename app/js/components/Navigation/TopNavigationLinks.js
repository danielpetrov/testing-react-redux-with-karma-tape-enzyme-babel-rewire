import React, { PureComponent as Component, PropTypes } from 'react'
import { NavigationLink } from '.'
import getLink from '../../utils/getLink'

export default class TopNavigationLinks extends Component {
    render() {
        const { currentPathname } = this.props

        return (
            <ul className="nav navbar-nav top-nav">
                <NavigationLink
                    isActive={currentPathname.startsWith(getLink('todos'))}
                    linkTo={getLink('todos')}
                    title={'Todos'}
                />
            </ul>
        )
    }
}

TopNavigationLinks.propTypes = {
    currentPathname: PropTypes.string.isRequired
}
