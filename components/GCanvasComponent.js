import React, { Component, PropTypes } from 'react';
import { requireNativeComponent, View, Platform, findNodeHandle } from 'react-native';

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
    this.isGReactTextureViewReady = null;

    this.state = {
      reAvailableCounts: 0,
    };
  }

  static propTypes = {
    // isOffscreen: PropTypes.bool,
    ...View.propTypes
  };

  _onIsReady = (event) => {
    let value = event.nativeEvent.value;
    if (this.isGReactTextureViewReady === false && value === true) {
      // need re-render CanvasView after 2nd isGReactTextureViewReady is true e.g.
      // quit from a drawer item page to current canvas page which is still maintain
      // mounted by react-navigation on Android, otherwise will no display
      this.isGReactTextureViewReady = null;
      this.setState({
        reAvailableCounts: this.state.reAvailableCounts + 1,
      });
    } else {
      this.isGReactTextureViewReady = value;
    }

    if (this.props.onIsReady) {
      this.props.onIsReady(value);
    }
  }

  render() {
    return ( <CanvasView key={this.state.reAvailableCounts} onChange={this._onIsReady} {...this.props} /> );
  };
}
