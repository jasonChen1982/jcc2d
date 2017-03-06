import { FrameBuffer } from './FrameBuffer';
import { Container } from '../core/display/Container';
import { Matrix } from '../core/math/Matrix';


function BlurFilter(blurX, blurY, quality) {
    Container.call(this);

    if (isNaN(blurX) || blurX < 0) blurX = 0;
    if (isNaN(blurY) || blurY < 0) blurY = 0;
    if (isNaN(quality) || quality < 1) quality = 1;

    this.frameBuffer = new FrameBuffer();

    /**
     * x轴的模糊值
     * @property blurX
     * @default 0
     * @type Number
     **/
    this.blurX = blurX | 0;

    /**
     * y轴的模糊值
     * @property blurY
     * @default 0
     * @type Number
     **/
    this.blurY = blurY | 0;

    /**
     * 模糊的质量，模糊计算会被递归多少次
     * @property quality
     * @default 1
     * @type Number
     **/
    this.quality = quality | 0;

    /**
     * 下一帧的图像需要更新
     * @property needUpdateBuffer
     * @default false
     * @type Boolean
     **/
    this.needUpdateBuffer = true;

    /**
     * 每一帧渲染都重新绘制
     * @property autoUpdateBuffer
     * @default false
     * @type Boolean
     **/
    this.autoUpdateBuffer = false;

    /**
     * 时候给帧缓冲区加padding
     * @property padding
     * @default false
     * @type Boolean
     **/
    this.padding = false;
}
BlurFilter.prototype = Object.create( Container.prototype );

/**
 * 对渲染对象进行x、y轴同时设置模糊半径
 *
 * @member {number}
 * @name blur
 * @memberof JC.BlurFilter#
 */
Object.defineProperty(BlurFilter.prototype, 'blur', {
    get: function() {
        return this.blurX;
    },
    set: function(blur) {
        this.blurX = this.blurY = blur;
    }
});

BlurFilter.prototype.updatePosture = function(snippet) {
    if (!this._ready) return;
    if (this.souldSort) this._sortList();
    snippet = this.timeScale * snippet;
    if (!this.paused) this.updateAnimation(snippet);

    this.updateTransform();

    if (this.needUpdateBuffer || this.autoUpdateBuffer) {
        this.cacheMatrix = this.worldTransform;
        this.worldTransform = __tmpMatrix.identity();
        this._upc(snippet);

        this.calculateBounds();
        this.__o = this.bounds.getRectangle();
        this.__o.px = this.__o.py = 0;
        if (this.padding) {
            this.__o.px = this.blurX;
            this.__o.py = this.blurY;
        }
        this.worldTransform.translate(-this.__o.x + this.__o.px, -this.__o.y + this.__o.py);
        this._upc(0);

        this.worldTransform = this.cacheMatrix;
    } else {
        this._upc(snippet);
    }
};

BlurFilter.prototype._upc = function(snippet) {
    for (var i = 0, l = this.childs.length; i < l; i++) {
        var child = this.childs[i];
        child.updatePosture(snippet);
    }
};

BlurFilter.prototype.render = function(ctx) {
    if (this.needUpdateBuffer || this.autoUpdateBuffer) {
        var i = 0,
            l = this.childs.length,
            child = null;

        this.frameBuffer.clear();
        this.frameBuffer.setSize(this.__o);
        for (i = 0; i < l; i++) {
            child = this.childs[i];
            if (!child.isVisible() || !child._ready) continue;
            child.render(this.frameBuffer.ctx);
        }
        this._applyFilter(this.frameBuffer.getBuffer());

        this.needUpdateBuffer = false;
    }
    this.renderMe(ctx, this.__o.x - this.__o.px, this.__o.y - this.__o.py, this.frameBuffer.width, this.frameBuffer.height);
};

BlurFilter.prototype.renderMe = function(ctx ,x ,y, w, h) {
    this.setTransform(ctx);
    ctx.drawImage(this.frameBuffer.putBuffer(), 0, 0, w, h, x, y, w, h);
};


var __tmpMatrix = new Matrix();


