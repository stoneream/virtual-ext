autowatch = 1;
outlets = 1;
inlets = 1;

include("header.js");
const logger = new Logger("observer");

const InletHandlers = {
  0: handleCommand,
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

function handleCommand(payload) {
  switch (payload.name) {
    case "knob_master_bus_notification":
      handleKnobMasterBusNotification(payload.args);
      break;
    case "set_page":
      handleSetPage(payload.args);
      break;
    default:
      logger.warn(`Unknown command: ${payload.name}`);
  }
}

/**
 * キーと値が交互に並んでいる配列をオブジェクトに変換する
 * @param {*} args
 * @returns
 */
function arrayToObject(args) {
  return args.reduce((acc, curr, index) => {
    if (index % 2 === 0) {
      acc[curr] = args[index + 1];
    }
    return acc;
  }, {});
}

function handleKnobMasterBusNotification(args) {
  // v8: 2025-11-03T10:44:36.054Z [INFO] observer: Knob master bus notification raw args  [0=knob_group, 1=6, 2=knob_dial_number, 3=3, 4=value, 5=21]
  // v8: 2025-11-03T10:54:12.912Z [INFO] observer: Knob master bus notification raw args  [0=knob_group, 1=4, 2=knob_umenu_number, 3=3, 4=index, 5=2]

  // 配列はキーと値が交互に並んでいるためオブジェクトに変換する
  const obj = arrayToObject(args);

  // knob_dial_number もしくは knob_umenu_number の場合に処理を分ける
  if (obj.knob_dial_number !== undefined) {
    const message = {
      eventType: "knob_dial",
      knob_group: obj.knob_group,
      knob_dial_number: obj.knob_dial_number,
      value: obj.value,
    };

    outlet(0, JSON.stringify(message));
    return;
  } else if (obj.knob_umenu_number !== undefined) {
    const message = {
      eventType: "knob_umenu",
      knob_group: obj.knob_group,
      knob_umenu_number: obj.knob_umenu_number,
      value: obj.value,
    };

    outlet(0, JSON.stringify(message));
    return;
  } else {
    logger.warn("Unknown knob master bus notification type", args);
    return;
  }
}

function handleSetPage(args) {
  // v8: 2025-11-03T11:00:42.379Z [INFO] observer: Set page args  [5]

  if (args.length < 1) {
    logger.warn("set_page command requires page number", args);
    return;
  }

  const message = {
    eventType: "set_page",
    pageIndex: args[0],
  };

  outlet(0, JSON.stringify(message));
}
