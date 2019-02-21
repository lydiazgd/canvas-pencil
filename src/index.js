import $ from 'jQuery';
import {AnimationStart} from './animation-start.js';
import '../assets/index.css';

class Start {
    constructor() {
        $(() => {
            this.animationStart();
        });
    }
    animationStart() {
        let animation = new AnimationStart();
        "createTouch" in document || $(animation.listenMousemove.bind(animation));
    }
}
window.onload = new Start();