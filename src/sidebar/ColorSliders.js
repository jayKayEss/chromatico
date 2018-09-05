import React from 'react';

const ColorSliders = props => (
    <div className="sliders panel">
        <div className="item">
            <label htmlFor="scaleS">
                <button className="link" onClick={props.onChangeSaturation} value="0" title="Reset saturation">Saturation</button>
            </label>
            <input name="scaleS" type="range" min="-1" max="1" step="0.01" value={props.scaleS} onChange={props.onChangeSaturation} title="Change saturation range"/>
        </div>
        <div className="item">
            <label htmlFor="scaleL">
                <button className="link" onClick={props.onChangeLuminance} value="0" title="Reset luminance">Luminance</button>
            </label>
            <input name="scaleL" type="range" min="-1" max="1" step="0.01" value={props.scaleL} onChange={props.onChangeLuminance} title="Change luminance range"/>
        </div>
    </div>
);

export default ColorSliders;