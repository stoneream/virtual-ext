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

    if (message.eventType) {
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

/*
トラックIDがキー
*/
const trackState = new Map();

// 検証用
function init() {
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

  logger.info(`Initial tracks loaded: ${trackState.size}`);

  // debug dump
  trackState.forEach((track, trackId) => {
    const meta = track.meta;
    logger.info(
      `Track ID: ${trackId}, Name: ${meta.name}, Color: ${meta.color}`
    );
  });

  // 起動時点のトラックのデバイスを取得し監視する
  trackState.forEach((track, trackId) => {
    const trackApi = track.api;
    const devicesObserver = new LiveObjectObserver(
      trackApi.path,
      "devices",
      (diff) => trackDeviceChangeHandler(trackId, diff)
    ).api;

    const devicesString = devicesObserver.getstring("devices");
    logger.info(`Track ID: ${trackId}, Devices: ${devicesString}`);
  });
}

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

    logger.info(`Track added: ID ${trackId}, Name: ${track.meta.name}`);
  });

  // トラックの削除
  diff.removedIds.forEach((trackId) => {
    trackState.delete(trackId);
    logger.info(`Track removed: ID ${trackId}`);
  });

  // デバッグ用の状態ダンプ
  logger.info(`Current tracks count: ${trackState.size}`);
  trackState.forEach((track, trackId) => {
    const meta = track.meta;
    logger.info(
      `Track ID: ${trackId}, Name: ${meta.name}, Color: ${meta.color}`
    );
  });
}

function trackDeviceChangeHandler(trackId, diff) {
  logger.info("Track device change detected");

  const track = trackState.get(trackId);
  if (!track) {
    logger.error(`Track not found for ID: ${trackId}`);
    return;
  }

  // デバイスの追加
  diff.addedIds.forEach((deviceId) => {
    const devicePath = `id ${deviceId}`;
    const trackDevice = new TrackDevice(devicePath, trackId);
    track.addTrackDeviceById(trackDevice);
    logger.info(
      `Device added: ID ${deviceId}, Name: ${trackDevice.meta.name}, Track ID: ${trackId}`
    );
  });

  // デバイスの削除
  diff.removedIds.forEach((deviceId) => {
    track.removeTrackDeviceById(deviceId);
    logger.info(`Device removed: ID ${deviceId}, Track ID: ${trackId}`);
  });

  // デバッグ用の状態ダンプ
  logger.info(
    `Current devices for Track ID ${trackId}: ${track.childrenTrackDevices.size}`
  );
  track.childrenTrackDevices.forEach((device, deviceId) => {
    const meta = device.meta;
    logger.info(
      `Device ID: ${deviceId}, Name: ${meta.name}, Track ID: ${trackId}`
    );
  });
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
