import {Point} from '../math/Point';

/**
 * 事件系统的事件消息对象的基本类型
 *
 * @class
 * @memberof JC
 */
function InteractionData() {
  /**
   * 转换到canvas坐标系统的事件触发点
   *
   * @member {JC.Point}
   */
  this.global = new Point(-100000, -100000);

  /**
   * 事件源
   *
   * @member {JC.DisplayObject}
   */
  this.target = null;

  /**
   * 浏览器的原始事件对象
   *
   * @member {Event}
   */
  this.originalEvent = null;

  /**
   * 在canvas内阻止事件冒泡
   *
   * @member {Boolean}
   */
  this.cancleBubble = false;

  /**
   * canvas视窗和页面坐标的兑换比例
   *
   * @member {Number}
   */
  this.ratio = 1;

  /**
   * 事件类型
   *
   * @member {String}
   */
  this.type = '';
}
InteractionData.prototype.clone = function() {
  let evd = new InteractionData();
  evd.originalEvent = this.originalEvent;
  evd.ratio = this.ratio;

  if (this.touches) {
    evd.touches = [];
    if (this.touches.length > 0) {
      for (let i = 0; i < this.touches.length; i++) {
        evd.touches[i] = {};
        evd.touches[i].global = this.touches[i].global.clone();
      }
      evd.global = evd.touches[0].global;
    }
  } else {
    evd.global = this.global.clone();
  }
  return evd;
};

export {InteractionData};
