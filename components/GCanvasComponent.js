import React, { Component, PropTypes } from 'react';
import { requireNativeComponent, View, Platform, findNodeHandle } from 'react-native';
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
      this.props.onIsReady(event.nativeEvent.value);
    }
  }

  componentWillUnmount() {
    ReactNativeBridge.GCanvasModule.disable('' + findNodeHandle(this.refCanvas));
  }

  render() {
    return ( <CanvasView ref={(view) => (this.refCanvas = view)} onChange={this._onIsReady} {...this.props} /> );
  };
}
