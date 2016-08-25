# jcc2d
[![Build Status](https://travis-ci.org/jasonChen1982/jcc2d.svg?branch=master)](https://travis-ci.org/jasonChen1982/jcc2d)

一个高性能的轻量级canvas渲染引擎、动画引擎 [demo&documention](https://jasonchen1982.github.io/jcc2d/)

### 优势 ###
  体积小、功能强大、低门槛、精简的[API](https://jasonchen1982.github.io/jcc2d/docs/)、优异的性能、成熟的引擎结构设计、高度可扩展性、强大的事件机制及事件系统，该引擎足以实现绝大部分canvas动画，为你提供快速的canvas动画开发。 

### 引擎功能 ###

主要渲染canvas的三种类型的物体，位图、形状和文字。jcc2d提供了简单的API接口来操作物体，并且可以调用每个物体的时间缓动函数来使物体做制定属性的运动（动画）。可以操作的属性有alpha、scale、rotation、x、y、pivotX、pivotY等。

### 框架介绍 ###
jcc2d有几大主要类型，动画器（Animate）、显示对象（DisplayObject）、容器（Container）、位图（Sprite）、形状（Graphics）、文字（Text）、舞台（Stage）。

其中它们的继承关系如下图：

![继承关系图](https://jasonchen1982.github.io/jcc2d/images/extend.png)

### 快速入门 ###
[quick Start](http://codepen.io/JasonChen1982/pen/grJzmz?editors=0010)

### 常用的类 ###

容器（Container）：
  从DisplayObject类继承而来，这是一个抽象层，可以用来装位图（Sprite）、形状（Graphics）、文字（Text）等物体形成一个组。容器可以想象成是PS里面的一个组或者前端页面布局里面的div。如果你想对一组物体进行缩放，你可以将这些物体放在同一个容器中，之后你只需要操作这个容器的缩放属性即可。
  
位图（Sprite）：
  从Container类继承而来，精灵位图我们再熟悉不过了，除了对物体的基本操作外我们还可以用它来制作逐帧动画。只要我们准备好序列帧，并且绑定好起始位置、帧数每一帧的宽高等纹理信息，我们就可以很方便的播放逐帧动画了。
  
形状（Graphics）：
  从Container类继承而来，这里的实现摒弃了之前版本的重构canvas api的方式，而是直接将绘制暴露给调用者，通过drawCall函数来传递我们自己的绘图程序。增大图形绘制的自由度。
  
  注意！！！！如果你绘制的形状非常复杂你最好对你的形状开启cache配置，将这个形状缓存成位图，这样下次的绘制就只需要耗费一次像素拷贝的时间无需重新进行光栅化上色的操作了。
  
文字（Text）：
  从Container类继承而来，文字功能封装自canvas的文字绘制接口，文字对象可以设置颜色、字体相关属性等。

舞台（Stage）：
  从Container类继承而来，舞台负责绑定canvas元素以及对canvas视口进行操作，需要显示的物体都得添加到舞台中，最好通过舞台的render方法进行逐一绘制。
  

### 使用例子 ###
  查看项目下的 [examples](https://jasonchen1982.github.io/jcc2d/examples/) 目录


### 说明 ###
由于选择轻量级，所以不是非常实用的canvas滤镜并没有包含在该库里面。


##### 咳咳 #####
<sup><sub>-----争平云广场上的最好用有什么意思呢??呵呵-----</sup></sub>
