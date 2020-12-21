# Chnagelog

All notable changes of this project will be documented in.


## [1.2.7] - 2020-12-21

### Changed

* React Native GCanvas Component
	* feat: support drawImage() from require('some.png') on Android, iOS and Web


## [1.2.5] - 2020-12-18

### Changed

* React Native GCanvas Component
	* iOS worked again
	* fix: a bug that will no display while quit from a drawer item page to current canvas page which is still maintain mounted by react-navigation on Android
	* fix: a bug that will still no display after close a pop-up activity like permission request dialog
	* feat: can render2d canvas on iOS now


## [1.2.0] - 2020-12-13

### Changed

* React Native GCanvas Component
	* Android worked again
	* fix: `A/libc(13515): Fatal signal 11 (SIGSEGV), code 1 (SEGV_MAPERR), fault addr 0x7af4c00ed8 in tid 13656 (mqt_native_modu)`
	* fix: can render2d canvas on Android now
	* fix: avoid sometimes `java.lang.NullPointerException: Attempt to invoke virtual method 'boolean com.taobao.gcanvas.bridges.rn.GReactTextureView.isReady()' on a null object reference`


## [1.1.0] - 2019-10-31

### Changed

* Core Engine
	* Refacotor `GCanvas` and `GCanvasContext` class, make it more lower coupling. `GCanvas` response for initialize, create `GCanvasContext` and drawFrame, all 2d `property` and `API` move to `GCanvasContext`
	* Add `GCanvasWeex` only for `Weex` UI framework
	* Add `GCanvasHooks` and `GCanvasLog`, support for custom exception log.
	* `GCanvasContext` Support set canvas dimension
	* New `2d` property `lineDash` and `lineDashOffset`
	* New `2d` property support `shadowColor`,`shadowBlur`, `shadowOffsetX`,`shadowOffstY`
	* Font support `measureText` and `Italic` style
	* `Fill()`、`Clip()` , support winding-rule and promote performance
	* Out of Android platform- implementation :`GCanvas2DContextAndroid`,`GCanvasAndroid`,`GFontManagerAndroid`,
	* Refactor Android-Weex `GcanvasWeexAndroid`
	* Fix some compatibility issue



* Weex GCanvas Component
	* Update New `WeexSDK` (>=0.26.0)
	* [iOS] `iOS` deployment_target update to iOS 9.0
	* [Android]`Android`:moudle bridge_spec source code depend on the module gcanvas_library
