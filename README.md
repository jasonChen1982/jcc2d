# jcc2d
一个轻量级的canvas渲染引擎 [demo&documention](https://jasonchen1982.github.io/jcc2d/)

### 引擎功能 ###

主要渲染canvas的三种类型的物体，位图、形状和文字。jcc2d提供了简单的API接口来操作物体，并且可以调用每个物体的时间运动函数来使物体做运动。可以操作的属性有alpha、scale、rotation、skew、translate等。

### 框架介绍 ###
jcc2d有几大主要类型，动画器（Animate）、显示对象（DisplayObject）、容器（Container）、位图（Sprite）、形状（Graphics）、文字（Text）、舞台（Stage）。

其中它们的继承关系如下图：

![继承关系图](http://img.ucweb.com/s/uae/g/01/jason_chen/jcc2d/extend.jpg)

### 常用的类 ###

容器（Container）：
  从DisplayObject类继承而来，这是一个抽象层，可以用来装位图（Sprite）、形状（Graphics）、文字（Text）等物体形成一个组。容器可以想象成是PS里面的一个组或者页面布局里面的div。如果你想对一组物体进行缩放，你可以将这些物体放在同一个容器中，之后你只需要操作这个容器即可。
  
位图（Sprite）：
  从Container类继承而来，精灵位图我们最熟悉不过了，除了对物体的基本操作外我们还可以用它来制作逐帧动画。只要我们准备好序列帧，并且绑定好起始位置、帧数每一帧的宽高等纹理信息，我们就可以很方便的播放逐帧动画了。
  
形状（Graphics）：
  从Container类继承而来，这里的实现摒弃了之前版本的重构canvas api的方式，而是直接将绘制暴露给调用者，通过drawCall函数来传递我们自己的绘图程序。
  
  注意！！！！如果你绘制的形状非常复杂你最好使用形状提供的cache()功能，将这个形状缓存成位图，这样下次的绘制就只需要耗费一次像素拷贝的时间了。
  
文字（Text）：
  从Container类继承而来，文字功能使用的是canvas的文字绘制接口，设置颜色、字体相关属性等。
  

### 使用例子 ###
  查看组件下的 examples 目录


### 说明 ###
由于选择轻量级，所以canvas滤镜并没有包含在该库里面。这个版本的事件功能将通过另外一个事件扩展来实现。