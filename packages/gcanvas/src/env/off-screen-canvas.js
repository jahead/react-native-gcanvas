import GContext2D from '../context/2d/OffScreenRenderingContext';
import GContextWebGL from '../context/webgl/RenderingContext';

export default class GOffScreenCanvas {
  static GBridge = null;

  id = null;
  _context = null;

  _needRender = true;

  constructor(id) {
    this.id = id;
    this.className = 'GOffScreenCanvas';
  }

  getContext(type) {
    if (type.match(/webgl/i)) {
      this._context = new GContextWebGL(this);
      this._context.componentId = this.id;

      if (!this._disableAutoSwap) {
        const render = () => {
          if (this._needRender) {
            this._context.flushJsCommands2CallNative();
            this._needRender = false;
          }
        };
        setInterval(render, 16);
      }

      GOffScreenCanvas.GBridge.callSetContextType(this.id, 1); // 0 for 2d; 1 for webgl
    } else if (type.match(/2d/i)) {
      if (this.context2d) {
        this._context = this.context2d;
      } else {
        this.context2d = this._context = new GContext2D(this);
        this._context.componentId = this.id;
      }
    } else {
      throw new Error('not supported context ' + type);
    }

    return this._context;
  }

  get drawCommands() {
    return this.context2d._drawCommands;
  }

  get images() {
    return this.context2d.images;
  }
}
