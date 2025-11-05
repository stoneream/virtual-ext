autowatch = 1;
outlets = 1;
inlets = 1;

include("header.js");
const logger = new Logger("live_observer");

const liveSetAPi = new LiveObjectObserver(
  "live_set",
  "tracks",
  handleTrackChange
).api;

function handleTrackChange(diff) {
  logger.info("Track change detected", diff);

  // TODO outletに出す
}
