package com.taobao.gcanvas.bridges.rn;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * Event emitted by GReactTextureView with TextureView.SurfaceTextureListener.
 * @author flyskywhy
 *         create at 2020/12/13
 */

class GReactViewEvent extends Event<GReactViewEvent> {

  public static final String EVENT_NAME = "topChange";

  private final boolean mIsReady;

  public GReactViewEvent(int viewId, boolean isReady) {
    super(viewId);
    mIsReady = isReady;
  }

  @Override
  public String getEventName() {
    return EVENT_NAME;
  }

  @Override
  public void dispatch(RCTEventEmitter rctEventEmitter) {
    rctEventEmitter.receiveEvent(getViewTag(), getEventName(), serializeEventData());
  }

  private WritableMap serializeEventData() {
    WritableMap eventData = Arguments.createMap();
    eventData.putInt("target", getViewTag());
    eventData.putBoolean("value", mIsReady);
    return eventData;
  }
}
