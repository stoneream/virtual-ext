autowatch = 1;
inlets = 5;
outlets = 5;

include("header.js");

const logger = new Logger("main");

const dispatcher = new Dispatcher();

const bindingLiveSet = new BindingLiveSet();

const ui = {
  knobMaster: new BindingKnob(dispatcher, 1),
  deviceMenu: new BindingDeviceMenu(dispatcher, 2),
  trackMenu: new BindingTrackMenu(dispatcher, 3),
};

// live.thisdevice inlet 0
function bang() {
  logger.info("initializing");
  bindingLiveSet.init();
  dispatcher.emit("initializerReady");
  logger.info("initialized");
}

// inlet 1　ノブの変化通知
function knob_master_bus_notification(message) {
  logger.info("knob_master_bus_notification", message);
  dispatcher.emit("knobValueSet", message);
}

// inlet デバイスの選択通知
function set_device(message) {
  logger.info("set_device", message);
  dispatcher.emit("deviceSelected", message);
}

// inlet 3 トラックの選択通知
function set_track(message) {
  logger.info("set_track", message);
  dispatcher.emit("trackSelected", message);
}

// inlet 4 ページの選択通知
function set_page(message) {
  logger.info("set_page", message);
  dispatcher.emit("pageSelected", message);
}
