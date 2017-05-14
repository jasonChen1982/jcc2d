
v1.1.5 / 2017-05-14
==================

  * feat(keyframes): add fully easing for keyframes
  * feat: add some helper function

v1.1.4 / 2017-05-09
==================

  * fix(BezierCurve): getPoint when not call recursive, correct points

v1.1.3 / 2017-05-08
==================

  * feat: finish runners and adjust jsdoc

v1.1.2 / 2017-04-26
==================

  * feat: stage.startEngine
  * fix: per-check keyframes total time

v1.1.1 / 2017-04-19
==================

  * feat: add jcc2d.light.js

v1.1.0 / 2017-04-18
==================

  * feat: built-in engine start render loop method in Stage
  * feat: change infinity to infinite for stay with css animation
  * feat: add animateRunner
  * feat(animation): finish keyframes and parserkeyframes, support after effects exported data

v1.0.2 / 2017-03-27
==================

  * refactor: code style use in eslint-config-google
  * refactor: adjust files structure tree

v1.0.1 / 2017-03-20
==================

  * chore: remove Curve Class in JC 

v1.0.0 / 2017-03-17
==================

  * feat: add-on JC.Point Class
  * refactor: adjust code structure tree
  * chore: adjust commit msg in package.json

v0.2.9 / 2017-02-19
==================

  * fix: change Text class to TextFace class

v0.2.8 / 2017-02-19
==================

  * feat: sprite can adjust width and height
  * fix: fix averageFps
  * feat: change Stage arguments to options

v0.2.5 / 2016-11-07
==================

  * refactor: 重写图形的cache实现

v0.2.4 / 2016-11-07
==================

  * feat: 增加blur滤镜功能

v0.2.3 / 2016-10-27
==================

  * feat: 增加zIndex功能，只在设定需要重新排序的时候才会重新排序
  * refactor: 修改Stage继承Container，提高代码复用率
  * feat: 增加stage的事件监听，事件对象的坐标为转换到canvas坐标系的坐标
  * fix: 修复timescale不能为负数的问题 perf: 提升keyframe的性能

v0.2.2 / 2016-10-26
==================

  * fix: 修复timescale不能为负数的问题
  * perf: 提升keyframe的性能
