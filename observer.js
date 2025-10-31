autowatch = 1;
outlets = 1;
inlets = 2;

include("header.js");
const logger = new Logger("observer");

// Inletのハンドラマッピング
const InletHandlers = {
  0: handleUmenuDevice, // umenu (device)
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

function handleUmenuDevice(payload) {
  const message = {
    eventType: "umenu",
    index: payload.args[0],
    label: payload.args[1],
  };
  outlet(0, JSON.stringify(message));
}
