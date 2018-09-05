/* eslint import/no-webpack-loader-syntax: off */
import React from 'react';
import '!svg-sprite-loader!../img/add.svg';
import '!svg-sprite-loader!../img/close.svg';
import '!svg-sprite-loader!../img/download.svg';
import '!svg-sprite-loader!../img/menu.svg';
import '!svg-sprite-loader!../img/random-all.svg';
import '!svg-sprite-loader!../img/random-all.svg';
import '!svg-sprite-loader!../img/random-canvas.svg';
import '!svg-sprite-loader!../img/refresh.svg';
import '!svg-sprite-loader!../img/rotate.svg';
import '!svg-sprite-loader!../img/subtract.svg';

const Icon = (props) => (
    <svg className={`icon-${props.name}`}>
        <use xlinkHref={`#${props.name}`} />
    </svg>
)

export default Icon
