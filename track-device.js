class TrackDevice {
  constructor(path, parentTrackId) {
    this.api = new LiveAPI(path);
    this.deviceId = this.api.id;
    this.parentTrackId = parentTrackId;

    const name = this.api.get("name");
    this.meta = new TrackDeviceMeta(name);
  }
}

class TrackDeviceMeta {
  constructor(name) {
    this.name = name;
  }
}
