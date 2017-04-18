import {Eventer} from './Eventer';
import {InteractionData} from './InteractionData';
import {Point} from '../math/Point';

/**
 *
 * @param {JC.Stage} stage 需要接入事件系统的的场景
 */
function InteractionManager(stage) {
  Eventer.call(this);
  this.stage = stage;

  this.canvas = this.stage.canvas;

  this.autoPreventDefault = true;
  this.strictMode = false;

  this.onMouseUp = this.onMouseUp.bind(this);
  this.processMouseUp = this.processMouseUp.bind(this);

  this.onMouseMove = this.onMouseMove.bind(this);
  this.processMouseMove = this.processMouseMove.bind(this);

  this.onMouseDown = this.onMouseDown.bind(this);
  this.processMouseDown = this.processMouseDown.bind(this);

  this.onClick = this.onClick.bind(this);
  this.processClick = this.processClick.bind(this);

  this.onTouchStart = this.onTouchStart.bind(this);
  this.processTouchStart = this.processTouchStart.bind(this);

  this.onTouchEnd = this.onTouchEnd.bind(this);
  this.processTouchEnd = this.processTouchEnd.bind(this);

  this.onTouchMove = this.onTouchMove.bind(this);
  this.processTouchMove = this.processTouchMove.bind(this);

  this.onMouseOut = this.onMouseOut.bind(this);
  this.processMouseOverOut = this.processMouseOverOut.bind(this);

  this.onMouseOver = this.onMouseOver.bind(this);

  this.defaultCursorStyle = 'inherit';

  this.currentCursorStyle = 'inherit';
}
InteractionManager.prototype = Object.create(Eventer.prototype);

InteractionManager.prototype.addEvents = function() {
  if (!this.canvas || this.eventsAdded) {
    return;
  }

  window.document.addEventListener('mousemove', this.onMouseMove, true);
  this.canvas.addEventListener('mousedown', this.onMouseDown, true);
  this.canvas.addEventListener('click', this.onClick, true);
  this.canvas.addEventListener('mouseout', this.onMouseOut, true);
  this.canvas.addEventListener('mouseover', this.onMouseOver, true);

  this.canvas.addEventListener('touchstart', this.onTouchStart, true);
  this.canvas.addEventListener('touchend', this.onTouchEnd, true);
  this.canvas.addEventListener('touchmove', this.onTouchMove, true);

  window.addEventListener('mouseup', this.onMouseUp, true);

  this.eventsAdded = true;
};

InteractionManager.prototype.removeEvents = function() {
  if (!this.canvas) {
    return;
  }

  window.document.removeEventListener('mousemove', this.onMouseMove, true);
  this.canvas.removeEventListener('mousedown', this.onMouseDown, true);
  this.canvas.removeEventListener('click', this.onClick, true);
  this.canvas.removeEventListener('mouseout', this.onMouseOut, true);
  this.canvas.removeEventListener('mouseover', this.onMouseOver, true);

  this.canvas.removeEventListener('touchstart', this.onTouchStart, true);
  this.canvas.removeEventListener('touchend', this.onTouchEnd, true);
  this.canvas.removeEventListener('touchmove', this.onTouchMove, true);

  window.removeEventListener('mouseup', this.onMouseUp, true);

  this.eventsAdded = false;
};

InteractionManager.prototype.onMouseMove = function(event) {
  let eventd = this.fixCoord(event);

  this.cursor = this.defaultCursorStyle;
  this.processInteractive(this.stage, eventd, this.processMouseMove, true);

  if (this.currentCursorStyle !== this.cursor) {
    this.currentCursorStyle = this.cursor;
    this.canvas.style.cursor = this.cursor;
  }

  this.emit('mousemove', eventd);
};

InteractionManager.prototype.processMouseMove = function(
  displayObject,
  event,
  hit
) {
  this.processMouseOverOut(displayObject, event, hit);
  if (hit) {
    this.dispatchEvent(displayObject, 'mousemove', event);
  }
};

InteractionManager.prototype.processMouseOverOut = function(
  displayObject,
  event,
  hit
) {
  let eventd = event.clone();
  if (hit) {
    if (!displayObject._over) {
      displayObject._over = true;
      this.dispatchEvent(displayObject, 'mouseover', eventd);
    }
    if (displayObject.buttonMode) {
      this.cursor = displayObject.cursor;
    }
  } else {
    if (displayObject._over) {
      displayObject._over = false;
      this.dispatchEvent(displayObject, 'mouseout', eventd);
    }
  }
};

InteractionManager.prototype.onMouseDown = function(event) {
  if (this.autoPreventDefault) {
    event.preventDefault();
  }
  let eventd = this.fixCoord(event);
  this.processInteractive(this.stage, eventd, this.processMouseDown, true);

  this.emit('mousedown', eventd);
};

InteractionManager.prototype.processMouseDown = function(
  displayObject,
  event,
  hit
) {
  if (hit) {
        // displayObject._mousedowned = true;
    this.dispatchEvent(displayObject, event.type, event);
  }
};

InteractionManager.prototype.onClick = function(event) {
  if (this.autoPreventDefault) {
    event.preventDefault();
  }
  let eventd = this.fixCoord(event);
  this.processInteractive(this.stage, eventd, this.processClick, true);

  this.emit('click', eventd);
};

InteractionManager.prototype.processClick = function(
  displayObject,
  event,
  hit
) {
  if (hit) {
        // displayObject._mousedowned = true;
    this.dispatchEvent(displayObject, event.type, event);
  }
};

