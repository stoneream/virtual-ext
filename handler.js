autowatch = 1;
outlets = 1;
inlets = 1;

include("header.js");
const logger = new Logger("handler");

const InletHandlers = {
  0: handleJsonCommand,
};

function anything() {
  emitEvent({
    type: "symbol",
    name: messagename,
    args: arrayfromargs(arguments),
    inlet: inlet,
  });
}

function emitEvent(payload) {
  const handler = InletHandlers[payload.inlet];
  if (handler) {
    handler(payload);
  } else {
    logger.warn(`No handler for inlet ${payload.inlet}`);
  }
}

function handleJsonCommand(payload) {
  try {
    const message = JSON.parse(payload.name);

    if (!message.eventType) {
      return;
    }

    // イベントタイプの分岐
    switch (message.eventType) {
      case "knob_dial":
        knobDialCommandHandler(message);
        break;
      case "knob_menu":
        knobMenuCommandHandler(message);
        break;
      default:
        logger.warn(`Unknown event type: ${message.eventType}`);
        return;
    }
  } catch (e) {
    logger.error("Failed to parse JSON", e);
  }
}

function knobDialCommandHandler(message) {}

function knobMenuCommandHandler(message) {}

// 検証用
// TODO 初期化直後に値が取れない場合があるため安定するまでリトライを入れる
/*
エラー例
v8: handler.js: TypeError: liveSetApi.getstring(...).split is not a function, line 76
v8: Source line:     .split(" ")
v8: Stack Trace:
TypeError: liveSetApi.getstring(...).split is not a function
    at init (handler.js:76:6)
    at handler.js:124:1
v8: 2025-11-05T11:18:34.283Z [INFO] main: Starting main function  
v8: research.js: TypeError: liveSetApi.getstring(...).split is not a function, line 45
v8: Source line:     .split(" ")
v8: Stack Trace:
TypeError: liveSetApi.getstring(...).split is not a function
    at main (research.js:45:6)
    at research.js:57:1
*/
function init() {
  /*
  トラックIDがキー
  */
  const trackState = new Map();

  // ライブセットのトラックを監視
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
        trackState.set(trackId, track);
      }
    });

  logger.info("Track IDs:", Array.from(trackState.keys()));

  /**
   * ライブセットのトラックの変更を監視するハンドラ
   * 更新されたトラックを状態管理に反映する
   */
  function liveSetTrackChangeHandler(diff) {
    logger.info("Live set track change detected");

    // トラックの追加
    diff.addedIds.forEach((trackId) => {
      const trackPath = `id ${trackId}`;
      const track = new Track(trackPath);
      trackState.set(trackId, track);

      logger.info("Track added", {
        trackId: trackId,
        trackName: track.meta.name,
        trackColor: track.meta.color,
      });
    });

    // トラックの削除
    diff.removedIds.forEach((trackId) => {
      trackState.delete(trackId);
      logger.info("Track removed", { trackId: trackId });
    });

    trackState.forEach((track, trackId) => {
      logger.info("Current track", {
        trackId: trackId,
        trackName: track.meta.name,
        trackColor: track.meta.color,
      });
    });
  }
}

init();

/*
動作テスト

- トラックの追加
- トラックの削除
- トラックデバイスの追加
- トラックデバイスの削除

TODO トラックの名前の変更検知
TODO トラックデバイスの名前の変更検知
 */
