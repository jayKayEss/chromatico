import FileSaver from 'file-saver';
import DimensionsState from './state/DimensionsState.js';
import ColorState from './state/ColorState.js';
import StripeState from './state/StripeState.js';
import TextState from './state/TextState.js';

class actions {

    static initializeState() {
        var dimensions = DimensionsState.determineCanvasSize();
        return {
            dimensions: dimensions,
            colors: [],
            scale_s: 0,
            scale_l: 0,
            stripes: [],
            text: [],
            sidebar_active: dimensions.isDesktop ? true : false
        }
    }

    static randomizeAll() {
        this.onChangeLuminance(0);
        this.onChangeSaturation(0);
        this.randomizeColors();
        this.randomizeLayers();
    }

    static randomizeColors() {
        var num_colors = Math.floor(Math.random() * 4) + 2;

        this.setState({
            colors: ColorState.pickRandom(num_colors)
        });
    }

    static randomizeLayers() {
        var num_colors = this.state.colors.length,
            num_stripes = Math.floor(Math.random() * 5) + 1;

        // we make sure there's always at least as many layers as colors
        var num_text = Math.max(num_colors - num_stripes, Math.floor(Math.random() * 3) + 2);

        this.setState({
            stripes: StripeState.pickRandom(num_stripes),
            text: TextState.pickRandom(num_text)
        })
    }

    static updateAfterResize() {
        this.setState({
            dimensions: DimensionsState.determineCanvasSize()
        });
    }

    static onFileDownload() {
        // this isn't very react-y; sorry ¯\_(ツ)_/¯
        document.getElementById('canvas').toBlob(data => {
            FileSaver.saveAs(data, `chromatico_${Date.now()}.png`);
        })
    }

    static onToggleSidebar() {
        this.setState({
            sidebar_active: !this.state.sidebar_active
        });
    }

    static onCloseSidebar() {
        this.state.dimensions.isMobile && this.setState({
            sidebar_active: false
        });
    }

    static onChangeColor(i) {
        var colors = this.state.colors;
        colors[i] = ColorState.randomItem();

        this.setState({
            colors: colors
        });
    }

    static onAddColor() {
        if (this.state.colors.length < 5) {
            var colors = this.state.colors;
            colors.push(ColorState.randomItem());

            this.setState({
                colors: colors
            });
        }
    }

    static onRemoveColor() {
        if (this.state.colors.length > 2) {
            var colors = this.state.colors;
            colors.pop();

            this.setState({
                colors: colors
            });
        }
    }

    static onRefreshColors() {
        var num_colors = this.state.colors.length;

        this.setState({
            colors: ColorState.pickRandom(num_colors)
        });
    }

    static onRotateColors() {
        var colors = this.state.colors;
        colors.unshift(colors.pop());

        this.setState({
            colors: colors
        });
    }

    static onChangeSaturation(scale_s) {
        this.setState({
            scale_s: Math.max(Math.min(scale_s, 1), -1)
        });
    }

    static onChangeLuminance(scale_l) {
        this.setState({
            scale_l: Math.max(Math.min(scale_l, 1), -1)
        });
    }
}

export default actions;