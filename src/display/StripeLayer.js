import BaseLayer from './BaseLayer.js';
import {StripeState} from '../state/index.js';

class StripeLayer extends BaseLayer {

    renderCtx(ctx) {
        ctx.fillStyle = this.props.color;
        var stripe_width, offset;

        if (this.props.orientation === StripeState.Horizontal) {
            stripe_width = Math.round(this.props.canvasHeight * this.props.perc_width);
            offset = Math.round(this.props.canvasHeight * this.props.perc_offset);
            ctx.fillRect(0, offset, this.props.canvasWidth, stripe_width);
        } else {
            stripe_width = Math.round(this.props.canvasWidth * this.props.perc_width);
            offset = Math.round(this.props.canvasWidth * this.props.perc_offset);
            ctx.fillRect(offset, 0, stripe_width, this.props.canvasHeight);
        }
    }

}

export default StripeLayer;