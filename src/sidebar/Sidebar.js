/* eslint import/no-webpack-loader-syntax: off */
import React, { Component } from 'react';
import classNames from 'classnames';
import { IconButton } from '../util';
import ColorList from './ColorList';
import ColorButtons from './ColorButtons.js';
import ColorSliders from './ColorSliders.js';
import './Sidebar.css';
import '!svg-sprite-loader!../img/logo.svg';

class Sidebar extends Component {

    constructor() {
        super();

        this.onChangeColor = this.onChangeColor.bind(this);
        this.onChangeSaturation = this.onChangeSaturation.bind(this);
        this.onChangeLuminance = this.onChangeLuminance.bind(this);
    }

    onChangeColor(e) {
        this.props.onChangeColor(e.currentTarget.value);
    }

    onChangeSaturation(e) {
        this.props.onChangeSaturation(e.currentTarget.value);
    }

    onChangeLuminance(e) {
        this.props.onChangeLuminance(e.currentTarget.value);
    }

    render() {
        return (
            <div id="sidebar" className={classNames({ 'sidebar-active': this.props.sidebarActive })}>
                <div className="header">
                    <IconButton icon="close" size="small" onClick={this.props.onToggleSidebar} title="Close menu"/>
                    <div className="svg-wrapper">
                        <svg className="svg-logo">
                            <use xlinkHref="#logo" />
                        </svg>
                    </div>
                </div>
                <ColorList
                    {...this.props}
                    onChangeColor={this.onChangeColor}
                />
                <ColorButtons
                    {...this.props}
                />
                <ColorSliders
                    {...this.props}
                    onChangeSaturation={this.onChangeSaturation}
                    onChangeLuminance={this.onChangeLuminance}
                />
                <div className="buffer">&nbsp;</div>
            </div>
        );
    }
}

export default Sidebar;