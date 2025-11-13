autowatch = 1;
inlets = 5;
outlets = 5;

include("header.js");

const logger = new Logger("main");
const dispatcher = new Dispatcher();

// Live 側のバインディング
const bindingLiveSet = new BindingLiveSet(dispatcher);

// 現在選択中のトラック（Device/Parameter 選択時に使う）
let currentTrack = 0;

// UI バインディング
const ui = {
  // すべての knob_group メッセージを扱うマスタ
  // outletIndex = 1 （main.js の 1 番アウトレット）
  knobGroupMaster: new BindingKnobGroup(dispatcher, 1),

  // デバイス umenu（outlet 2）
  deviceMenu: new BindingDeviceMenu(dispatcher, 2),

  // トラック umenu（outlet 3）
  trackMenu: new BindingTrackMenu(dispatcher, 3),

  // ※ ParameterMenu はそれぞれの bpatcher 内で作っている前提
};

// ----------------------------------------------------
// inlet 0: live.thisdevice → 初期化
// ----------------------------------------------------
function bang() {
  logger.info("initializing");
  bindingLiveSet.init();
  dispatcher.emit("initializerReady");
  logger.info("initialized");
}

// ----------------------------------------------------
// inlet 1: knob_master_bus からの通知
//   メッセージ形式:
//   knob_group <groupId> knob_dial_number <knobIndex> value <value>
//   例: knob_group 1 knob_dial_number 3 value 77
// ----------------------------------------------------
function knob_master_bus_notification() {
  const args = arrayfromargs(arguments);
  // 例: ["knob_group", 1, "knob_dial_number", 3, "value", 77]
  logger.info("knob_master_bus_notification", args);
  dispatcher.emit("knobGroupValueSet", args);
}

// ----------------------------------------------------
// inlet 2: デバイス umenu からの選択通知
//   Max 側：prepend set_device で selector を付けている想定
//   message = [deviceIndex]
// ----------------------------------------------------
function set_device(message) {
  logger.info("set_device", message);
  dispatcher.emit("deviceSelectedFromUI", message);
}

// ----------------------------------------------------
// inlet 3: トラック umenu からの選択通知
//   message = [trackIndex]
// ----------------------------------------------------
function set_track(message) {
  logger.info("set_track", message);
  dispatcher.emit("trackSelectedFromUI", message);
}

// ----------------------------------------------------
// inlet 4: ページ選択（今はイベントを流すだけ）
// ----------------------------------------------------
function set_page(message) {
  logger.info("set_page", message);
  dispatcher.emit("pageSelected", message);
}

// ====================================================
// Dispatcher 経由の Live 制御
// ====================================================

// TrackMenu → Live のトラック選択要求
dispatcher.on("setTrackRequested", ({ index }) => {
  const path = `live_set tracks ${index}`;
  const api = new LiveAPI(null, path);

  logger.info("Live track set", { index, id: api.id });

  dispatcher.emit("trackSelected", { index });
});

// DeviceMenu → Live のデバイス選択要求
dispatcher.on("setDeviceRequested", ({ trackIndex, deviceIndex }) => {
  const path = `live_set tracks ${trackIndex} devices ${deviceIndex}`;
  const api = new LiveAPI(null, path);

  logger.info("Live device set", {
    trackIndex,
    deviceIndex,
    id: api.id,
  });

  dispatcher.emit("deviceSelected", { index: deviceIndex });
});

// ParameterMenu → Live のパラメータ選択要求
dispatcher.on(
  "setParameterRequested",
  ({ knobGroupId, deviceIndex, parameterIndex }) => {
    const path = `live_set tracks ${currentTrack} devices ${deviceIndex} parameters ${parameterIndex}`;
    const api = new LiveAPI(null, path);

    logger.info("Live parameter set", {
      knobGroupId,
      deviceIndex,
      parameterIndex,
      id: api.id,
    });

    // Live 側の「現在選択中パラメータ」が変わった通知（UI 同期に使う）
    dispatcher.emit("parameterSelected", {
      knobGroupId,
      index: parameterIndex,
    });
  }
);

// TrackSelected → 現在トラックを保持
dispatcher.on("trackSelected", ({ index }) => {
  currentTrack = index;
  logger.info("Current track updated", { currentTrack });
});

// ★必要に応じて：deviceSelectedFromUI / trackSelectedFromUI を
//   BindingDeviceMenu / BindingTrackMenu 側で拾って setXXXRequested へ変換する前提。
//   もし main で変換したいなら、以下のようにしてもよい:
//
// dispatcher.on("trackSelectedFromUI", ([index]) => {
//   dispatcher.emit("setTrackRequested", { index });
// });
//
// dispatcher.on("deviceSelectedFromUI", ([deviceIndex]) => {
//   dispatcher.emit("setDeviceRequested", { trackIndex: currentTrack, deviceIndex });
// });
