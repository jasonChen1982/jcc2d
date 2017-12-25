// import {Vector2} from 'three';
import {Point} from '../math/Point';

/**
 * Holds all information related to an Interaction event
 *
 * @class
 */
class InteractionData {
  /**
   * InteractionData constructor
   */
  constructor() {
    /**
     * This point stores the global coords of where the touch/mouse event happened
     *
     * @member {Point}
     */
    this.global = new Point(-100000, -100000);

    /**
     * The target DisplayObject that was interacted with
     *
     * @member {Object3D}
     */
    this.target = null;

    /**
     * When passed to an event handler, this will be the original DOM Event that was captured
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
     * @see https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent
     * @member {MouseEvent|TouchEvent|PointerEvent}
     */
    this.originalEvent = null;

    /**
     * Unique identifier for this interaction
     *
     * @member {number}
     */
    this.identifier = null;

    /**
     * Indicates whether or not the pointer device that created the event is the primary pointer.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary
     * @type {Boolean}
     */
    this.isPrimary = false;

    /**
     * Indicates which button was pressed on the mouse or pointer device to trigger the event.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
     * @type {number}
     */
    this.button = 0;

    /**
     * Indicates which buttons are pressed on the mouse or pointer device when the event is triggered.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
     * @type {number}
     */
    this.buttons = 0;

    /**
     * The width of the pointer's contact along the x-axis, measured in CSS pixels.
     * radiusX of TouchEvents will be represented by this value.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width
     * @type {number}
     */
    this.width = 0;

    /**
     * The height of the pointer's contact along the y-axis, measured in CSS pixels.
     * radiusY of TouchEvents will be represented by this value.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height
     * @type {number}
     */
    this.height = 0;

    /**
     * The angle, in degrees, between the pointer device and the screen.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX
     * @type {number}
     */
    this.tiltX = 0;

    /**
     * The angle, in degrees, between the pointer device and the screen.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY
     * @type {number}
     */
    this.tiltY = 0;

    /**
     * The type of pointer that triggered the event.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType
     * @type {string}
     */
    this.pointerType = null;

    /**
     * Pressure applied by the pointing device during the event. A Touch's force property
     * will be represented by this value.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure
     * @type {number}
     */
    this.pressure = 0;

    /**
     * From TouchEvents (not PointerEvents triggered by touches), the rotationAngle of the Touch.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Touch/rotationAngle
     * @type {number}
     */
    this.rotationAngle = 0;

    /**
     * Twist of a stylus pointer.
     * @see https://w3c.github.io/pointerevents/#pointerevent-interface
     * @type {number}
     */
    this.twist = 0;

    /**
     * Barrel pressure on a stylus pointer.
     * @see https://w3c.github.io/pointerevents/#pointerevent-interface
     * @type {number}
     */
    this.tangentialPressure = 0;
  }

  /**
   * The unique identifier of the pointer. It will be the same as `identifier`.
   * @readonly
   * @member {number}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId
   */
  get pointerId() {
    return this.identifier;
  }

  /**
   * Copies properties from normalized event data.
   *
   * @param {Touch|MouseEvent|PointerEvent} event The normalized event data
   * @private
   */
  _copyEvent(event) {
    // isPrimary should only change on touchstart/pointerdown, so we don't want to overwrite
    // it with "false" on later events when our shim for it on touch events might not be
    // accurate
    if (event.isPrimary) {
      this.isPrimary = true;
    }
    this.button = event.button;
    this.buttons = event.buttons;
    this.width = event.width;
    this.height = event.height;
    this.tiltX = event.tiltX;
    this.tiltY = event.tiltY;
    this.pointerType = event.pointerType;
    this.pressure = event.pressure;
    this.rotationAngle = event.rotationAngle;
    this.twist = event.twist || 0;
    this.tangentialPressure = event.tangentialPressure || 0;
  }

  /**
   * Resets the data for pooling.
   *
   * @private
   */
  _reset() {
    // isPrimary is the only property that we really need to reset - everything else is
    // guaranteed to be overwritten
    this.isPrimary = false;
  }
}

export default InteractionData;
