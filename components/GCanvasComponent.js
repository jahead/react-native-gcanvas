import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import {
  NativeEventEmitter,
  NativeModules,
  Platform,
  Text,
  View,
  findNodeHandle,
  requireNativeComponent,
} from 'react-native';
import {enable, disable, ReactNativeBridge} from '../packages/gcanvas';
ReactNativeBridge.GCanvasModule = NativeModules.GCanvasModule;
ReactNativeBridge.Platform = Platform;

var CanvasView = Platform.select({
  ios: requireNativeComponent('RCTGCanvasView', null, {
    nativeOnly: {onChange: true},
  }),
  android: requireNativeComponent('GCanvasView', null, {
    nativeOnly: {onChange: true},
  }),
});

export default class GCanvasView extends Component {
  constructor(props) {
    super(props);
    this.refCanvasView = null;
    this.canvas = null;
  }

  static propTypes = {
    // isOffscreen: PropTypes.bool,
    ...View.propTypes,
  };

  _onIsReady = (event) => {
    if (this.props.onIsReady) {
      this.props.onIsReady(
        Platform.OS === 'ios' ? true : event.nativeEvent.value,
      );
    }
  };

  _onLayout = (event) => {
    if (this.refCanvasView === null) {
      this._onLayout(event);
      return;
    }

    this.canvas = enable(
      {
        ref: '' + findNodeHandle(this.refCanvasView),
        style: {
          width: event.nativeEvent.layout.width,
          height: event.nativeEvent.layout.height,
        },
      },
      {
        bridge: ReactNativeBridge,
        disableAutoSwap: true,
      },
    );

    if (this.props.onCanvasCreate) {
      this.props.onCanvasCreate(this.canvas);
    }
  };

  componentDidMount() {
    // ReactNativeBridge.GCanvasModule.setLogLevel(0); // 0 means DEBUG

    if (Platform.OS === 'ios') {
      const emitter = new NativeEventEmitter(ReactNativeBridge.GCanvasModule);
      emitter.addListener('GCanvasReady', this._onIsReady);
    }
  }

  componentWillUnmount() {
    ReactNativeBridge.GCanvasModule.disable(
      '' + findNodeHandle(this.refCanvasView),
    );

    if (Platform.OS === 'ios') {
      const emitter = new NativeEventEmitter(ReactNativeBridge.GCanvasModule);
      emitter.removeListener('GCanvasReady', this._onIsReady);
    }
  }

  render() {
    if (Platform.OS === 'web') {
      return (
        <View {...this.props}>
          <Text>{'Please use <canvas> not <CanvasView> on Web'}</Text>
        </View>
      );
    } else {
      return (
        <CanvasView
          {...this.props}
          ref={(view) => (this.refCanvasView = view)}
          onLayout={this._onLayout}
          onChange={this._onIsReady}
        />
      );
    }
  }
}
