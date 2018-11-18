(function () {
    var animation = new ControlAnimation();

    function ControlAnimation () {}

    ControlAnimation.prototype.requestAnimationFrame = function (a) {
        return window.requestAnimationFrame(a);
    }

    function animationStart () {
        var body = $("body");
        function listenMousemove () {
            body.mousemove(function(e) {
                abscissa = e.clientX;//相当于p
                axis = e.clientY;//相当于t
                triggerTime = Date.now();//相当于w
                continuity || drawAnimation();//相当于u和n
            });
            $(window).on("blur mouseout", function () {
                abscissa = axis = null;
            }).on("resize", function () {
                bgCanvas && bgCanvas.parentNode && bgCanvas.parentNode.removeChild(bgCanvas);//相当于d
                init();
            });
            init();
        }

        function init () {
            var width, height;
            width = body.width();
            height = body.height();
            bgCanvas = document.createElement("canvas");//相当于d
            bgCanvas.className = "loginFun";
            bgCanvas.width = width;
            bgCanvas.height = height;
            body.append(bgCanvas);
            coverCanvas = document.createElement("canvas");//相当于l
            coverCanvas.width = width;
            coverCanvas.height = height;
            if(bgCanvas.getContext && bgCanvas.getContext("2d") && (background = bgCanvas.getContext("2d"), coverbg = coverCanvas.getContext("2d"),//相当于m, f
                coverbg.lineCap = "round", coverbg.shadowColor = "#000000", coverbg.shadowBlur = -1 < navigator.userAgent.indexOf("Firefox") ? 0 : 30, !bgImage)) {
                bgImage = new Image;//相当于g
                $(bgImage).one("load", drawAnimation);
                $(bgImage).attr("src", "bg.jpg");
            }
        }

        function drawAnimation () {
            var scrollPart = body.scrollTop(), transferTime = Date.now();//相当于调用函数时间
            continuity = transferTime > triggerTime + 500 ? false:true;
            abscissa && continuity && pointStack.unshift({
                time: transferTime,
                abscissa: abscissa,
                axis: axis + scrollPart
            });
            for(var count = 0; count < pointStack.length;)
              1E3 < transferTime - pointStack[count].time ? pointStack.length = count: count++;
            pointStack.length > 0 && animation.requestAnimationFrame(drawAnimation);
            coverbg.clearRect(0, 0, coverCanvas.width, coverCanvas.height);
            for(var i = 1; i < pointStack.length; i ++) {
                var distance = Math.sqrt(Math.pow(pointStack[i].abscissa - pointStack[i-1].abscissa, 2) + Math.pow(pointStack[i].axis - pointStack[i - 1].axis, 2));
                coverbg.strokeStyle = "rgba(0,0,0," + Math.max(1 - (transferTime - pointStack[i].time)/1E3, 0) + ")";
                coverbg.lineWidth = 25 + 75*Math.max(1 - distance/50, 0);
                coverbg.beginPath();
                coverbg.moveTo(pointStack[i - 1].abscissa, pointStack[i - 1].axis);
                coverbg.lineTo(pointStack[i].abscissa, pointStack[i].axis);
                coverbg.stroke();
            }
            var width = bgCanvas.width,
                proportion = width/bgImage.naturalWidth * bgImage.naturalHeight;
            proportion < bgCanvas.height && (proportion = bgCanvas.height, width = bgCanvas.height/bgImage.naturalHeight * bgImage.naturalWidth);
            background.drawImage(bgImage, 0, 0, width, proportion);
            background.globalCompositeOperation = "destination-in";
            background.drawImage(coverCanvas, 0, 0);
            background.globalCompositeOperation = "source-over";
        }
        var bgCanvas, coverCanvas, background, coverbg, bgImage, abscissa = null, axis = null,
            pointStack = [],
            triggerTime = 0,
            continuity = true;
            "createTouch" in document || $(listenMousemove);
        }
        $(function () {
            animationStart();
        })
})();