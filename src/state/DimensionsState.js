class DimensionsState {

    static determineCanvasSize() {
        // Do some math to scale the canvas to the right size, while preserving aspect ratio.
        // As ugly as this is, it's preferable to me than the pure-CSS padding + pseudo-element hack.
        var controlsHeight = 100,
            sidebarWidth = 300,
            screenWidth = window.screen.width,
            screenHeight = window.screen.height,
            pageWidth = window.innerWidth,
            pageHeight = window.innerHeight,
            widthFactorNoSidebar = screenWidth / pageWidth,
            widthFactorSidebar = screenWidth / (pageWidth - sidebarWidth),
            heightFactor = screenHeight / (pageHeight - controlsHeight),
            scalingFactorNoSidebar = widthFactorNoSidebar > heightFactor ? widthFactorNoSidebar : heightFactor,
            scalingFactorSidebar = widthFactorSidebar > heightFactor ? widthFactorSidebar : heightFactor;

        return {
            canvasWidth: screenWidth,
            canvasHeight: screenHeight,
            isMobile: screenWidth <= 425,
            isDesktop: screenWidth >= 1024,
            display: {
                width: Math.ceil(screenWidth / scalingFactorNoSidebar),
                height: Math.ceil(screenHeight / scalingFactorNoSidebar),
            },
            displayWithSidebar: {
                width: Math.ceil(screenWidth / scalingFactorSidebar),
                height: Math.ceil(screenHeight / scalingFactorSidebar)
            }
        };
    }
}

export default DimensionsState;