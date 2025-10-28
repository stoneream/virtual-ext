autowatch = 1;

function lnPost(obj) {
  post(obj + "\n");
}

// var api = new LiveAPI(trackChanged, "live_set");
// api.property = "tracks";

// lnPost("Observing tracks");

// function trackChanged() {
//   lnPost("Track changed");

//   let tracks = [];

//   for (let index = 0; index < api.getcount("tracks"); index++) {
//     const track = new LiveAPI(`live_set tracks ${index}`);

//     lnPost(`Found track : ${track.getstring("name")}`);

//     tracks.push(track);
//   }

//   outlet(0, ...tracks.map((track) => track.getstring("name")));
// }
