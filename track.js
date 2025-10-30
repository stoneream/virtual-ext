class Track {
  #api;
  #meta;

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
