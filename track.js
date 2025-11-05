class Track {
  #api;
  #meta;

  /*
  IDをキーに子デバイスのインスタンスを持つ
  */
  #childrenTrackDevices = new Map();

  constructor(path) {
    this.#api = new LiveAPI(path);

    const name = this.#api.get("name");
    const color = this.#api.get("color");
    this.#meta = new TrackMeta(name, color);
  }

  get api() {
    return this.#api;
  }
  get meta() {
    return this.#meta;
  }

  get childrenTrackDevices() {
    return this.#childrenTrackDevices;
  }

  getTrackDeviceById(deviceId) {
    return this.#childrenTrackDevices.get(deviceId);
  }

  addTrackDeviceById(trackDevice) {
    this.#childrenTrackDevices.set(trackDevice.deviceId, trackDevice);
  }

  removeTrackDeviceById(deviceId) {
    this.#childrenTrackDevices.delete(deviceId);
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
