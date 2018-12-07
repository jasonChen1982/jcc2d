
import {Container} from './Container';
// import {Utils} from '../utils/Utils';

/**
 * 舞台对象，继承至 Container
 * @class
 * @extends JC.Container
 * @memberof JC
 */
function Scene() {
  Container.call(this);
}

Scene.prototype = Object.create(Container.prototype);

/**
 * 更新自身的透明度可矩阵姿态更新，并触发后代同步更新。
 * Scene 的 updatePosture 会接收一个来自 Renderer 的 rootMatrix。
 *
 * @private
 * @param {Matrix} [rootMatrix] 初始矩阵，由 Renderer 直接传入。
 */
Scene.prototype.updatePosture = function(rootMatrix) {
  this.emit('preposture');
  if (this.souldSort) this._sortList();
  this.updateTransform(rootMatrix);

  let i = 0;
  const l = this.childs.length;
  while (i < l) {
    this.childs[i].updatePosture();
    i++;
  }
  this.emit('postposture');
};

export {Scene};
