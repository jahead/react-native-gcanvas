import {Platform, requireNativeComponent} from 'react-native';
const CanvasView = Platform.select({
  ios: requireNativeComponent('RCTGCanvasView', null, {
    nativeOnly: {onChange: true},
  }),
  android: requireNativeComponent('GCanvasView', null, {
    nativeOnly: {onChange: true},
  }),
});
export default CanvasView;
