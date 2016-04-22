# JC-canvas
一个轻量级的canvas渲染引擎

### 引擎功能 ###

主要渲染canvas的三种类型的物体，位图、形状和文字。JC-canvas（一下简称JC）提供了简单的API接口来操作物体，并且可以调用每个物体的时间运动函数来使物体做运动。可以操作的属性（alpha、scale、rotation、skew、translate）。

### API介绍 ###
JC支持绘制四种类型的物体，容器（Container）、位图（Sprite）、形状（Graphics）、文字（Text）。
还有一个对象是舞台（Stage），舞台可以让我们操作canvas标签的相关表现，所有要显示的物体最终都得添加到舞台中。

容器（Container）：
  这是一个抽象层，可以用来装位图（Sprite）、形状（Graphics）、文字（Text）等物体。容器可以想象成是PS里面的一个组或者页面布局里面的div。如果你想对一组物体进行缩放，你可以将这些物体放在同一个容器中，之后你只需要操作这个容器即可。
  
  注意！！！！容器是可以装容器的。
  
位图（Sprite）：
  精灵位图我们最熟悉不过了，除了对物体的基本操作外我们还可以用它来制作逐帧动画。只要我们主备好序列帧，并且绑定好起始位置、帧数每一帧的宽高等，我们就可以很方便的播放逐帧动画了。
  
形状（Graphics）：
  使用canvas的路径绘制功能我们可以绘制任何形状，你可以通过链式操作来绘制你想绘制的形状，绘制完之后你只需要把它添加在舞台或者先是在舞台的容器中即可。
  
  注意！！！！如果你绘制的形状非常复杂你最好使用形状提供的cache()功能，将这个形状缓存起来。
  
文字（Text）：
  文字功能使用的是canvas的文字绘制接口，设置颜色、字体相关属性等。
  

### 使用例子 ###

#### 例子1 ####

```html
    <canvas id="canvas">
        <p>You need a <a href="http://www.uc.cn">modern browser</a> to view this.</p>
    </canvas>

    <script type="text/javascript" src="/js/jc.js"></script>
    <script type="text/javascript">
    var spriteSheet = new JC.ImagesLoad({   // 位图资源加载
                            'man': './images/man.png'
                        });
    var w = window.innerWidth*2,
        h = Math.max(window.innerHeight,460)*2,
        DOC,
        shape,
        text,
        stage;
        stage = new JC.Stage('canvas');   // 实例化舞台
        stage.resize(w,h);  // 初始化舞台宽高

        spriteSheet.imagesLoaded = function (){
            
            DOC = new JC.Container();   // 实例化容器
            DOC.x = w/2;
            DOC.y = h/2;


            shape = new JC.Graphics();  // 实例化形状
            shape.beginFill('#ff0000').arc(0, 0, 20, 0, 2*Math.PI).closePath();
            shape.cache(-20, -20, 40, 40);  // 缓存形状
            shape.moveTween({  // 动画功能使用
                attr: {
                    x: 1000*(Math.random()-.5),
                    y: 1000*(Math.random()-.5)
                },
                time: 1000,
                fx: 'elasticOut',
                complete: function(){
                    console.log('动画结束回调');
                }
            });



            sprite = new JC.Sprite({  // 实例化位图
                                image: spriteSheet.getResult('man'),
                                count: 26,
                                width: 165,
                                height: 292
                            });
            sprite.regX = 82;
            sprite.regY = 146;
            sprite.goFrames({  // 播放位图逐帧
                sH: 0,
                loop: false
            });

            text = new JC.Text('文本字符串','30px Arial','#ff0000');  // 实例化文字
            text.x = 200;
            text.regX = 75;  // 设置文字中心点
            text.regY = -15; // 设置文字中心点
            text.rotation = 720;
            text.scale(0);
            text.alpha = 0;
            text.moveTween({  //  动画功能使用
                attr: {
                    rotation: 0,
                    scaleXY: 1,
                    alpha: 1
                },
                time: 8000,
                fx: 'elasticOut',
                complete: function(){
                    console.log('动画结束回调');
                }
            });


            DOC.addChild(shape,sprite,text); //  将物体添加到容器
            stage.addChild(DOC);  //  将容器或物体添加到舞台

            stage.render();  //  渲染舞台
            render();
        }


    function render(){  //  循环渲染舞台
        

        stage.render();
        RAF(render);
    }
</script>
```



