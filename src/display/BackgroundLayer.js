import BaseLayer from './BaseLayer.js';

class BackgroundLayer extends BaseLayer {

    renderCtx(ctx) {
        ctx.fillStyle = this.props.color;
        ctx.fillRect(0, 0, this.props.canvasWidth, this.props.canvasHeight);
    }

}

export default BackgroundLayer;