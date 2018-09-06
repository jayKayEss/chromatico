import React from 'react';
import BaseLayer from './BaseLayer.js';
import logo from '../img/logo-bug.png';

class LogoLayer extends BaseLayer {

    renderCtx(ctx) {
        ctx.fillStyle = '#cccc';
        console.log(this.refs.logo);
        const width=200, height=40;
        ctx.drawImage(this.refs.logo, this.props.canvasWidth - width, this.props.canvasHeight - height, width, height);
    }

    render() {
        return (
            <div style={{ display: 'none' }}>
                <img ref="logo" src={logo} alt=""/>
            </div>
        );
    }
}

export default LogoLayer;