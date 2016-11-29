import React, { PureComponent as Component, PropTypes } from 'react'
import { Loader } from '.'

export default class Button extends Component {
    render() {
        const { children, onClick, disabled, className } = this.props
        const buttonProps = {
            className,
            disabled
        }

        if (!disabled) {
            buttonProps.onClick = onClick
        }

        return (
            <button
                type="button"
                {...buttonProps}
            >
                {children}
            </button>
        )
    }
}

Button.defaultProps = {
    className: '',
    disabled: false
}

Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    children: PropTypes.any
}
