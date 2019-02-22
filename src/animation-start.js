import $ from 'jquery';
import ControlAnimation from './animation-frame';
import space from './name-space';

class AnimationStart {
    constructor() {
        this.body = $('body');
        this.ca = new ControlAnimation();
    }

    listenMousemove() {
        const self = this;
        this.body.mousemove((e) => {
            space.abscissa = e.clientX;
            space.axis = e.clientY;
            space.triggerTime = Date.now();
            space.continuity || self.drawAnimation();
        });
        $(window).on('blur mouseout', () => {
            space.abscissa = null;
            space.axis = null;
        }).on('resize', () => {
            if (space.bgCanvas && space.bgCanvas.parentNode) {
                space.bgCanvas.parentNode.removeChild(space.bgCanvas);
            }
            self.init();
        });
        this.init();
    }

    init() {
        const width = this.body.width();
        const height = this.body.height();
        space.bgCanvas = document.createElement('canvas');
        space.bgCanvas.className = 'canvas-pencil';
        space.bgCanvas.width = width;
        space.bgCanvas.height = height;
        this.body.append(space.bgCanvas);
        space.coverCanvas = document.createElement('canvas');
        space.coverCanvas.width = width;
        space.coverCanvas.height = height;
        if (space.bgCanvas.getContext && space.bgCanvas.getContext('2d')) {
            space.background = space.bgCanvas.getContext('2d');
            space.coverbg = space.coverCanvas.getContext('2d');
            space.coverbg.lineCap = 'round';
            space.coverbg.shadowColor = '#000000';
            space.coverbg.shadowBlur = navigator.userAgent.indexOf('Firefox') > -1 ? 0 : 30;
            if (!space.bgImage) {
                space.bgImage = new Image();
                $(space.bgImage).one('load', this.drawAnimation.bind(this));
                $(space.bgImage).attr('src', './assets/bg.jpg');
            }
        }
    }

    drawAnimation() {
        const scrollPart = this.body.scrollTop(); const
            transferTime = Date.now();
        space.continuity = transferTime <= space.triggerTime + 500;
        space.abscissa && space.continuity && space.pointStack.unshift({
            time: transferTime,
            abscissa: space.abscissa,
            axis: space.axis + scrollPart,
        });
        for (let count = 0; count < space.pointStack.length;) {
            if (transferTime - space.pointStack[count].time > 1000) {
                space.pointStack.length = count;
            } else {
                count += 1;
            }
        }
        space.pointStack.length > 0 && this.ca.requestAnimationFrame(this.drawAnimation.bind(this));
        space.coverbg.clearRect(0, 0, space.coverCanvas.width, space.coverCanvas.height);
        for (let i = 1; i < space.pointStack.length; i++) {
            const distance = Math.sqrt(
                // eslint-disable-next-line no-restricted-properties
                Math.pow(space.pointStack[i].abscissa - space.pointStack[i - 1].abscissa, 2)
                // eslint-disable-next-line no-restricted-properties
                + Math.pow(space.pointStack[i].axis - space.pointStack[i - 1].axis, 2),
            );
            space.coverbg.strokeStyle = `rgba(0,0,0,${Math.max(1 - (transferTime - space.pointStack[i].time) / 1000, 0)})`;
            space.coverbg.lineWidth = 25 + 75 * Math.max(1 - distance / 50, 0);
            space.coverbg.beginPath();
            space.coverbg.moveTo(space.pointStack[i - 1].abscissa, space.pointStack[i - 1].axis);
            space.coverbg.lineTo(space.pointStack[i].abscissa, space.pointStack[i].axis);
            space.coverbg.stroke();
        }
        let { width } = space.bgCanvas;
        let proportion = width / space.bgImage.naturalWidth * space.bgImage.naturalHeight;
        if (proportion < space.bgCanvas.height) {
            proportion = space.bgCanvas.height;
            width = space.bgCanvas.height / space.bgImage.naturalHeight
            * space.bgImage.naturalWidth;
        }
        space.background.drawImage(space.bgImage, 0, 0, width, proportion);
        space.background.globalCompositeOperation = 'destination-in';
        space.background.drawImage(space.coverCanvas, 0, 0);
        space.background.globalCompositeOperation = 'source-over';
    }
}

export default AnimationStart;
