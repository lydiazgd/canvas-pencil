import $ from 'jquery';
import AnimationStart from './animation-start';
import '../assets/index.css';

$(() => {
    const animation = new AnimationStart();
    'createTouch' in document || animation.listenMousemove();
});
