import React, { Component } from 'react';
import { RoundRobin } from '../helpers';
import { ColorState } from '../state';
import BackgroundLayer from './BackgroundLayer.js';
import StripeLayer from './StripeLayer.js';
import TextLayer from './TextLayer.js';

class Display extends Component {

    constructor() {
        super();
        this.renderCtx = this.renderCtx.bind(this);
    }

    renderCtx(callback) {
        const ctx = this.refs.canvas.getContext('2d');
        callback(ctx);
    }

    componentDidUpdate() {
        // mobile Safari doesn't want to remove the event listener when we update
        // the "onClick" in the DOM, so attach/detach it this way:
        if (this.props.sidebarActive && this.props.dimensions.isMobile) {
            this.refs.canvas.addEventListener('click', this.props.onCloseSidebar);
        } else {
            this.refs.canvas.removeEventListener('click', this.props.onCloseSidebar);
        }
    }

    render() {
        const colors = new RoundRobin(this.props.colors.map((color) => {
            return ColorState.toHexCode(color, this.props.scaleS, this.props.scaleL);
        }));

        const displayMetrics = (this.props.sidebarActive && !this.props.dimensions.isMobile) ?
                this.props.dimensions.displayWithSidebar : this.props.dimensions.display;

        return (
            <div id="display">
                <canvas
                    id="canvas" 
                    ref="canvas"
                    width={this.props.dimensions.canvasWidth} 
                    height={this.props.dimensions.canvasHeight}
                    style={{
                        width: displayMetrics.width,
                        height: displayMetrics.height
                    }}
                />
                <BackgroundLayer
                    color={colors.next()}
                    canvasWidth={this.props.dimensions.canvasWidth}
                    canvasHeight={this.props.dimensions.canvasHeight}
                    renderCtx={this.renderCtx}
                />
                { this.props.stripes.map((stripe, i) => {
                    return (
                        <StripeLayer
                            key={i}
                            {...stripe}
                            color={colors.next()}
                            canvasWidth={this.props.dimensions.canvasWidth}
                            canvasHeight={this.props.dimensions.canvasHeight}
                            renderCtx={this.renderCtx}
                        />
                    )
                })}
                { this.props.text.map((text, i) => {
                    return (
                        <TextLayer
                            key={i}
                            {...text}
                            color={colors.next()}
                            canvasWidth={this.props.dimensions.canvasWidth}
                            canvasHeight={this.props.dimensions.canvasHeight}
                            renderCtx={this.renderCtx}
                        />
                    )
                })}
            </div>
        );
    }

}

export default Display;