InteractionManager.prototype.onMouseUp = function(event) {
    // if (this.autoPreventDefault) {
    //     event.preventDefault();
    // }
  let eventd = this.fixCoord(event);
  this.processInteractive(this.stage, eventd, this.processMouseUp, true);

  this.emit('mouseup', eventd);
};

InteractionManager.prototype.processMouseUp = function(
  displayObject,
  event,
  hit
) {
  if (hit) {
        // displayObject._mousedowned = false;
    this.dispatchEvent(displayObject, event.type, event);
  }
};

InteractionManager.prototype.onMouseOut = function(event) {
  let eventd = this.fixCoord(event);

  this.processInteractive(this.stage, eventd, this.processMouseOverOut, false);

  this.emit('mouseout', event);
};

InteractionManager.prototype.onMouseOver = function(event) {
  this.emit('mouseover', event);
};

InteractionManager.prototype.onTouchStart = function(event) {
    // if (this.autoPreventDefault) {
        // event.preventDefault();
    // }
    // console.log(event);
  let eventd = this.fixCoord(event);
  this.processInteractive(this.stage, eventd, this.processTouchStart, true);

  this.emit('touchstart', eventd);
};

InteractionManager.prototype.processTouchStart = function(
  displayObject,
  event,
  hit
) {
  if (hit) {
    displayObject._touchstarted = true;
    this.dispatchEvent(displayObject, 'touchstart', event);
  }
};

InteractionManager.prototype.onTouchEnd = function(event) {
    // if (this.autoPreventDefault) {
        // event.preventDefault();
    // }
  let eventd = this.fixCoord(event);
  this.processInteractive(
    this.stage,
    eventd,
    this.processTouchEnd,
    this.strictMode
  );

  this.emit('touchend', eventd);
};

InteractionManager.prototype.processTouchEnd = function(displayObject, event) {
  if (displayObject._touchstarted) {
    displayObject._touchstarted = false;
    this.dispatchEvent(displayObject, 'touchend', event);
  }
};

InteractionManager.prototype.onTouchMove = function(event) {
  if (this.autoPreventDefault) {
    event.preventDefault();
  }
  let eventd = this.fixCoord(event);
  this.processInteractive(
    this.stage,
    eventd,
    this.processTouchMove,
    this.strictMode
  );

  this.emit('touchmove', eventd);
};

InteractionManager.prototype.processTouchMove = function(
  displayObject,
  event,
  hit
) {
  if ((!this.strictMode && displayObject._touchstarted) || hit) {
    this.dispatchEvent(displayObject, 'touchmove', event);
  }
};

InteractionManager.prototype.processInteractive = function(
  object,
  event,
  func,
  hitTest
) {
  /**
   *
   * @param {JC.DisplayObject} object 现实对象
   * @param {JC.InteractionData} event JC的交互数据对象
   * @param {Function} func 事件检测函数
   * @param {Boolean} shouldHit 是否需要检测
   * @return {Boolean} 是否检测到
   */
  function process(object, event, func, shouldHit) {
    let childs = object.childs;
    let hit = false;
    let i = childs.length - 1;
    while (i >= 0) {
      let cchilds = childs[i--];
      hit = false;
      if (cchilds.passEvent) continue;
      if (cchilds.childs.length > 0) {
        if (process(cchilds, event, func, shouldHit)) {
          shouldHit = false;
          hit = true;
        }
      }
      if (shouldHit && !hit) {
        hit = cchilds.contains(event.global);
        if (hit) {
          event.target = cchilds;
          shouldHit = false;
        }
      }
      func(cchilds, event, hit);
    }
    return hit;
  }
  process(object, event, func, hitTest);
};

InteractionManager.prototype.dispatchEvent = function(
  displayObject,
  eventString,
  event
) {
  if (!event.cancleBubble) {
    event.target = displayObject;
    event.type = eventString;

    displayObject.emit(eventString, event);

    let type = 'on' + eventString;
    if (displayObject[type]) {
      displayObject[type](event);
    }
  }
};

InteractionManager.prototype.fixCoord = function(event) {
  let eventd = new InteractionData();
  let offset = this.getPos(this.canvas);
  eventd.originalEvent = event;
  eventd.type = event.type;

  eventd.ratio = this.canvas.width / this.canvas.offsetWidth;
  if (event.touches) {
    eventd.touches = [];
    if (event.touches.length > 0) {
      for (let i = 0; i < event.touches.length; i++) {
        eventd.touches[i] = {};
        eventd.touches[i].global = new Point(
                    (event.touches[i].pageX - offset.x) * eventd.ratio,
                    (event.touches[i].pageY - offset.y) * eventd.ratio
                );
      }
      eventd.global = eventd.touches[0].global;
    }
  } else {
    eventd.global.x = (event.pageX - offset.x) * eventd.ratio;
    eventd.global.y = (event.pageY - offset.y) * eventd.ratio;
  }
  return eventd;
};

InteractionManager.prototype.getPos = function(obj) {
  let pos = new Point();
  if (obj.offsetParent) {
    let p = this.getPos(obj.offsetParent);
    pos.x = obj.offsetLeft + p.x;
    pos.y = obj.offsetTop + p.y;
  } else {
    pos.x = obj.offsetLeft;
    pos.y = obj.offsetTop;
  }
  return pos;
};

export {InteractionManager};
