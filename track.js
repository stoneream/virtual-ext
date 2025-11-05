class Track {
  constructor(path) {
    this.api = new LiveAPI(path);
    this.id = this.api.id;
    /*
  IDをキーに子デバイスのインスタンスを持つ
  */
    this.childrenTrackDevices = new Map();

    const name = this.api.get("name");
    const color = this.api.get("color");
    this.meta = new TrackMeta(name, color);

    // 子デバイスを監視する
    this.childrenDeviceObserver = new LiveObjectObserver(
      this.api.path,
      "devices",
      (diff) => this.handeleDeviceChange(diff)
    ).api;

    // インスタンス生成時（初期）状態でのデバイスを取得する
    const deviceIds = this.childrenDeviceObserver
      .getstring("devices")
      .split(" ")
      .filter((part) => part !== "id");

    deviceIds.forEach((deviceId) => {
      this.addTrackDeviceById(new TrackDevice(`id ${deviceId}`, this.api.id));
    });

    const devicesString = this.childrenDeviceObserver.getstring("devices");
    logger.info("Initialized track", {
      trackId: this.api.id,
      trackName: this.meta.name,
      trackColor: this.meta.color,
      devices: devicesString,
    });
  }

  getTrackDeviceById(deviceId) {
    return this.childrenTrackDevices.get(deviceId);
  }

  addTrackDeviceById(trackDevice) {
    this.childrenTrackDevices.set(trackDevice.deviceId, trackDevice);
  }

  removeTrackDeviceById(deviceId) {
    this.childrenTrackDevices.delete(deviceId);
  }

  handeleDeviceChange(diff) {
    logger.info("Track device change detected", diff, { trackId: this.api.id });

    // デバイスの追加
    diff.addedIds.forEach((deviceId) => {
      this.addTrackDeviceById(new TrackDevice(`id ${deviceId}`, this.api.id));

      logger.info("Device added", {
        deviceId: deviceId,
        trackId: this.api.id,
      });
    });

    // デバイスの削除
    diff.removedIds.forEach((deviceId) => {
      track.removeTrackDeviceById(deviceId);

      logger.info("Device removed", {
        deviceId: deviceId,
        trackId: this.api.id,
      });
    });
  }
}

class TrackMeta {
  #name;
  #color;

  constructor(name, color) {
    this.#name = name;
    this.#color = color;
  }

  get name() {
    return this.#name;
  }
  get color() {
    return this.#color;
  }
}
