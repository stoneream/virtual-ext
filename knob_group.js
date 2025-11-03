autowatch = 1;
inlets = 2;
outlets = 4;

include("header.js");

const knobGroupNumber = jsarguments[0];

const logger = new Logger(`knob_group`, { knobGroupNumber: knobGroupNumber });

const InletHandlers = {
  0: masterBusMessageHandler, // knob_master_busからのメッセージハンドラ
  1: knobValueSettedHandler, // ノブの値が更新された際のハンドラ
};

/**
 * ノブの状態管理
 *
 * @knobNumber ノブ番号
 * @value ノブの値 (0~127)
 * @displayUpdating 表示を更新であるか
 */
class KnobState {
  #knobNumber;

  constructor(knobNumber) {
    this.#knobNumber = knobNumber;
    this.displayUpdating = false;
  }

  get knobNumber() {
    return this.#knobNumber;
  }
}

// ノブ番号をキーとしたノブの状態管理マッピング
const knobStates = new Map(
  Array.from({ length: 3 }, (_, i) => [i, new KnobState(i)])
);

/**
 * knob_master_busからのメッセージをパース
 *
 * == 仕様 ==
 *
 * スペース区切りのメッセージを期待する。
 * メッセージフォーマットは以下の通りである。
 *
 * == 共通パラメーター ==
 *
 * to_knob_group_number ノブグループ番号
 * command コマンド
 *   - set_knob_value ノブの値を設定
 * parameters コマンド別のパラメーター
 *
 * to_knob_group_number <group_number> command <command> [parameters...]
 *
 * == set_knob_valueコマンドのパラメーター ==
 *
 * to_knob_group_number <value> set_type <type> knob_value <value>
 *
 * knob_number: ノブ番号
 *
 * set_type 設定タイプ
 *  - display 表示のみ更新
 *  - value 値の更新
 *
 *  補足
 *  live.dialはトグルを手動で変えた場合および
 *  インレットから値を設定した場合outletから値が送出される。
 *  そのため表示上の更新を行う場合と値を更新する場合を区別する必要がある。
 *
 * knob_value: ノブの値 (0~127)
 *
 * == メッセージ例 ==
 *
 * グループ番号1のノブ1の表示のみを50に更新する場合
 * group_number 1 command set_knob_value knob_number 1 set_type display knob_value 50
 */
function masterBusMessageParser(message) {
  const parts = message.split(" ");
  const { toNobGroupNumber, command, parameters } =
    parseMasterBusCommonParameters(parts);

  // コマンド別のパラメーターのパース
  switch (command) {
    case "set_knob_value":
      const { knobNumber, setType, knobValue } =
        parseSetKnobValueParaeters(parameters);
      return {
        toNobGroupNumber,
        command,
        knobNumber,
        setType,
        knobValue,
      };
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

/**
 * knob_master_busからの共通パラメーターをパース
 */
function parseMasterBusCommonParameters(parts) {
  if (
    parts.length >= 4 &&
    parts[0] === "to_knob_group_number" &&
    parts[2] === "command"
  ) {
    const toKnobGroupNumberStr = parts[1];
    const command = parts[3];

    if (!toKnobGroupNumberStr || !command) {
      throw new Error("Missing required parameters");
    }

    const toKnobGroupNumber = parseInt(toKnobGroupNumberStr, 10);

    if (isNaN(toKnobGroupNumber)) {
      throw new Error("Invalid to_knob_group_number");
    }

    const parameters = parts.slice(4);

    return {
      toKnobGroupNumber,
      command,
      parameters,
    };
  } else {
    throw new Error("Invalid message format");
  }
}

/**
 * knob_master_busからのメッセージにおいて、set_knob_valueコマンドのパラメーターをパース
 */
function parseSetKnobValueParaeters(parameters) {
  if (parameters.length !== 6) {
    throw new Error("Invalid set_knob_value parameters");
  }

  const [
    knobNumberKey,
    knobNumberStr,
    setTypeKey,
    setTypeStr,
    knobValueKey,
    knobValueStr,
  ] = parameters;

  if (
    knobNumberKey !== "knob_number" ||
    setTypeKey !== "set_type" ||
    knobValueKey !== "knob_value"
  ) {
    throw new Error("Invalid set_knob_value parameter keys");
  }

  const knobNumber = parseInt(knobNumberStr, 10);
  const knobValue = parseInt(knobValueStr, 10);

  if (isNaN(knobNumber) || isNaN(knobValue)) {
    throw new Error("Invalid knob number or value");
  }

  if (!["display", "value"].includes(setTypeStr)) {
    throw new Error("Invalid set_type value");
  }

  return {
    knobNumber,
    setTypeStr,
    knobValue,
  };
}

/**
 * knob_value_settedからのメッセージをパース
 *
 * == 仕様 ==
 *
 * スペース区切りのメッセージを期待する。
 *
 * == メッセージフォーマット ==
 *
 * knob_number value knob_value value
 *
 * メッセージ例
 * knob_number 1 knob_value 20
 */
function knobValueSettedMessageParser(message) {
  const parts = message.split(" ");

  if (parts.length !== 4) {
    throw new Error("Invalid message format");
  }

  if (parts[0] !== "knob_number" || parts[2] !== "knob_value") {
    throw new Error("Invalid message format");
  }

  const knobNumber = parseInt(parts[1], 10);
  const knobValue = parseInt(parts[3], 10);

  if (isNaN(knobNumber) || isNaN(knobValue)) {
    throw new Error("Invalid knob_number or value");
  }

  return {
    knobNumber,
    knobValue,
  };
}

function anything() {
  emitEvent({
    type: "symbol",
    name: messagename,
    args: arrayfromargs(arguments),
    inlet: inlet,
  });
}

function emitEvent(payload) {
  if (payload.name !== "operate") {
    logger.error("unknown messagename:", { messagename: payload.messagename });
    return;
  }

  const handler = InletHandlers[payload.inlet];

  if (handler) {
    const message = payload.args.join(" ");
    handler(message);
  } else {
    logger.error("No handler for inlet:", { inlet: payload.inlet });
  }
}

function masterBusMessageHandler(message) {
  try {
    const parsedMessage = masterBusMessageParser(message);
    const { toGroupNumber, command, knobNumber, setType, knobValue } =
      parsedMessage;

    // グループ番号が異なる場合は無視
    if (toGroupNumber !== knobGroupNumber) {
      logger.info("Ignoring message for different group number", {
        message: message,
        knobGroupNumber: knobGroupNumber,
        toGroupNumber: toGroupNumber,
      });
      return;
    }

    const nobState = knobStates.get(knobNumber);

    if (!nobState) {
      logger.error("Invalid knob number:", { knobNumber: knobNumber });
      return;
    }

    if (command === "set_knob_value") {
      // ノブの表示更新
      if (setType === "display") {
        // 更新中フラグを立てる
        nobState.displayUpdating = true;
        outlet(knobNumber, knobValue);
        logger.info("Updating knob display value", {
          knobNumber: knobNumber,
        });
      }

      // ノブの値の更新
      if (setType === "value") {
        outlet(knobNumber, knobValue);
        logger.info("Updating knob value", {
          knobNumber: knobNumber,
        });
      }
    }
  } catch (e) {
    logger.error("Failed to parse master bus message", {
      message: message,
      error: e.message,
    });
  }
}

function knobValueSettedHandler(message) {
  logger.info("knobValueSettedHandler called with payload:", message);
}
