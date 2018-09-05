import React from 'react';
import { IconButton } from '../util';

const ColorButtons = props => (
    <div className="buttons panel">
        <IconButton icon="subtract" size="small" onClick={props.onRemoveColor} disabled={props.colors.length <= 2} title="Fewer colors"/>
        <IconButton icon="add" size="small" onClick={props.onAddColor} disabled={props.colors.length >= 5} title="More colors"/>
        <IconButton icon="refresh" size="small" onClick={props.onRefreshColors} title="Randomize all colors"/>
        <IconButton icon="rotate" size="small" onClick={props.onRotateColors} title="Rotate colors"/>
    </div>
);

export default ColorButtons;