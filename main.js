autoload = 1;
inlets = 1;
outlets = 1;

include("header.js");

function bang() {
  const logger = new Logger("main");

  logger.info("Bang received");
}
