autoload = 1;
inlets = 2;
outlets = 3;

include("header.js");

const INLETS = {
  LOADED_DEVICE: 0,
  MASTER_INPUT: 1,
};

const OUTLETS = {
  TRACK_MENU: 0,
  DEVICE_MENU: 1,
  KNOB_MASTER: 2,
};

const logger = new Logger("main");

// 選択中のトラックを保持する
// TODO: ページング対応を考慮する場合は配列で管理する必要がある
let selectedTrackApi = null;
let selectedDeviceApi = null;

/**
 * 親API配下のアイテムをメニューに追加する
 * @param {LiveAPI} parentApi 親APIオブジェクト
 * @param {string} itemType アイテムの種類（例: "tracks", "devices", "parameters"）
 * @param {number} outletIndex 出力先のアウトレットインデックス
 */
function populateMenu(parentApi, itemType, outletIndex) {
  outlet(outletIndex, "clear");

  // 未選択状態用の空行を追加
  outlet(outletIndex, "append", "");

  // O(n)の探索となるが大量のトラックが存在することを想定していないため許容する
  // 将来的にパフォーマンスが問題となる場合はキャッシュを検討する
  const itemCount = parentApi.getcount(itemType);
  for (let i = 0; i < itemCount; i++) {
    const itemPath = `${parentApi.path} ${itemType} ${i}`;
    const itemApi = new LiveAPI(itemPath);
    const itemName = itemApi.get("name");
    outlet(outletIndex, "append", itemName);
  }
}

/**
 * 検索対象の名前に一致するアイテムを親API配下から探して返す
 * @param {LiveAPI} parentApi 親APIオブジェクト
 * @param {string} itemType アイテムの種類（例: "tracks", "devices", "parameters"）
 * @param {string} targetName 検索対象の名前
 * @returns
 */
function findItemByName(parentApi, itemType, targetName) {
  const itemCount = parentApi.getcount(itemType);

  // O(n)の探索となるが大量のパラメーターが存在することを想定していないため許容する
  // 将来的にパフォーマンスが問題となる場合はキャッシュを検討する
  for (let i = 0; i < itemCount; i++) {
    const itemPath = `${parentApi.path} ${itemType} ${i}`;
    const itemApi = new LiveAPI(itemPath);
    const currentName = String(itemApi.get("name")).toString();

    if (currentName === targetName) {
      return itemApi;
    }
  }
  return null;
}

/**
 * 現在選択されているアイテムと新たに見つかったアイテムが同じかどうかを判定する
 * @param {LiveAPI} current 現在選択されているアイテムのAPIオブジェクト
 * @param {LiveAPI} found 新たに見つかったアイテムのAPIオブジェクト
 * @returns
 */
function isSameSelection(current, found) {
  return current && found && current.path === found.path;
}

const KNOB_STATE = new KnobState();

function bang() {
  const logger = new Logger("main");
  const liveSet = new LiveAPI("live_set");

  // トラックを走査し、メニューに登録する
  populateMenu(liveSet, "tracks", OUTLETS.TRACK_MENU);
}

/*
v8: 2025-11-22T08:06:42.709Z [INFO] main: Received meesage  [message_name=knob_master_bus_notification, args=knob_group,1,knob_dial_number,1,value,13] 
*/

function anything() {
  let args = arrayfromargs(arguments);

  logger.info("Received meesage", { message_name: messagename, args: args });

  // TODO メッセージのルーティング
  switch (messagename) {
    case "knob_master_bus_notification":
      handleKnobMasterBusNotification(args);
      break;
    case "set_track":
      handleSetTrack(args);
      break;
    case "set_device":
      handleSetDevice(args);
      break;
    default:
      logger.warn("Unknown message", { message_name: messagename });
      break;
  }
}

// v8: 2025-11-22T08:36:37.605Z [INFO] main: Received meesage  [message_name=knob_master_bus_notification, args=knob_umenu,knob_group,1,knob_umenu_number,1,index,0,name,apple]
// v8: 2025-11-22T08:36:57.984Z [INFO] main: Received meesage  [message_name=knob_master_bus_notification, args=knob_dial,knob_group,1,knob_dial_number,1,value,5]

