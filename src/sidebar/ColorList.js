import React from 'react';
import classNames from 'classnames';
import { ColorState } from '../state';
import { IconButton } from '../util';

const ColorList = props => (
    <ul className="color-list panel">
    {props.colors.map((color, i) => (
        <li
            key={i} 
            className={classNames({light: ColorState.isLight(color, props.scaleS, props.scaleL)})} 
            style={{background: ColorState.toHexCode(color, props.scaleS, props.scaleL)}}
        >
            <IconButton
                className={classNames({light: ColorState.isLight(color, props.scaleS, props.scaleL)})}
                onClick={props.onChangeColor}
                value={i}
                title="Randomize color"
                size="small"
                icon="refresh"
            />
            <div
                className="color-text"
            >
                { ColorState.toHexCode(color, props.scaleS, props.scaleL) }<br/>
                { ColorState.toHSLString(color, props.scaleS, props.scaleL) }
            </div>
        </li>
    ))}
    </ul>
);

export default ColorList;