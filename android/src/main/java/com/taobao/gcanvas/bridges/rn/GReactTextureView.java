package com.taobao.gcanvas.bridges.rn;

import android.content.Context;
import android.util.AttributeSet;
import android.util.Log;
import android.graphics.SurfaceTexture;
import android.view.TextureView;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.taobao.gcanvas.surface.GTextureView;

/**
 * View for ReactNative.
 * @author ertong
 *         create at 2018/1/23
 */

public class GReactTextureView extends GTextureView implements LifecycleEventListener, TextureView.SurfaceTextureListener {
    private boolean mIsReady = false;
    private boolean mOnSurfaceTextureCreatedWithZeroSize = false;
    private ReactContext mContext;

    public GReactTextureView(Context context, String id) {
        super(context, id);
        mContext = (ReactContext)context;
        addSurfaceTextureListener(this);
    }

    public GReactTextureView(Context context, String id, AttributeSet attrs) {
        super(context, id, attrs);
        mContext = (ReactContext)context;
        addSurfaceTextureListener(this);
    }

    public GReactTextureView(Context context, String id, AttributeSet attrs, int defStyleAttr) {
        super(context, id, attrs, defStyleAttr);
        mContext = (ReactContext)context;
        addSurfaceTextureListener(this);
    }

    public GReactTextureView(Context context, String id, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, id, attrs, defStyleAttr, defStyleRes);
        mContext = (ReactContext)context;
        addSurfaceTextureListener(this);
    }

    @Override
    public void onHostResume() {
       resume();
    }

    @Override
    public void onHostPause() {
        pause();
    }

    @Override
    public void onHostDestroy() {
        setSurfaceTextureListener(null);
        requestExit();
    }

    public boolean isReady() {
        return mIsReady;
    }

    @Override
    public void onSurfaceTextureAvailable(SurfaceTexture surface, int width, int height) {
        if (!mIsReady) {
            // onSurfaceTextureAvailable is sometimes called with 0 size texture
            // and immediately followed by onSurfaceTextureSizeChanged with actual size
            if (width == 0 || height == 0) {
                mOnSurfaceTextureCreatedWithZeroSize = true;
            }

            mIsReady = true;

            if (!mOnSurfaceTextureCreatedWithZeroSize) {
                onIsReady();
            }
        }
    }

    @Override
    public void onSurfaceTextureSizeChanged(SurfaceTexture surface, int width, int height) {
        if (mOnSurfaceTextureCreatedWithZeroSize && (width != 0 || height != 0)) {
            onIsReady();
            mOnSurfaceTextureCreatedWithZeroSize = false;
        }
    }

    @Override
    public boolean onSurfaceTextureDestroyed(SurfaceTexture surface) {
        mIsReady = false;
        onIsReady();
        return true;
    }

    @Override
    public void onSurfaceTextureUpdated(SurfaceTexture surface) {
    }

    private void onIsReady() {
        mContext
            .getNativeModule(UIManagerModule.class)
            .getEventDispatcher()
            .dispatchEvent(new GReactViewEvent(getId(), mIsReady));
    }
}
