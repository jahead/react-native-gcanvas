# react-native-gcanvas

[![npm version](http://img.shields.io/npm/v/@flyskywhy/react-native-gcanvas.svg?style=flat-square)](https://npmjs.org/package/@flyskywhy/react-native-gcanvas "View this project on npm")
[![npm downloads](http://img.shields.io/npm/dm/@flyskywhy/react-native-gcanvas.svg?style=flat-square)](https://npmjs.org/package/@flyskywhy/react-native-gcanvas "View this project on npm")
[![npm licence](http://img.shields.io/npm/l/@flyskywhy/react-native-gcanvas.svg?style=flat-square)](https://npmjs.org/package/@flyskywhy/react-native-gcanvas "View this project on npm")
[![Platform](https://img.shields.io/badge/platform-ios%20%7C%20android-989898.svg?style=flat-square)](https://npmjs.org/package/@flyskywhy/react-native-gcanvas "View this project on npm")

[GCanvas](https://alibaba.github.io/GCanvas/) is a cross-platform rendering engine for mobile devices developed by Alibaba. It is written with C++ based on OpenGL ES, so it can provide high performance 2D/WebGL rendering capabilities for JavaScript runtime. It also has browser-like canvas APIs, so it's very convenient and flexiable for use, especially for web developers.

Supported operating systems are Android 4.0+ (API 14) and  iOS 8.0+.

Since Alibaba [feat: delete weex bridge & reactive bridge](https://github.com/alibaba/GCanvas/commit/1bbee40a16c0c5da58698e2892ba33f836eedb70), here comes this `@flyskywhy/react-native-gcanvas` package.

`@flyskywhy/react-native-gcanvas` only support render2d canvas as described in `Java_com_taobao_gcanvas_GCanvasJNI_render()` of `core/android/GCanvasJNI.cpp`.

- [Getting Started](#getting-started)
- [Examples](#examples)
- [Documentation](#documentation)
- [Built With](#build-with)
- [Opening Issues](#opening-issues)
- [Contributing](#contributing)
- [License](#license)

## Performance Test Result

### `setState` vs `canvas` On react-native-web
With 200 circles backgroundColor generate (1 `ms`) and render continually, the render `ms` and final `fps` with Chrome Performance on Windows:

    setState  80 ms        means 12 fps  (stuck for human eyes)
    canvas    1.5 ms       means 400 fps (smooth for human eyes)

### `setNativeProps` vs `expo-2d-context` vs `react-native-gcanvas` On react-native
With 800 circles backgroundColor generate and render continually, the final UI `fps` and JS `fps` with react-native developer menu Perf Monitor on an old `Huawei Honor 6 Play` smartphone released in 2017 (Mediatek MT6737T 1.4 GHz, 2 GB RAM, Android 6):

    setNativeProps        UI: 20 fps       JS: 1 fps  (stuck for human eyes)
    expo-2d-context       UI: 56 fps       JS: 1 fps  (stuck for human eyes)
    react-native-gcanvas  UI: 56 fps       JS: 20 fps (smooth for human eyes)

On an old iPhone 7:

With 800 circles backgroundColor generate and render continually

    setNativeProps        UI: 60 fps       JS: 15 fps (smooth for human eyes)
    react-native-gcanvas  UI: 20 fps       JS: 59 fps (stuck for human eyes)

    // if render2d sync by dispatch_main_sync_safe with execCommandById() in ios/BridgeModule/GCanvasModule.m
    react-native-gcanvas  UI: 40 fps       JS: 58 fps (very stuck for human eyes)

With 1400 circles backgroundColor generate and render continually

    setNativeProps        UI: 59 fps       JS: 7 fps  (smooth for human eyes)
    react-native-gcanvas  UI: 10 fps       JS: 58 fps (stuck for human eyes)

    // if render2d sync by dispatch_main_sync_safe with execCommandById() in ios/BridgeModule/GCanvasModule.m
    react-native-gcanvas  UI: 40 fps       JS: 15 fps (very very stuck for human eyes)


## Convenient With Browser-like canvas APIs
[gl-react](https://gl-react-cookbook.surge.sh/pixeleditor?menu=true) maybe can deal with the performance problem, but it need developer directly code with GLSL (OpenGL Shading Language), and there is no way to let many React components developed by browser-like canvas APIs be easily ported to React Native.

[react-three-fiber](https://github.com/pmndrs/react-three-fiber) maybe can deal with the performance problem, but [memory leak when meshes update](https://github.com/pmndrs/react-three-fiber/issues/263), [Leaking WebGLRenderer and more when unmounting](https://github.com/pmndrs/react-three-fiber/issues/514), [Suggestion: Dispose of renderer context when canvas is destroyed?](https://github.com/pmndrs/react-three-fiber/issues/132), and there is no way to let many React components developed by browser-like canvas APIs be easily ported to React Native.

[expo-2d-context](https://github.com/expo/expo-2d-context) can let many React components developed by browser-like canvas APIs be easily ported to React Native, but it need ctx.flush() that not belongs to canvas 2d APIs, and it's performance is too low.

Ref to [Experiments with High Performance Animation in React Native](https://engineering.salesforce.com/experiments-with-high-performance-animation-in-react-native-80a0cb7052b0), it use many ways include `setNativeProps` and [React Native NanoVG](https://github.com/robclouth/react-native-art-nanovg). Maybe `nanovg` can deal with the performance problem, but for now (2020.12) there is no React Native canvas component using  `nanovg` to let many React components developed by browser-like canvas APIs be easily ported to React Native.

So for now (2020.12), `@flyskywhy/react-native-gcanvas` is the best choice, at least on Android (performance on iOS is lower than setNativeProps).

### canvas projects ported from React to React Native
* [react-native-particles-bg](https://github.com/flyskywhy/react-native-particles-bg) ported from [particles-bg](https://github.com/lindelof/particles-bg) which based on [Proton](https://github.com/drawcall/Proton). You can also compare it with [react-native-particles-webgl](https://github.com/flyskywhy/react-native-particles-webgl) which based on memory leaking [react-three-fiber](https://github.com/pmndrs/react-three-fiber).

## Getting Started
### react-native
Support RN >= 0.60

    npm install @flyskywhy/react-native-gcanvas --save

#### Android
Add below into `android/settings.gradle`
```
include ':android:gcanvas_library'
project(':android:gcanvas_library').projectDir = new File(rootProject.projectDir, '../node_modules/@flyskywhy/react-native-gcanvas/android/gcanvas_library')
include ':android:bridge_spec'
project(':android:bridge_spec').projectDir = new File(rootProject.projectDir, '../node_modules/@flyskywhy/react-native-gcanvas/android/bridge_spec')
include ':android:adapters:gcanvas_imageloader_fresco'
project(':android:adapters:gcanvas_imageloader_fresco').projectDir = new File(rootProject.projectDir, '../node_modules/@flyskywhy/react-native-gcanvas/android/adapters/gcanvas_imageloader_fresco')
include ':android:adapters:bridge_adapter'
project(':android:adapters:bridge_adapter').projectDir = new File(rootProject.projectDir, '../node_modules/@flyskywhy/react-native-gcanvas/android/adapters/bridge_adapter')
```

Add below into `react-native.config.js`
```
const path = require('path');

module.exports = {
  dependencies: {
    '@flyskywhy/react-native-gcanvas': {
      platforms: {
        ios: null, // will open ios after test by me or PR by you
        android: {
          packageImportPath: 'import com.taobao.gcanvas.bridges.rn.GReactPackage;',
        },
      },
    },
  },
};
```

#### iOS

Add below into `ios/Podfile`
```
  pod "GCanvas", :path => "../node_modules/@flyskywhy/react-native-gcanvas/GCanvas.podspec"
```
    cd YOUR_PROJECT/ios
    pod install


## Examples
We take react-native as example, code snippet of context 2d using `GCanvas`.
```javascript
import React, {Component} from 'react';
import {
  requireNativeComponent,
  findNodeHandle,
  NativeModules,
  PixelRatio,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {GCanvasView} from '@flyskywhy/react-native-gcanvas';
import {enable, ReactNativeBridge, Image as GImage} from "@flyskywhy/react-native-gcanvas/packages/gcanvas";
ReactNativeBridge.GCanvasModule = NativeModules.GCanvasModule;
ReactNativeBridge.Platform = Platform;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.scale = Platform === 'ios' ? 1 : PixelRatio.get();

    // only useful on Android, because on iOS is always true
    this.isGReactTextureViewReady = true;
  }

  componentDidMount() {
    if (Platform.OS === 'web') {
      setTimeout(() => {
        this.initCanvas();
      }, 1000);
    }
  }

  initCanvas = () => {
    if (Platform.OS === 'web') {
      let canvas = this.refCanvas;
      // canvas.width not equal canvas.clientWidth, so have to assign again
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      this.ctx = canvas.getContext('2d');
    } else {
      let canvas = enable(
        {
          ref: '' + findNodeHandle(this.refCanvas),
          style: {
            width: styles.gcanvas.width,
            height: styles.gcanvas.height,
          },
        },
        {bridge: ReactNativeBridge},
      );

      this.ctx = canvas.getContext('2d');
    }
  };

  drawSome = () => {
    // On Android, sometimes this.isGReactTextureViewReady is false e.g.
    // navigate from a canvas page into a drawer item page with
    // react-navigation on Android, the canvas page will be maintain
    // mounted by react-navigation, then if you continually call
    // this drawSome() in some loop, it's wasting CPU and GPU,
    // if you don't care about such wasting, you can delete
    // this.isGReactTextureViewReady and related onIsReady.
    if (this.ctx && this.isGReactTextureViewReady) {
      this.ctx.beginPath();

      //rect
      this.ctx.fillStyle = 'red';
      this.ctx.fillRect(0, 0, 50 * this.scale, 50 * this.scale);

      //rect
      this.ctx.fillStyle = 'green';
      this.ctx.fillRect(50 * this.scale, 50 * this.scale, 50 * this.scale, 50 * this.scale);

      this.ctx.fill();

      this.ctx.beginPath();

      //circle
      this.ctx.fillStyle = 'blue';
      this.ctx.moveTo(100 * this.scale, 150 * this.scale);
      this.ctx.arc(100 * this.scale, 150 * this.scale, 50 * this.scale, 0, Math.PI * 2, true);

      this.ctx.fill();

      let image = new GImage();
      image.onload = function(){
        this.ctx.drawImage(image, 150 * this.scale, 0);
      }
      image.src = '//gw.alicdn.com/tfs/TB1KwRTlh6I8KJjy0FgXXXXzVXa-225-75.png';
    }
  };

  render() {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.container}>
          <canvas
            ref={(view) => (this.refCanvas = view)}
            style={styles.gcanvas}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <GCanvasView
            ref={(view) => (this.refCanvas = view)}
            onLayout={this.initCanvas}
            onIsReady={(value) => (this.isGReactTextureViewReady = value)}
            style={styles.gcanvas}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  gcanvas: {
    top: 20,
    width: 200,
    height :300,
    // backgroundColor: '#FF000030', // TextureView doesn't support displaying a background drawable since Android API 24
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
```

## Alibaba Distribution
###  GCanvas

* iOS  [GCanvas](https://cocoapods.org/pods/GCanvas)   [![CocoaPods Version](https://badge.fury.io/co/GCanvas.svg)](https://badge.fury.io/co/GCanvas)

* Android  com.taobao.gcanvas:core:1.1.0(publishing)

### GCanvas Weex Component

* iOS [WeexGcanvas](https://cocoapods.org/pods/WeexGcanvas)   [![CocoaPods Version](https://badge.fury.io/co/WeexGcanvas.svg)](https://badge.fury.io/co/GCanvas)

* Android com.taobao.gcanvas.bridges:weex-brigde 1.1.0 (publishing)

### GCanvas NPM Package
* [@gcanvas/core](https://www.npmjs.com/package/@gcanvas/core)   [![npm version](https://badge.fury.io/js/%40gcanvas%2Fcore.svg)](https://www.npmjs.com/package/@gcanvas/core)


## Features
- Cross-platform, support popular iOS and Android.
- High performance, accelerate graphic draw by OpenGL ES.
- Provide JavaScript runtime,  such as [Weex](https://github.com/apache/incubator-weex) and [ReactNative](https://github.com/facebook/react-native/).  convenient to use JavaScript API like HTML canvas.
- Scalable Architecture, easy to implement a GCanvas bridge by yourself following the guide [Custom Native Bridge](https://alibaba.github.io/GCanvas/docs/Custom%20Bridge.html) .
- Small size.


## Introduction

See the  [Introduction to GCanvas](https://alibaba.github.io/GCanvas/docs/Developer's%20Guide.html) for a detailed  introduction to GCanvas.

### Weex
Follow [Weex Setup Guide](https://alibaba.github.io/GCanvas/docs/Integrate%20GCanvas%20on%20Weex.html) to integrate GCanvas on Weex

### JavaScript
Try our [Playground](https://alibaba.github.io/GCanvas/playground.html).
GCanvas has browser-like canvas APIs, so almost all of the APIs are exactly same as HTML5 canvas. At this moment, we have already supported 90% of 2D APIs and 99% of WebGL APIs. You can find out those informations in [2D  APIs](https://alibaba.github.io/GCanvas/docs/Graphics%202D.html) and [WebGL APIs](https://alibaba.github.io/GCanvas/docs/WebGL.html).


## Documentation
Check [Documentation](https://alibaba.github.io/GCanvas/docs/Introduction.html) for more information.


## Built With

* [Freetype](https://www.freetype.org/) - Used for font rendering on Android


## Changelog

New Changelog record in [CHANGELOG](./docs/Changelog.md) for details.

## Open Issues
If you encounter a bug with GCanvas we would like to hear about it. Search the [existing issues]() and try to make sure your problem doesn’t already exist before opening a new issue. It’s helpful if you include the version of GCanvas  and OS you’re using. Please include a stack trace and reduced repro case when appropriate, too.

## Contributing

Please read [CONTRIBUTING](./docs/Contributing.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* GCanvas Open Source Team
* Li Zheng <flyskywhy@gmail.com>

## License

This project is licensed under the Apache License - see the [LICENSE](./docs/LICENSE.md) file for details
