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
    this.canvas = null;
  }

  static propTypes = {
    // isOffscreen: PropTypes.bool,
    ...View.propTypes,
  };

  static defaultProps = {
    style: {
      height: '100%',
      width: '100%',
    },
  };

  _onIsReady = (event) => {
    if (this.props.onIsReady) {
      this.props.onIsReady(
        Platform.OS === 'ios' ? true : event.nativeEvent.value,
      );
    }
  };

  _onCanvasCreate = (view) => {
    if (this.canvas) {
      return;
    }

    this.refCanvasView = view;

    this.canvas = enable(
      {
        ref: '' + findNodeHandle(this.refCanvasView),
        style: {
          width: this.props.style.width || '100%',
          height: this.props.style.height || '100%',
        },
      },
      {bridge: ReactNativeBridge},
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
          ref={this._onCanvasCreate}
          onChange={this._onIsReady}
          style={[
            {...this.props.style},
            {
              height: this.props.style.height || '100%',
              width: this.props.style.width || '100%',
            },
          ]}
        />
      );
    }
  }
}