var MUL_TABLE = [1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265, 497, 469, 443, 421, 25, 191, 365, 349, 335, 161, 155, 149, 9, 278, 269, 261, 505, 245, 475, 231, 449, 437, 213, 415, 405, 395, 193, 377, 369, 361, 353, 345, 169, 331, 325, 319, 313, 307, 301, 37, 145, 285, 281, 69, 271, 267, 263, 259, 509, 501, 493, 243, 479, 118, 465, 459, 113, 446, 55, 435, 429, 423, 209, 413, 51, 403, 199, 393, 97, 3, 379, 375, 371, 367, 363, 359, 355, 351, 347, 43, 85, 337, 333, 165, 327, 323, 5, 317, 157, 311, 77, 305, 303, 75, 297, 294, 73, 289, 287, 71, 141, 279, 277, 275, 68, 135, 67, 133, 33, 262, 260, 129, 511, 507, 503, 499, 495, 491, 61, 121, 481, 477, 237, 235, 467, 232, 115, 457, 227, 451, 7, 445, 221, 439, 218, 433, 215, 427, 425, 211, 419, 417, 207, 411, 409, 203, 202, 401, 399, 396, 197, 49, 389, 387, 385, 383, 95, 189, 47, 187, 93, 185, 23, 183, 91, 181, 45, 179, 89, 177, 11, 175, 87, 173, 345, 343, 341, 339, 337, 21, 167, 83, 331, 329, 327, 163, 81, 323, 321, 319, 159, 79, 315, 313, 39, 155, 309, 307, 153, 305, 303, 151, 75, 299, 149, 37, 295, 147, 73, 291, 145, 289, 287, 143, 285, 71, 141, 281, 35, 279, 139, 69, 275, 137, 273, 17, 271, 135, 269, 267, 133, 265, 33, 263, 131, 261, 130, 259, 129, 257, 1];



var SHG_TABLE = [0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13, 14, 14, 14, 14, 10, 13, 14, 14, 14, 13, 13, 13, 9, 14, 14, 14, 15, 14, 15, 14, 15, 15, 14, 15, 15, 15, 14, 15, 15, 15, 15, 15, 14, 15, 15, 15, 15, 15, 15, 12, 14, 15, 15, 13, 15, 15, 15, 15, 16, 16, 16, 15, 16, 14, 16, 16, 14, 16, 13, 16, 16, 16, 15, 16, 13, 16, 15, 16, 14, 9, 16, 16, 16, 16, 16, 16, 16, 16, 16, 13, 14, 16, 16, 15, 16, 16, 10, 16, 15, 16, 14, 16, 16, 14, 16, 16, 14, 16, 16, 14, 15, 16, 16, 16, 14, 15, 14, 15, 13, 16, 16, 15, 17, 17, 17, 17, 17, 17, 14, 15, 17, 17, 16, 16, 17, 16, 15, 17, 16, 17, 11, 17, 16, 17, 16, 17, 16, 17, 17, 16, 17, 17, 16, 17, 17, 16, 16, 17, 17, 17, 16, 14, 17, 17, 17, 17, 15, 16, 14, 16, 15, 16, 13, 16, 15, 16, 14, 16, 15, 16, 12, 16, 15, 16, 17, 17, 17, 17, 17, 13, 16, 15, 17, 17, 17, 16, 15, 17, 17, 17, 16, 15, 17, 17, 14, 16, 17, 17, 16, 17, 17, 16, 15, 17, 16, 14, 17, 16, 15, 17, 16, 17, 17, 16, 17, 15, 16, 17, 14, 17, 16, 15, 17, 16, 17, 13, 17, 16, 17, 17, 16, 17, 14, 17, 16, 17, 16, 17, 16, 17, 9];

