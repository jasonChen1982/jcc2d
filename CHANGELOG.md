# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.3.0"></a>
# [1.3.0](https://github.com/jasonChen1982/jcc2d/compare/v1.2.7...v1.3.0) (2017-07-11)


### Bug Fixes

* **_ready-loop:** fixed infinite loop when ready was false ([f5b5153](https://github.com/jasonChen1982/jcc2d/commit/f5b5153))
* **bounds:** fixed default value when param was zero ([5c85419](https://github.com/jasonChen1982/jcc2d/commit/5c85419))


### Features

* **transition:** remove transition animate preset from status ([30d3e82](https://github.com/jasonChen1982/jcc2d/commit/30d3e82))



<a name="1.2.7"></a>
## [1.2.7](https://github.com/jasonChen1982/jcc2d/compare/v1.2.6...v1.2.7) (2017-07-10)


### Bug Fixes

* **KeyFrames:** fixed KeyFrames status not init when pause before run animation ([bd5c8d0](https://github.com/jasonChen1982/jcc2d/commit/bd5c8d0))



<a name="1.2.6"></a>
## [1.2.6](https://github.com/jasonChen1982/jcc2d/compare/v1.2.5...v1.2.6) (2017-07-10)



<a name="1.2.5"></a>
## [1.2.5](https://github.com/jasonChen1982/jcc2d/compare/v1.2.4...v1.2.5) (2017-05-27)


### Features

* **animate:** all animation class extends JC.Eventer ([8c55f7c](https://github.com/jasonChen1982/jcc2d/commit/8c55f7c))



<a name="1.2.4"></a>
## [1.2.4](https://github.com/jasonChen1982/jcc2d/compare/v1.2.3...v1.2.4) (2017-05-27)


### Features

* **movie-clip:** extends JC.Eventer ([9df21c5](https://github.com/jasonChen1982/jcc2d/commit/9df21c5))



<a name="1.2.3"></a>
## [1.2.3](https://github.com/jasonChen1982/jcc2d/compare/v1.2.2...v1.2.3) (2017-05-27)


### Features

* **container:** fix array.sort was unstable, so change to bubble sort ([f3c9463](https://github.com/jasonChen1982/jcc2d/commit/f3c9463))



<a name="1.2.2"></a>
## [1.2.2](https://github.com/jasonChen1982/jcc2d/compare/v1.2.1...v1.2.2) (2017-05-26)


### Bug Fixes

* **container:** fix sort fn ([83addaf](https://github.com/jasonChen1982/jcc2d/commit/83addaf))



<a name="1.2.1"></a>
## [1.2.1](https://github.com/jasonChen1982/jcc2d/compare/v1.2.0...v1.2.1) (2017-05-26)


### Features

* **animation:** add animation control api ([6c4771b](https://github.com/jasonChen1982/jcc2d/commit/6c4771b))
* **animation:** adjust spill theory ([a0b17ef](https://github.com/jasonChen1982/jcc2d/commit/a0b17ef))
* **Point:** enhance Point class with cross function ([f96148d](https://github.com/jasonChen1982/jcc2d/commit/f96148d))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/jasonChen1982/jcc2d/compare/v1.1.10...v1.2.0) (2017-05-25)


### Features

* enhance Graphics and Textface ([35d7b2c](https://github.com/jasonChen1982/jcc2d/commit/35d7b2c))


v1.1.7 / 2017-05-16
==================

  * fix: should not log error when asset type was component

v1.1.6 / 2017-05-16
==================

  * feat: remove es6 modifier
  * feat: add built-in `up` key

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
