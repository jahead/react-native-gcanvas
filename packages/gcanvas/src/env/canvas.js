import Element from '@flyskywhy/react-native-browser-polyfill/src/DOM/Element';
import GContext2D from '../context/2d/RenderingContext';
import GContextWebGL from '../context/webgl/RenderingContext';
import {PixelRatio} from 'react-native';

function sleepMs(ms) {
  for (var start = new Date(); new Date() - start <= ms; ) {}
}

export default class GCanvas extends Element {
  static GBridge = null;

  id = null;
  _context = null;
  _clientWidth = 100;
  _clientHeight = 150;
  _width = 100;
  _height = 150;

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

    this._clientWidth = style.width;
    this._clientHeight = style.height;
    this._width = style.width;
    this._height = style.height;
  }

  get clientWidth() {
    return this._clientWidth;
  }

  get clientHeight() {
    return this._clientHeight;
  }

  set clientWidth(value) {
    this._clientWidth = value;
  }

  set clientHeight(value) {
    this._clientHeight = value;
  }

  get width() {
    return this._width;
  }

  set width(value) {
    if (this._context && this._context.className === 'CanvasRenderingContext2D') {
      this._context.clearRect(0, 0, this._width, this._height);
    }
    this._width = value;
    GCanvas.GBridge.callResetGlViewport(this.id, this._width * PixelRatio.get(), this._height * PixelRatio.get());
  }

  get height() {
    return this._height;
  }

  set height(value) {
    if (this._context && this._context.className === 'CanvasRenderingContext2D') {
      this._context.clearRect(0, 0, this._width, this._height);
    }
    this._height = value;
    GCanvas.GBridge.callResetGlViewport(this.id, this._width * PixelRatio.get(), this._height * PixelRatio.get());
  }

  getContext(type) {
    let context = null;

    if (type.match(/webgl/i)) {
      context = new GContextWebGL(this);

      context.drawingBufferWidth = this._clientWidth * PixelRatio.get();
      context.drawingBufferHeight = this._clientHeight * PixelRatio.get();

      context.componentId = this.id;

      GCanvas.GBridge.callSetContextType(this.id, 1); // 0 for 2d; 1 for webgl

      if (!this._disableAutoSwap) {
        const render = () => {
          if (this._needRender) {
            GCanvas.GBridge.render(this.id);
            this._needRender = false;
          }
        };

        // On iOS, need run `GCanvas.GBridge.callSetContextType(this.id, 1);`
        // above then run `GCanvas.GBridge.render(this.id);` below to
        // let `plugin setClearColor` be invoked in refreshPlugin() of ios/BridgeModule/GCanvasModule.m
        // at the very first, otherwise can't `gl.clearColor` right away on canvas.getContext('webgl')
        // like https://github.com/flyskywhy/react-native-gcanvas/issues/24
        GCanvas.GBridge.render(this.id);

        setInterval(render, 16);
      }

      // On Android, need `sleepMs()` by `for(;;)` to wait enough (or wait until m_requestInitialize be true?) to
      // let `mProxy->SetClearColor` be invoked in renderLoop() of core/android/3d/view/grenderer.cpp
      // at the very first, otherwise can't `gl.clearColor` right away on canvas.getContext('webgl')
      // like https://github.com/flyskywhy/react-native-gcanvas/issues/24
      sleepMs(100);
    } else if (type.match(/2d/i)) {
      context = new GContext2D(this);

      context.componentId = this.id;

      const render = () => {
        const commands = context._drawCommands;
        context._drawCommands = '';

        if (commands !== '') {
          GCanvas.GBridge.render2d(this.id, commands);
        }
        this._needRender = false;
      };
      setInterval(render, 16); // 16ms is just enough for drawInRect as described with `execCommands` in `ios/BridgeModule/GCanvasPlugin.mm`

      GCanvas.GBridge.callSetContextType(this.id, 0);
    } else {
      throw new Error('not supported context ' + type);
    }

    this._context = context;
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
