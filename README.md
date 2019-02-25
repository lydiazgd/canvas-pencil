# canvas-pencil
一个基于HTML5 Canvas的鼠标画笔效果
无意中看到的一个canvas首页效果，能够使鼠标产生类似于画笔的效果。使网页蒙层在鼠标经过的路径留下痕迹，并且在一定的时间之后痕迹自动消失。
模仿原始代码复现了canvas的代码。为操作方便，代码中使用了jQuery作为依赖。
代码效果此处可见：
https://lydiazgd.github.io/canvas-pencil/

下面是代码讲解:

启动函数：animationStart();
在函数内初始化需要使用的全局变量，给mousemove事件绑定函数，并且调用其中的初始化函数init。

全局变量的意义:

> bgCanvas: 最底层的canvas元素。

> coverCanvas: 覆盖在底层canvas元素上的canvas元素，动画效果主要在这一层上面呈现。

> background: bgCanvas的canvas2d执行上下文。

> background: 覆盖在最底层的原始图片内容，作为鼠标滑开时展示的图片部分。

> coverbg: coverCanvas的canvas2d执行上下文。

> bgImage: 未加蒙层的覆盖在最底层的原始图片。

> abscissa: mousemove事件触发时鼠标的横坐标。

> axis: mousemove事件触发时鼠标的纵坐标。

> pointStack: 鼠标移动时的点的信息。

> triggerTime: 鼠标移动时的触发时间。

> continuity: mousemove触发时是否调用drawAnimation函数的标志。

主要函数讲解:

*  init函数
> 在init函数中初始化coverCanvas和bgCanvas, 并且初始化这两个canvas元素的2d的context上下文, 初始化背景图片。

> 在背景图片加载完毕之后，调用drawAnimation函数初始化动画。

*  drawAnimation函数
> 此函数为定义渲染网页规则的函数，是最重要的一个函数。

> 进入渲染动画函数之后，判断事件触发时间与函数触发时间的间隔是否大于500ms，如果大于500ms, 当前移动节点不放入节点队列。

> 否则将节点放入pointStack数组的头部。

> 每个节点的内容为，节点x坐标，节点y坐标，此节点触发渲染动画函数时间。

> 遍历pointStack中的节点，取pointStack中节点进行遍历，仅保留数组中与当前函数调用时间间隔小于1000ms的节点。如果pointStack中与

> 当前时间间隔小于等于1000ms的节点不为0，则重新渲染页面动画。

*  如何渲染动画
*  首先将coverbg上的动画清空
> coverbg.clearRect(0, 0, coverCanvas.width, coverCanvas.height);

> 遍历pointStack中的节点，计算每个节点和前一个节点的距离，并且在两点之间连线，将两点之间连线的颜色根据时间的变化逐渐将颜色变淡。

> coverbg.strokeStyle = "rgba(0,0,0," + Math.max(1 - (transferTime - pointStack[i].time)/1E3, 0) + ")"

> 获取到底部canvas的width大小，并且通过width和背景图片原始宽度的比例乘背景图片的原始高度。如果此值的高度小于bgCanvas的高度，

> 则将此值设置为bgCanvas的高度，width的值设置为bgCanvas的高度与背景图片的高度的比例乘背景图片的原始宽度。

> 使用canvas的drawImage函数，将canvas与背景图片结合一体成为背景。
