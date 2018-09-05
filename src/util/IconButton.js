import React from 'react';
import classNames from 'classnames';
import Icon from './Icon.js';

const IconButton = props => (
    <button
        disabled={props.disabled}
        className={classNames(`button-${props.size || 'small'}`, props.className)}
        onClick={props.onClick}
        value={props.value}
        title={props.title}
    >
        <Icon name={props.icon} size={props.size || 'small'} />
    </button>
)

export default IconButton;