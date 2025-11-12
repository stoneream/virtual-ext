autowatch = 1;
inlets = 5;
outlets = 5;

include("header.js");
const logger = new Logger("initializer");

class TrackState {
  constructor() {
    // トラックをIDもしくは名前で引けるようにする
    this.byName = new Map();
    this.byId = new Map();
  }

  set(track) {
    this.byName.set(track.meta.name, track);
    this.byId.set(track.id, track);
  }

  getByName(name) {
    return this.byName.get(name);
  }

  getById(id) {
    return this.byId.get(id);
  }

  deleteById(id) {
    const track = this.byId.get(id);
    if (track) {
      this.byName.delete(track.meta.name);
      this.byId.delete(id);
    }
  }

  forEach(callback) {
    this.byId.forEach(callback);
  }
}

class UmenuTrackMapping {
  constructor() {
    this.trackIds = []; // インデックス順でトラックIDを保持する
  }

  addTrack(trackId) {
    const index = this.trackIds.length;
    this.trackIds.push(trackId);
  }

  getTrackIdByIndex(index) {
    return this.trackIds[index];
  }
}

const trackState = new TrackState();
const umenuTrackMapping = new UmenuTrackMapping();

// inet 0
function bang() {
  logger.info("Initialized device");

  // ライブセットのトラックを監視する
  const liveSetApi = new LiveObjectObserver(
    "live_set",
    "tracks",
    liveSetTrackChangeHandler
  ).api;

  // 起動時点でのトラックを取得する
  liveSetApi
    .getstring("tracks")
    .split(" ")
    .forEach((part) => {
      if (part !== "id") {
        const trackId = part;
        const trackPath = `id ${trackId}`;
        const track = new Track(trackPath);
        trackState.set(track);
      }
    });

  // トラック一覧(umenu)を更新 = outlet 3
  trackState.forEach((track, trackId) => {
    umenuTrackMapping.addTrack(trackId);
    outlet(3, "append", track.meta.name);
  });
}

function liveSetTrackChangeHandler(diff) {
  // TODO トラックが削除された場合にumenuから削除する
  // TODO トラックが追加された場合にumenuに追加する
}

// TODO デバイスが変更された場合、トラックがオブザーバー持っている関係でここから検知するすべがない（umenuを更新できない）
// TODO デバイスもstateを個別管理する設計にしたほうが良さそうか？（親のトラックIDをキーに引いたり、デバイスのIDをキーにトラックを引いたり。）

// inlet 1
function knob_master_bus_notification(message) {
  logger.info("knob_master_bus_notification", message);
}

// inlet 2
function set_device(message) {
  logger.info("set_device", message);
}

// inlet 3
function set_track(message) {
  logger.info("set_track", message);

  const trackId = umenuTrackMapping.getTrackIdByIndex(message);
  const track = trackState.getById(trackId);

  logger.info("Selected track", {
    trackId: trackId,
    trackName: track.meta.name,
  });
}

// inlet 4
function set_page(message) {
  logger.info("set_page", message);
}
