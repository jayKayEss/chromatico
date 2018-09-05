import React, { Component } from 'react';
import classNames from 'classnames';
import Display from './display';
import Controls from './controls';
import { Sidebar, MenuButton } from './sidebar';
import actions from './actions.js';
import './theme.css';
import './layout.css';

class App extends Component {

    constructor() {
        super();

        this.state = actions.initializeState();
        this.randomizeColors = actions.randomizeColors.bind(this);
        this.randomizeLayers = actions.randomizeLayers.bind(this);
        this.randomizeAll = actions.randomizeAll.bind(this);
        this.onFileDownload = actions.onFileDownload.bind(this);
        this.updateAfterResize = actions.updateAfterResize.bind(this);
        this.onToggleSidebar = actions.onToggleSidebar.bind(this);
        this.onCloseSidebar = actions.onCloseSidebar.bind(this);
        this.onChangeColor = actions.onChangeColor.bind(this);
        this.onAddColor = actions.onAddColor.bind(this);
        this.onRemoveColor = actions.onRemoveColor.bind(this);
        this.onRefreshColors = actions.onRefreshColors.bind(this);
        this.onRotateColors = actions.onRotateColors.bind(this);
        this.onChangeSaturation = actions.onChangeSaturation.bind(this);
        this.onChangeLuminance = actions.onChangeLuminance.bind(this);
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateAfterResize);
        this.randomizeAll();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateAfterResize);
    }

    render() {
        return (
            <div id="app">
                <Sidebar
                    sidebarActive={this.state.sidebar_active}
                    onToggleSidebar={this.onToggleSidebar}
                    colors={this.state.colors}
                    scaleS={this.state.scale_s}
                    scaleL={this.state.scale_l}
                    onChangeColor={this.onChangeColor}
                    onAddColor={this.onAddColor}
                    onRemoveColor={this.onRemoveColor}
                    onRefreshColors={this.onRefreshColors}
                    onRotateColors={this.onRotateColors}
                    onChangeSaturation={this.onChangeSaturation}
                    onChangeLuminance={this.onChangeLuminance}
                />
                <div className={classNames('inner', {'sidebar-active': this.state.sidebar_active})}>
                    <Display
                        sidebarActive={this.state.sidebar_active}
                        onCloseSidebar={this.onCloseSidebar}
                        dimensions={this.state.dimensions}
                        colors={this.state.colors}
                        scaleS={this.state.scale_s}
                        scaleL={this.state.scale_l}
                        layers={this.state.layers}
                        stripes={this.state.stripes}
                        text={this.state.text}
                    />
                    <Controls
                        sidebarActive={this.state.sidebar_active}
                        onRandomizeAll={this.randomizeAll}
                        onRandomizeLayers={this.randomizeLayers}
                        onFileDownload={this.onFileDownload}
                    />
                </div>
                <MenuButton
                    sidebarActive={this.state.sidebar_active}
                    onToggleSidebar={this.onToggleSidebar}
                />
            </div>
        );
    }
}

export default App;
