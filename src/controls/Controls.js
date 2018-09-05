import React, { Component } from 'react';
import classNames from 'classnames';
import { IconButton } from '../util';

class Controls extends Component {

    constructor() {
        super();

        this.onRandomizeAll = this.onRandomizeAll.bind(this);
        this.onRandomizeLayers = this.onRandomizeLayers.bind(this);
        this.onFileDownload = this.onFileDownload.bind(this);
    }

    onRandomizeAll(e) {
        this.props.onRandomizeAll();
    }

    onRandomizeLayers(e) {
        this.props.onRandomizeLayers();
    }

    onFileDownload(e) {
        this.props.onFileDownload();
    }

    render() {
        return (
            <div id="controls" className={classNames({'sidebar-active': this.props.sidebarActive})}>
                <div className="controls-inner">
                    <IconButton icon="random-all" size="large" onClick={this.onRandomizeAll} title="Randomize composition &amp; colors"/>
                    <IconButton icon="random-canvas" size="large" onClick={this.onRandomizeLayers} title="Randomize composition only"/>
                    <IconButton icon="download" size="large" onClick={this.onFileDownload} title="Download image"/>
                </div>
            </div>
        )
    }
}

export default Controls;