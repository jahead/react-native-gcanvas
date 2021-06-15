import Element from '@flyskywhy/react-native-browser-polyfill/src/DOM/Element';
import GContext2D from '../context/2d/RenderingContext';
import GContextWebGL from '../context/webgl/RenderingContext';

export default class GCanvas extends Element {
  static GBridge = null;

  id = null;
  width = 100;
  height = 150;

  _needRender = true;

  constructor(id, {disableAutoSwap, style}) {
    super('canvas');
    this.id = id;

    this._disableAutoSwap = disableAutoSwap;
    if (disableAutoSwap) {
      this._swapBuffers = () => {
        GCanvas.GBridge.render(this.id);
      };
    }

    this.width = style.width;
    this.height = style.height;
  }

  getContext(type) {
    let context = null;

    if (type.match(/webgl/i)) {
      context = new GContextWebGL(this);

      context.componentId = this.id;

      if (!this._disableAutoSwap) {
        const render = () => {
          if (this._needRender) {
            GCanvas.GBridge.render(this.id);
            this._needRender = false;
          }
        };
        setInterval(render, 16);
      }

      GCanvas.GBridge.callSetContextType(this.id, 1); // 0 for 2d; 1 for webgl
    } else if (type.match(/2d/i)) {
      context = new GContext2D(this);

      context.componentId = this.id;

      const render = () => {
        const commands = context._drawCommands;
        context._drawCommands = '';

        GCanvas.GBridge.render2d(this.id, commands);
        this._needRender = false;
      };
      setInterval(render, 16); // 16ms is just enough for drawInRect as described with `execCommands` in `ios/BridgeModule/GCanvasPlugin.mm`

      GCanvas.GBridge.callSetContextType(this.id, 0);
    } else {
      throw new Error('not supported context ' + type);
    }

    return context;
  }

  // default 0.92 comes from https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toDataURL
  toDataURL(type = 'image/png', encoderOptions = 0.92) {
    let quality = encoderOptions < 0.0 ? 0.0 : encoderOptions;
    quality = quality > 1.0 ? 1.0 : quality;

    return GCanvas.GBridge.callToDataURL(this.id, type, quality);
  }

  reset() {
    GCanvas.GBridge.callReset(this.id);
  }
}
