autowatch = 1;

class BindingTrackMenu {
  constructor(dispatcher, outletIndex) {
    this.logger = new Logger("BindingTrackMenu");
    this.dispatcher = dispatcher;
    this.outletIndex = outletIndex;

    this.tracks = [];

    // Live → UI
    this.dispatcher.on("tracksUpdated", (tracks) =>
      this._onTracksUpdated(tracks)
    );

    // UI → JS
    this.dispatcher.on("trackSelectedFromUI", (index) =>
      this._onTrackSelectedFromUI(index)
    );

    // Live → UI（選択インデックス変更）
    this.dispatcher.on("trackSelected", ({ index }) =>
      this._onTrackSelectedFromLive(index)
    );
  }

  // ---- Live → UI: トラック一覧を umenu に反映 ----
  _onTracksUpdated(tracks) {
    this.logger.info("Tracks updated", { tracks });

    this.tracks = tracks;

    // UIのumenuをクリア
    outlet(this.outletIndex, ["clear"]);

    // append track names
    tracks.forEach((t) => {
      outlet(this.outletIndex, ["append", t.name]);
    });

    // Optional: 最初のトラックを選択
    outlet(this.outletIndex, ["set", 0]);
  }

  // ---- UI → Live: ユーザーが umenu を選択 ----
  _onTrackSelectedFromUI(index) {
    this.logger.info("Track selected from UI", { index });

    // Live 側へ "トラック選択してください" という要求
    this.dispatcher.emit("setTrackRequested", { index });
  }

  // ---- Live → UI: Live 側で選択が変わったらUIに反映 ----
  _onTrackSelectedFromLive(index) {
    this.logger.info("Track selected in Live", { index });

    // UI側の umenu に反映
    outlet(this.outletIndex, ["set", index]);
  }
}
