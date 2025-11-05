class TrackDevice {
  #api;
  #parentTrackId;
  #meta;

  constructor(path, parentTrackId) {
    this.#api = new LiveAPI(path);

    const name = this.#api.get("name");
    this.#parentTrackId = parentTrackId;
    this.#meta = new TrackDeviceMeta(name);
  }

  get api() {
    return this.#api;
  }

  get parentTrackId() {
    return this.#parentTrackId;
  }

  get meta() {
    return this.#meta;
  }
}

class TrackDeviceMeta {
  #name;

  constructor(name) {
    this.#name = name;
  }

  get name() {
    return this.#name;
  }
}
