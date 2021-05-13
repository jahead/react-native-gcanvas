import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {GCanvasView, GImage} from '@flyskywhy/react-native-gcanvas';
import {compile} from './compile-shader';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.state = {
      debugInfo: 'Click me to draw some on canvas',
    };

    // only useful on Android, because it's always true on iOS
    this.isGReactTextureViewReady = true;
  }

  initCanvas = (canvas) => {
    if (this.canvas) {
      return;
    }

    this.canvas = canvas;
    if (Platform.OS === 'web') {
      // canvas.width not equal canvas.clientWidth, so have to assign again
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
    }
    this.gl = this.canvas.getContext('webgl');
  };

  drawSome = () => {
    // On Android, sometimes this.isGReactTextureViewReady is false e.g.
    // navigate from a canvas page into a drawer item page with
    // react-navigation on Android, the canvas page will be maintain
    // mounted by react-navigation, then if you continually call
    // this drawSome() in some loop, it's wasting CPU and GPU,
    // if you don't care about such wasting, you can delete
    // this.isGReactTextureViewReady and related onIsReady.

    if (this.gl && this.isGReactTextureViewReady) {
      this.startTexture();
    }
  };

  // ref to https://github.com/flyskywhy/react-native-gcanvas/blob/f01fa6917c4a4938bf9b1bb8cab2358f93a7b4b4/examples/WeexGCanvasExample/examples/webgl/texture.vue
  loadImage = (url, callback) => {
    let image = Platform.OS === 'web' ? new Image() : new GImage();
    image.crossOrigin = true; // need this if image in not on same web site where APP runs
    image.onload = function () {
      callback(image);
    };
    image.src = url;
  };

  startTexture = () => {
    const gl = this.gl;
    const vShader = `
attribute vec2 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;
void main() {
  vTexCoord = aTexCoord;
  gl_Position = vec4(aPosition, 0, 1);
}`;
    const fShader = `
precision mediump float;
uniform sampler2D uSample;
varying vec2 vTexCoord;
void main() {
  gl_FragColor = texture2D(uSample, vTexCoord);
}`;
    this.loadImage(
      'https://img.alicdn.com/tfs/TB1apiEb8HH8KJjy0FbXXcqlpXa-1024-1024.png',
      function (image) {
        const {
          program,
          attributes,
          uniforms,
          fillElements,
          drawArrays,
          drawElements,
          createElementsBuffer,
        } = compile({
          vShader,
          fShader,
          gl,
        });
        fillElements(createElementsBuffer([0, 1, 2, 0, 2, 3]));
        attributes.aPosition.fill(
          attributes.aPosition.createBuffer([-1, 1, -1, -1, 1, -1, 1, 1]),
        );
        attributes.aTexCoord.fill(
          attributes.aTexCoord.createBuffer([0, 1, 0, 0, 1, 0, 1, 1]),
        );
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        const tex = uniforms.uSample.createTexture(image);
        uniforms.uSample.fill(tex);
        function render() {
          gl.clear(gl.COLOR_BUFFER_BIT);
          drawElements(6);
        }
        function tick() {
          render();
          // setTimeout(tick, 100);
        }
        // tick();
        setTimeout(tick, 1000);
      },
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.drawSome}>
          <Text style={styles.welcome}>{this.state.debugInfo}</Text>
        </TouchableHighlight>
        <View
          style={{
            backgroundColor:
              'black' /* GCanvasView need this black to render right color */,
          }}>
          {Platform.OS === 'web' ? (
            <canvas
              ref={this.initCanvas}
              style={
                {
                  width: 200,
                  height: 300,
                } /* canvas with react-native-web can't use width and height in styles.gcanvas */
              }
            />
          ) : (
            <GCanvasView
              onCanvasCreate={this.initCanvas}
              onIsReady={(value) => (this.isGReactTextureViewReady = value)}
              style={styles.gcanvas}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  gcanvas: {
    width: 200,
    height: 300,
    // backgroundColor: '#FF000030', // TextureView doesn't support displaying a background drawable since Android API 24
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
  },
});
