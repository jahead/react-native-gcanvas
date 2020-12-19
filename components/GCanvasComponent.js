import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import {
  NativeEventEmitter,
  Platform,
  View,
  findNodeHandle,
  requireNativeComponent,
} from 'react-native';
import {
  disable,
  ReactNativeBridge,
} from '../packages/gcanvas';

var CanvasView = Platform.select({
  ios: requireNativeComponent('RCTGCanvasView', null, {
    nativeOnly: {onChange: true},
  }),
  android: requireNativeComponent('GCanvasView', null, {
    nativeOnly: {onChange: true},
  }),
});

export default class GCanvasView extends Component {
  static propTypes = {
    // isOffscreen: PropTypes.bool,
    ...View.propTypes
  };

  _onIsReady = (event) => {
    if (this.props.onIsReady) {
      this.props.onIsReady(Platform.OS === 'ios' ? true : event.nativeEvent.value);
    }
  }

  componentDidMount() {
    // ReactNativeBridge.GCanvasModule.setLogLevel(0); // 0 means DEBUG

    if (Platform.OS === 'ios') {
      const emitter = new NativeEventEmitter(ReactNativeBridge.GCanvasModule);
      emitter.addListener('GCanvasReady', this._onIsReady);
    }
  }

  componentWillUnmount() {
    ReactNativeBridge.GCanvasModule.disable('' + findNodeHandle(this.refCanvas));

    if (Platform.OS === 'ios') {
      const emitter = new NativeEventEmitter(ReactNativeBridge.GCanvasModule);
      emitter.removeListener('GCanvasReady', this._onIsReady);
    }
  }

  render() {
    return ( <CanvasView ref={(view) => (this.refCanvas = view)} onChange={this._onIsReady} {...this.props} /> );
  };
}
