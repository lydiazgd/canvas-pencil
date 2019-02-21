import $ from 'jQuery';
import {AnimationStart} from './animation-start.js';
import '../assets/index.css';

$(()=>{
    const animation = new AnimationStart();
    "createTouch" in document || $(animation.listenMousemove.bind(animation));
});