#### 例子2 ####

```html
<canvas id="canvas"></canvas>
<script type="text/javascript" src="./js/jc.js"></script>
<script type="text/javascript">
    // 预加载图片资源
    var Images = new JC.ImagesLoad({
                            'body': './images/body.png',
                            'arm1': './images/arm1.png',
                            'arm2': './images/arm2.png',
                            'haha': './images/haha.png'
                        });
    var w = window.innerWidth*2,
        h = Math.max(window.innerHeight,460)*2,
        test,
        body,
        arm1,
        arm2,
        haha,
        globe,
        armBox,
        arm2Box,
        hahaBox,
        stage;
        stage = new JC.Stage('canvas'); // 实例化舞台对象
        stage.resize(w,h);
    
    Images.imagesLoaded = function (){
        
        globe = new JC.Container();   // 实例化容器对象，之后将会往容器内添加物体
        globe.x = w/3;
        globe.y = h/2;
        armBox = new JC.Container();
        armBox.x = 110;
        arm2Box = new JC.Container();
        arm2Box.x = 270;
        arm2Box.y = -282;
        arm2Box.rotation = -30;
        hahaBox = new JC.Container();
        hahaBox.x = 190;
        hahaBox.y = 224;


        test = new JC.Graphics();   // 实例化形状对象
        test.beginFill('#ff0000').arc(0, 0, 20, 0, 2*Math.PI).closePath();     // 链式命令绘制形状
        
        body = new JC.Sprite({       // 实例化位图对象，以json格式配置图片资源、帧数、宽高、起始位置可以用sH、sW来指定
                            image: Images.getResult('body'),
                            count: 0,
                            width: 537,
                            height: 359
                        });
        arm1 = new JC.Sprite({
                            image: Images.getResult('arm1'),
                            count: 0,
                            width: 333,
                            height: 348
                        });
        arm1.regX = 34;
        arm1.regY = 306;
        arm2 = new JC.Sprite({
                            image: Images.getResult('arm2'),
                            count: 0,
                            width: 230,
                            height: 328
                        });
        arm2.regX = 30;
        arm2.regY = 94;
        haha = new JC.Sprite({
                            image: Images.getResult('haha'),
                            count: 0,
                            width: 136,
                            height: 81
                        });
        haha.regX = 124;
        haha.regY = 14;
        haha.rotation = -80;



        hahaBox.addChild(haha);
        arm2Box.addChild(arm2,hahaBox);
        armBox.addChild(arm1,arm2Box);
        globe.addChild(body,armBox); // 将物体添加到容器内，并且容器也可以作为一个物体添加到另外一个容器内。
        stage.addChild(globe);

        stage.render(); // 渲染舞台
        render();
    }

    var deg = {
            armBox: 0,
            arm2Box: 0,
            hahaBox: 0,
            globe: 0
        };

    document.addEventListener('keydown',function(ev){
        // console.log(ev);
        switch(ev.keyCode){
            case 37:
                deg.armBox = ev.shiftKey?1:-1;
                break;
            case 40:
                deg.arm2Box = ev.altKey?1:-1;
                break;
            case 39:
                deg.hahaBox = ev.ctrlKey?2:-2;
                break;
            case 87:
                deg.globe = 3;
                break;
            case 83:
                deg.globe = -3;
                break;
        }
        ev.preventDefault();
    },false);
    document.addEventListener('keyup',function(ev){
        switch(ev.keyCode){
            case 37:
                deg.armBox = 0;
                break;
            case 40:
                deg.arm2Box = 0;
                break;
            case 39:
                deg.hahaBox = 0;
                break;
            case 87:
                deg.globe = 0;
                break;
            case 83:
                deg.globe = 0;
                break;
        }
        return false;
    },false);

    function render(){ // 渲染更新舞台

        armBox.rotation += deg.armBox;
        arm2Box.rotation += deg.arm2Box;
        hahaBox.rotation += deg.hahaBox;
        globe.x += deg.globe;

        stage.render();
        RAF(render);
    }

</script>
```


### 说明 ###
由于选择轻量级，所以canvas滤镜并没有包含在该库里面。这个版本的事件功能还没有加上，如果需要为每个物体绑定事件可以选择另外一个版本。