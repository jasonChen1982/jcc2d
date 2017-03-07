# jcc2d
[![Build Status](https://img.shields.io/travis/jasonChen1982/jcc2d.svg?style=flat-square)](https://travis-ci.org/jasonChen1982/jcc2d)
[![npm](https://img.shields.io/npm/v/jcc2d.svg?style=flat-square)](https://jasonchen1982.github.io/jcc2d/)


A canvas 2d renderer & An awesome animator
---

## Show case
* [refactor usopen-sessions main page][jcc2d]
* [particle effect][particle]
* [3D pictures cloud][zIndex-demo]
* [sprites movieclip][movieclip]
* [blur mask high performance filter][blur-mask]
* [skeleton draw by graphics][skeleton-graphics]
* [skeleton draw by sprite][skeleton-sprite]
* [check eventer pointer exact polygon][event-exact-polygon]
* [varied timingfunction supported][varied-timingfunction]
* [path motion animation][path-motion]

## Introduction
[main page][jcc2d]

jcc2d is a lightweight canvas2d render engine and build-in an awesome animator with timeline management, support event system by default.

## Feature

Include `Stage` `Sprite` `Graphics` `Container` `BlurFilter` `TextFace` and so on.

Every display instance can easy start an animation and attach a timeline, just like following:

```javascript
cosnt ball = new JC.Sprite({
    texture: new JC.Texture('/path/xx.png'),
});
ball.fromTo({
  from: {x: 100},
  to: {x: 200},
  ease: 'bounceOut', // set a timingfunction
  repeats: 10, // repeat sometimes
  infinity: true, // want infinity loop?
  alternate: true, // loop with alternate
  duration: 1000, // duration
  onUpdate: function(state,rate){}, // onUpdate callback
  onCompelete: function(){ console.log('end'); } // onCompelete callback
});
```

## Display animation property

|                   type                   |         property          |
| :--------------------------------------: | :-----------------------: |
| display instance coordinate axis position |          `x` `y`          |
|       display instance scale value       | `scale` `scaleX` `scaleY` |
|       display instance skew value        |      `skewX` `skewY`      |
|    display instance rotation with CCW    |        `rotation`         |
|      display instance opacity alpha      |          `alpha`          |
|          display instance pivot          |    ` pivotX` ` pivotY`    |




## Quick start
[runing man][quick-start]

## Documention
 [documention][documention]

## Example
 [examples][examples]

## License

[MIT](http://opensource.org/licenses/MIT)

[jcc2d]:https://jasonchen1982.github.io/jcc2d/ "jcc2d main page"
[documention]:https://jasonchen1982.github.io/jcc2d/docs "jcc2d documention page"
[examples]:https://jasonchen1982.github.io/jcc2d/examples "jcc2d examples page"
[particle]:https://jasonchen1982.github.io/jcc2d/examples/ "Particle effect"
[zIndex-demo]:https://jasonchen1982.github.io/jcc2d/examples/#demo_zIndex_bitmap "3D pictures cloud used zIndex"
[movieclip]:https://jasonchen1982.github.io/jcc2d/examples/#demo_frames_sprite "sprites movieclip"
[blur-mask]:https://jasonchen1982.github.io/jcc2d/examples/#demo_filter_blur "blur mask high performance filter"
[skeleton-graphics]:https://jasonchen1982.github.io/jcc2d/examples/#demo_skeleton_graphics "skeleton draw by graphics"
[skeleton-sprite]:https://jasonchen1982.github.io/jcc2d/examples/#demo_skeleton_sprite "skeleton draw by sprite"
[event-exact-polygon]:https://jasonchen1982.github.io/jcc2d/examples/#demo_interactive_boundPrecise "check eventer pointer exact polygon"
[varied-timingfunction]:https://jasonchen1982.github.io/jcc2d/examples/#demo_timingfunction_allInOne "varied timingfunction supported"
[path-motion]:https://jasonchen1982.github.io/jcc2d/examples/#demo_animation_motion "path motion animation"
[quick-start]:http://codepen.io/JasonChen1982/pen/grJzmz?editors=0010 "quick start demo"
