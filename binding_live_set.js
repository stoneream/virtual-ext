autowatch = 1;

class BindingLiveSet {
  constructor(dispatcher) {
    this.logger = new Logger("BindingLiveSet");
    this.dispatcher = dispatcher;

    this.api = new LiveAPI(null, "live_set");
    this.tracks = [];
    this.trackObserver = null;
  }

  init() {
    this.logger.info("Initializing BindingLiveSet");
    this._buildTrackBindings();

    this.trackObserver = new LiveObjectObserver("live_set", "tracks", (diff) =>
      this._onTracksChanged(diff)
    );

    this.dispatcher.emit(
      "liveSetInitialized",
      this.tracks.map((t) => t.getInfo())
    );
  }

  // 現在のトラックを走査
  _buildTrackBindings() {
    const count = this.api.getcount("tracks");
    this.logger.info("Found tracks", { count });
    this._disposeTracks();

    for (let i = 0; i < count; i++) {
      const trackPath = `live_set tracks ${i}`;
      const trackBinding = new BindingTrack(this.dispatcher, trackPath, i);
      trackBinding.init();
      this.tracks.push(trackBinding);
    }

    this.logger.info("Track bindings built", { count: this.tracks.length });
  }

  // --- tracks の変化検出時 ---
  _onTracksChanged(diff) {
    this.logger.info("Tracks changed", diff);

    // 追加されたtrackを登録
    diff.addedIds.forEach((id) => {
      const index = this._findTrackIndexById(id);
      if (index !== null) {
        const path = `live_set tracks ${index}`;
        const newTrack = new BindingTrack(this.dispatcher, path, index);
        newTrack.init();
        this.tracks.push(newTrack);
        this.logger.info("Track added", { id });
      }
    });

    // 削除されたtrackを破棄
    diff.removedIds.forEach((id) => {
      const track = this._findTrackById(id);
      if (track) {
        track.dispose();
        this.tracks = this.tracks.filter((t) => t !== track);
        this.logger.info("Track removed", id);
      }
    });

    // 変更結果を通知
    this.dispatcher.emit(
      "tracksUpdated",
      this.tracks.map((t) => t.getInfo())
    );
  }

  // トラックIDからindexを推定する
  _findTrackIndexById(id) {
    const count = this.api.getcount("tracks");
    for (let i = 0; i < count; i++) {
      const path = `live_set tracks ${i}`;
      const api = new LiveAPI(null, path);
      if (api.id === parseInt(id)) return i;
    }
    return null;
  }

  _findTrackById(id) {
    return this.tracks.find((t) => t.id === parseInt(id));
  }

  // 既存のトラックバインディングを破棄
  _disposeTracks() {
    this.tracks.forEach((t) => t.dispose && t.dispose());
    this.tracks = [];
  }

  dispose() {
    this.logger.info("Disposing BindingLiveSet");
    if (this.trackObserver) {
      this.trackObserver.dispose();
    }
    this._disposeTracks();
  }
}
