import $ from 'jQuery';
import { ControlAnimation } from './animation-frame.js';
import { space } from './name-space.js'

class AnimationStart {
    constructor() {
        this.body = $("body");
        this.ca = new ControlAnimation();
    }

    listenMousemove () {
        let self = this;
        this.body.mousemove((e)=>{
            space.abscissa = e.clientX;
            space.axis = e.clientY;
            space.triggerTime = Date.now();
            space.continuity || self.drawAnimation();
        });
        $(window).on("blur mouseout", ()=>{
            space.abscissa = space.axis = null;
        }).on("resize", ()=>{
            space.bgCanvas && space.bgCanvas.parentNode && space.bgCanvas.parentNode.removeChild(space.bgCanvas);
            self.init();
        });
        this.init();
    }

    init () {
        let width, height;
        width = this.body.width();
        height = this.body.height();
        space.bgCanvas = document.createElement("canvas");
        space.bgCanvas.className = "canvas-pencil";
        space.bgCanvas.width = width;
        space.bgCanvas.height = height;
        this.body.append(space.bgCanvas);
        space.coverCanvas = document.createElement("canvas");
        space.coverCanvas.width = width;
        space.coverCanvas.height = height;
        if(space.bgCanvas.getContext && space.bgCanvas.getContext("2d")) {
            space.background = space.bgCanvas.getContext("2d");
            space.coverbg = space.coverCanvas.getContext("2d");
            space.coverbg.lineCap = "round";
            space.coverbg.shadowColor = "#000000";
            space.coverbg.shadowBlur = -1 < navigator.userAgent.indexOf("Firefox") ? 0 : 30;
            if(!space.bgImage) {
                space.bgImage = new Image;
                $(space.bgImage).one("load", this.drawAnimation.bind(this));
                $(space.bgImage).attr("src", "./assets/bg.jpg");
            }
        }
    }

    drawAnimation () {
        let scrollPart = this.body.scrollTop(), transferTime = Date.now();
        space.continuity = transferTime <= space.triggerTime + 500;
        space.abscissa && space.continuity && space.pointStack.unshift({
            time: transferTime,
            abscissa: space.abscissa,
            axis: space.axis + scrollPart
        });
        for(let count = 0; count < space.pointStack.length;)
            1000 < transferTime - space.pointStack[count].time ? space.pointStack.length = count: count++;
        space.pointStack.length > 0 && this.ca.requestAnimationFrame(this.drawAnimation.bind(this));
        space.coverbg.clearRect(0, 0, space.coverCanvas.width, space.coverCanvas.height);
        for(let i = 1; i < space.pointStack.length; i ++) {
            let distance = Math.sqrt(
                Math.pow(space.pointStack[i].abscissa - space.pointStack[i-1].abscissa, 2) 
                + Math.pow(space.pointStack[i].axis - space.pointStack[i - 1].axis, 2));
            space.coverbg.strokeStyle = "rgba(0,0,0," + Math.max(1 - (transferTime - space.pointStack[i].time)/1000, 0) + ")";
            space.coverbg.lineWidth = 25 + 75*Math.max(1 - distance/50, 0);
            space.coverbg.beginPath();
            space.coverbg.moveTo(space.pointStack[i - 1].abscissa, space.pointStack[i - 1].axis);
            space.coverbg.lineTo(space.pointStack[i].abscissa, space.pointStack[i].axis);
            space.coverbg.stroke();
        }
        let width = space.bgCanvas.width,
            proportion = width/space.bgImage.naturalWidth * space.bgImage.naturalHeight;
        proportion < space.bgCanvas.height && (proportion = space.bgCanvas.height, width = space.bgCanvas.height/space.bgImage.naturalHeight * space.bgImage.naturalWidth);
        space.background.drawImage(space.bgImage, 0, 0, width, proportion);
        space.background.globalCompositeOperation = "destination-in";
        space.background.drawImage(space.coverCanvas, 0, 0);
        space.background.globalCompositeOperation = "source-over";
    }

}

export { AnimationStart }