/* eslint-disable */
BlurFilter.prototype._applyFilter = function(imageData) {

    var radiusX = this.blurX >> 1;
    if (isNaN(radiusX) || radiusX < 0) return false;
    var radiusY = this.blurY >> 1;
    if (isNaN(radiusY) || radiusY < 0) return false;
    if (radiusX == 0 && radiusY == 0) return false;

    var iterations = this.quality;
    if (isNaN(iterations) || iterations < 1) iterations = 1;
    iterations |= 0;
    if (iterations > 3) iterations = 3;
    if (iterations < 1) iterations = 1;

    var px = imageData.data;
    var x = 0,
        y = 0,
        i = 0,
        p = 0,
        yp = 0,
        yi = 0,
        yw = 0,
        r = 0,
        g = 0,
        b = 0,
        a = 0,
        pr = 0,
        pg = 0,
        pb = 0,
        pa = 0;

    var divx = (radiusX + radiusX + 1) | 0;
    var divy = (radiusY + radiusY + 1) | 0;
    var w = imageData.width | 0;
    var h = imageData.height | 0;

    var w1 = (w - 1) | 0;
    var h1 = (h - 1) | 0;
    var rxp1 = (radiusX + 1) | 0;
    var ryp1 = (radiusY + 1) | 0;

    var ssx = { r: 0, b: 0, g: 0, a: 0 };
    var sx = ssx;
    for (i = 1; i < divx; i++) {
        sx = sx.n = { r: 0, b: 0, g: 0, a: 0 };
    }
    sx.n = ssx;

    var ssy = { r: 0, b: 0, g: 0, a: 0 };
    var sy = ssy;
    for (i = 1; i < divy; i++) {
        sy = sy.n = { r: 0, b: 0, g: 0, a: 0 };
    }
    sy.n = ssy;

    var si = null;


    var mtx = MUL_TABLE[radiusX] | 0;
    var stx = SHG_TABLE[radiusX] | 0;
    var mty = MUL_TABLE[radiusY] | 0;
    var sty = SHG_TABLE[radiusY] | 0;

    while (iterations-- > 0) {

        yw = yi = 0;
        var ms = mtx;
        var ss = stx;
        for (y = h; --y > -1;) {
            r = rxp1 * (pr = px[(yi) | 0]);
            g = rxp1 * (pg = px[(yi + 1) | 0]);
            b = rxp1 * (pb = px[(yi + 2) | 0]);
            a = rxp1 * (pa = px[(yi + 3) | 0]);

            sx = ssx;

            for (i = rxp1; --i > -1;) {
                sx.r = pr;
                sx.g = pg;
                sx.b = pb;
                sx.a = pa;
                sx = sx.n;
            }

            for (i = 1; i < rxp1; i++) {
                p = (yi + ((w1 < i ? w1 : i) << 2)) | 0;
                r += (sx.r = px[p]);
                g += (sx.g = px[p + 1]);
                b += (sx.b = px[p + 2]);
                a += (sx.a = px[p + 3]);

                sx = sx.n;
            }

            si = ssx;
            for (x = 0; x < w; x++) {
                px[yi++] = (r * ms) >>> ss;
                px[yi++] = (g * ms) >>> ss;
                px[yi++] = (b * ms) >>> ss;
                px[yi++] = (a * ms) >>> ss;

                p = ((yw + ((p = x + radiusX + 1) < w1 ? p : w1)) << 2);

                r -= si.r - (si.r = px[p]);
                g -= si.g - (si.g = px[p + 1]);
                b -= si.b - (si.b = px[p + 2]);
                a -= si.a - (si.a = px[p + 3]);

                si = si.n;

            }
            yw += w;
        }

        ms = mty;
        ss = sty;
        for (x = 0; x < w; x++) {
            yi = (x << 2) | 0;

            r = (ryp1 * (pr = px[yi])) | 0;
            g = (ryp1 * (pg = px[(yi + 1) | 0])) | 0;
            b = (ryp1 * (pb = px[(yi + 2) | 0])) | 0;
            a = (ryp1 * (pa = px[(yi + 3) | 0])) | 0;

            sy = ssy;
            for (i = 0; i < ryp1; i++) {
                sy.r = pr;
                sy.g = pg;
                sy.b = pb;
                sy.a = pa;
                sy = sy.n;
            }

            yp = w;

            for (i = 1; i <= radiusY; i++) {
                yi = (yp + x) << 2;

                r += (sy.r = px[yi]);
                g += (sy.g = px[yi + 1]);
                b += (sy.b = px[yi + 2]);
                a += (sy.a = px[yi + 3]);

                sy = sy.n;

                if (i < h1) {
                    yp += w;
                }
            }

            yi = x;
            si = ssy;
            if (iterations > 0) {
                for (y = 0; y < h; y++) {
                    p = yi << 2;
                    px[p + 3] = pa = (a * ms) >>> ss;
                    if (pa > 0) {
                        px[p] = ((r * ms) >>> ss);
                        px[p + 1] = ((g * ms) >>> ss);
                        px[p + 2] = ((b * ms) >>> ss);
                    } else {
                        px[p] = px[p + 1] = px[p + 2] = 0;
                    }

                    p = (x + (((p = y + ryp1) < h1 ? p : h1) * w)) << 2;

                    r -= si.r - (si.r = px[p]);
                    g -= si.g - (si.g = px[p + 1]);
                    b -= si.b - (si.b = px[p + 2]);
                    a -= si.a - (si.a = px[p + 3]);

                    si = si.n;

                    yi += w;
                }
            } else {
                for (y = 0; y < h; y++) {
                    p = yi << 2;
                    px[p + 3] = pa = (a * ms) >>> ss;
                    if (pa > 0) {
                        pa = 255 / pa;
                        px[p] = ((r * ms) >>> ss) * pa;
                        px[p + 1] = ((g * ms) >>> ss) * pa;
                        px[p + 2] = ((b * ms) >>> ss) * pa;
                    } else {
                        px[p] = px[p + 1] = px[p + 2] = 0;
                    }

                    p = (x + (((p = y + ryp1) < h1 ? p : h1) * w)) << 2;

                    r -= si.r - (si.r = px[p]);
                    g -= si.g - (si.g = px[p + 1]);
                    b -= si.b - (si.b = px[p + 2]);
                    a -= si.a - (si.a = px[p + 3]);

                    si = si.n;

                    yi += w;
                }
            }
        }

    }
    return true;
};

export { BlurFilter };