function handleKnobMasterBusNotification(args) {
  const paramType = args[0];

  switch (paramType) {
    case "knob_dial":
      // example
      // v8: 2025-11-22T08:36:57.984Z [INFO] main: Received meesage  [message_name=knob_master_bus_notification, args=knob_dial,knob_group,1,knob_dial_number,1,value,5]

      const knobGroupNumber = args[2];
      const knobDialNumber = args[4];
      const value = args[6];

      let group = KNOB_STATE.getGroup(knobGroupNumber);

      // グループの存在チェック
      if (!group) {
        logger.warn("Received knob_dial for non-existing group", {
          knobGroupNumber: knobGroupNumber,
        });
        return;
      }

      // ダイアルに紐づくパラメーターの存在チェック
      let parameter = group.getParameter(knobDialNumber);

      if (!parameter) {
        logger.warn("Received knob_dial for non-existing parameter", {
          knobGroupNumber: knobGroupNumber,
          knobDialNumber: knobDialNumber,
        });
        return;
      }

      // パラメーターの更新
      parameter.set(value);

      break;
    case "knob_umenu":
      // todo
      break;
    default:
      logger.warn("Unknown knob_master_bus_notification param", {
        paramType: paramType,
      });
      break;
  }
}

function handleSetTrack(args) {
  // example
  // v8: 2025-11-22T10:18:21.838Z [INFO] main: Received meesage  [message_name=set_track, args=index,1,name,2-Audio]
  let selectedTrackName = args[3];

  // トラックのデバイスを走査し、メニューに登録する
  const liveSet = new LiveAPI("live_set");
  const foundTracks = findItemByName(liveSet, "tracks", selectedTrackName);

  if (!foundTracks) {
    logger.warn("Track not found", { trackName: selectedTrackName });
    return;
  }

  // 選択されたトラックが同じ場合は何もしない
  if (isSameSelection(selectedTrackApi, foundTracks)) {
    return;
  }

  // 状態の更新
  selectedTrackApi = foundTracks;
  // 下位階層を初期化
  selectedDeviceApi = null;
  selectedParameterApi = null;

  // デバイスメニューの更新
  populateMenu(selectedTrackApi, "devices", OUTLETS.DEVICE_MENU);

  logger.info("Track selected", { trackName: selectedTrackName });
}

function handleSetDevice(args) {
  // example
  // v8: 2025-11-22T10:48:17.372Z [INFO] main: Received meesage  [message_name=set_device, args=index,1,name,utilty-eq-comp]

  // トラックが選択されていない場合は処理を中断する
  if (!selectedTrackApi) {
    logger.warn("No track selected, cannot set device");
    return;
  }

  let selectedDeviceName = args[3];
  const foundDevice = findItemByName(
    selectedTrackApi,
    "devices",
    selectedDeviceName
  );

  // デバイスが見つからなかった場合は警告を出して終了
  if (!foundDevice) {
    logger.warn("Device not found", { deviceName: deviceName });
    return;
  }

  // 選択されたデバイスが同じ場合は何もしない
  if (isSameSelection(selectedDeviceApi, foundDevice)) {
    return;
  }

  // 状態の更新
  selectedDeviceApi = foundDevice;

  // デバイスのパラメーターを走査する
  const deviceParameterCount = selectedDeviceApi.getcount("parameters");
  const deviceParameters = [];
  for (let i = 0; i < deviceParameterCount; i++) {
    const parameterPath = `${selectedDeviceApi.path} parameters ${i}`;
    const parameterApi = new LiveAPI(parameterPath);
    deviceParameters.push(parameterApi);
  }

  // ノブグループ全体の初期化
  KNOB_STATE.groups.forEach((group) => {
    const knobGroupQuery = ["knob_group", group.group_number];

    // ダイアルの初期化
    let initDialQuery = [...knobGroupQuery, "knob_all_dial_value", 0];
    outlet(OUTLETS.KNOB_MASTER, ...initDialQuery);

    // メニューの初期化
    const initUmenuQuery = [...knobGroupQuery, "knob_umenu_all_msg", "clear"];
    outlet(OUTLETS.KNOB_MASTER, ...initUmenuQuery);

    // メニューにパラメーターを追加する
    const deviceNames = deviceParameters.map((deviceParameter) => {
      return deviceParameter.get("name");
    });
    // 未選択状態用の空行を追加
    let emptyUmenuQuery = [
      ...knobGroupQuery,
      "knob_umenu_all_msg",
      "append",
      "",
    ];
    outlet(OUTLETS.KNOB_MASTER, ...emptyUmenuQuery);
    // パラメーター名を追加
    let addUmenuQueryies = deviceNames.map((deviceName) => {
      return [...knobGroupQuery, "knob_umenu_all_msg", "append", deviceName];
    });
    addUmenuQueryies.forEach((query) => {
      outlet(OUTLETS.KNOB_MASTER, ...query);
    });
  });
}
