import {Renderer} from './Renderer';
import {Scene} from './Scene';
import {Ticker} from '../utils/Ticker';

/**
 * @memberof JC
 * @param {object} options 舞台的配置项
 * @param {string} options.dom 舞台要附着的`canvas`元素
 * @param {number} [options.resolution] 设置舞台的分辨率，`默认为` 1
 * @param {boolean} [options.interactive] 设置舞台是否可交互，`默认为` true
 * @param {number} [options.width] 设置舞台的宽, `默认为` 附着的canvas.width
 * @param {number} [options.height] 设置舞台的高, `默认为` 附着的canvas.height
 * @param {string} [options.backgroundColor] 设置舞台的背景颜色，`默认为` ‘transparent’
 * @param {boolean} [options.enableFPS] 设置舞台是否记录帧率，`默认为` true
 */
function Application(options) {
  this.renderer = new Renderer(options);
  this.scene = new Scene();

  this.ticker = new Ticker(options.enableFPS);

  this.ticker.on('tick', (snippet) => {
    this.update(snippet);
  });

  this.ticker.start();
}

Application.prototype.update = function(snippet) {
  this.renderer.render(this.scene, snippet);
};

export {Application};
