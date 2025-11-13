/**
 * ディスパッチャで使用されるイベント名の定数定義
 */
const EventTypes = {
  // 初期化関連
  INITIALIZER_READY: "initializerReady",
  LIVE_SET_INITIALIZED: "liveSetInitialized",

  // トラック関連
  TRACKS_UPDATED: "tracksUpdated",
  TRACK_SELECTED: "trackSelected",
  TRACK_SELECTED_FROM_UI: "trackSelectedFromUI",
  SET_TRACK_REQUESTED: "setTrackRequested",

  // デバイス関連
  DEVICE_UPDATED: "deviceUpdated",
  DEVICES_UPDATED: "devicesUpdated",
  DEVICE_SELECTED: "deviceSelected",
  DEVICE_SELECTED_FROM_UI: "deviceSelectedFromUI",
  SET_DEVICE_REQUESTED: "setDeviceRequested",

  // パラメーター関連
  PARAMETERS_UPDATED: "parametersUpdated",
  PARAMETER_SELECTED: "parameterSelected",
  PARAMETER_SELECTED_FROM_UI: "parameterSelectedFromUI",
  PARAMETER_BOUND: "parameterBound",
  PARAMETER_VALUE_CHANGED: "parameterValueChanged",
  SET_PARAMETER_REQUESTED: "setParameterRequested",

  // ノブグループ関連
  KNOB_GROUP_VALUE_SET: "knobGroupValueSet",

  // ページ関連
  PAGE_SELECTED: "pageSelected",
};

// 後方互換性のため、freeze で定数化
Object.freeze(EventTypes);
