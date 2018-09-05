import BaseLayer from "./BaseLayer.js";

class TextLayer extends BaseLayer {

    renderCtx(ctx) {
        var font_size = Math.round(this.props.perc_font_size * Math.min(this.props.canvasHeight, this.props.canvasWidth)),
            lines = this.props.text.split("\n");

        ctx.fillStyle = this.props.color;
        ctx.font = `${this.props.style} ${font_size}px ${this.props.font}`;
        ctx.textBaseline = "top";

        var text_height = font_size * lines.length,
            text_width = lines.reduce((accum, line) => {
                var dim = ctx.measureText(line);
                return Math.max(accum, dim.width)
            }, 0);

        var offset_x = this.props.perc_offset_x * this.props.canvasWidth - (this.props.canvasWidth / 2),
            offset_y = this.props.perc_offset_y * this.props.canvasHeight - (this.props.canvasHeight / 2);
            
        var origin_x = (this.props.canvasWidth - text_width) / 2 + offset_x,
            origin_y = (this.props.canvasHeight - text_height) / 2 + offset_y;

        lines.forEach((line, i) => {
            ctx.fillText(line, origin_x, origin_y + font_size * i);
        });
    }
}

export default TextLayer;
