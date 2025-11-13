autowatch = 1;

class BindingDeviceMenu {
  constructor(dispatcher, outletIndex) {
    this.logger = new Logger("BindingDeviceMenu");
    this.dispatcher = dispatcher;
    this.outletIndex = outletIndex;

    this.devices = [];
    this.currentTrackIndex = null;

    // ---- Live → UI ----
    dispatcher.on("devicesUpdated", ({ trackIndex, devices }) =>
      this._onDevicesUpdated(trackIndex, devices)
    );

    dispatcher.on("deviceSelected", ({ index }) =>
      this._onDeviceSelectedFromLive(index)
    );

    // ---- UI → JS ----
    dispatcher.on("deviceSelectedFromUI", (index) =>
      this._onDeviceSelectedFromUI(index)
    );
  }

  // ---- Live → UI ----
  _onDevicesUpdated(trackIndex, devices) {
    this.logger.info("Devices updated", { trackIndex, devices });

    this.currentTrackIndex = trackIndex;
    this.devices = devices;

    // UIをクリア
    outlet(this.outletIndex, ["clear"]);

    // append device names
    devices.forEach((d) => {
      outlet(this.outletIndex, ["append", d.name]);
    });

    // デフォルト選択 0
    outlet(this.outletIndex, ["set", 0]);
  }

  // ---- UI → JS ----
  _onDeviceSelectedFromUI(index) {
    this.logger.info("Device selected from UI", { index });

    this.dispatcher.emit("setDeviceRequested", {
      trackIndex: this.currentTrackIndex,
      deviceIndex: index,
    });
  }

  // ---- Live → UI ----
  _onDeviceSelectedFromLive(index) {
    this.logger.info("Device selected from Live", { index });
    outlet(this.outletIndex, ["set", index]);
  }
}
