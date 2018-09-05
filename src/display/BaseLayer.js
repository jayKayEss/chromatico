import { Component } from 'react';

class BaseLayer extends Component {

    constructor() {
        super();

        this.renderCtx = this.renderCtx.bind(this);
    }

    componentDidMount() {
        this.updateCanvas();
    }

    componentDidUpdate() {
        this.updateCanvas();
    }

    updateCanvas() {
        this.props.renderCtx(this.renderCtx);
    }

    render() {
        return null;
    }

}

export default BaseLayer;