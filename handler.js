autowatch = 1;
outlets = 1;
inlets = 1;

include("header.js");
const logger = new Logger("handler");

function anything() {
  try {
    const data = JSON.parse(messagename);
    logger.info("Received", data);
  } catch (e) {
    const prop = {
      messagename: messagename,
      args: arrayfromargs(arguments),
    };
    logger.error("Failed to parse JSON", prop);
  }
}
