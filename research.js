autowatch = 1;
include("header.js");

function main() {
  const logger = new Logger("main");

  const tracksObserver = new LiveObjectObserver("live_set", "tracks", (api) => {
    logger.info("tracks changed");
  });
}

main();
