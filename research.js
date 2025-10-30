autowatch = 1;
outlets = 1;

include("header.js");

function updateTrackUmenu(tracks) {
  // TODO いちいち全部消してるのでインデックスが消失しているため修正する
  outlet(0, "clear");

  tracks.forEach((track, trackId) => {
    const meta = track.meta;
    outlet(0, "append", meta.name);
  });
}

function main() {
  const logger = new Logger("main");
  logger.info("Starting main function");

  const tracks = new Map();

  function trackChangeHandler(diff) {
    // トラックの追加と削除
    diff.addedIds.forEach((trackId) => {
      const trackPath = `id ${trackId}`;
      const track = new Track(trackPath);
      tracks.set(trackId, track);
    });
    diff.removedIds.forEach((trackId) => {
      tracks.delete(trackId);
    });

    updateTrackUmenu(tracks);
  }

  const liveSetApi = new LiveObjectObserver(
    "live_set",
    "tracks",
    trackChangeHandler
  ).api;

  // 初期トラックの取得
  liveSetApi
    .getstring("tracks")
    .split(" ")
    .forEach((part) => {
      if (part !== "id") {
        const trackId = part;
        const trackPath = `id ${trackId}`;
        const track = new Track(trackPath);
        tracks.set(trackId, track);
      }
    });
  updateTrackUmenu(tracks);
}

main();
