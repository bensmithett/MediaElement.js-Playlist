/*global $: false, jQuery: false, document: false, window: false, MediaElement: false*/

/* 
  var myPlaylist = new AudioPlaylist(settings);

  settings = {
    "sounds": ".sound",
    "player": "#player"
  }

*/

(function () {
  var AudioPlaylist,
      createAudioElement,
      handleControlClick;
  
  AudioPlaylist = function (settings) {
    var $sounds = $(settings.sounds),
        audioElement = createAudioElement();

    $sounds.on("click.audioAction", { audioElement: audioElement }, handleClick);
  };

  createAudioElement = function () {
    return document.body.appendChild(document.createElement("audio"));
  };

  handleClick = function (e) {
    var audioElement = e.data.audioElement;

    e.preventDefault();

    console.log(audioElement.constructor);
  };

  // Add global
  window.AudioPlaylist = AudioPlaylist;
}());












// Call on page:
var myPlaylist = new AudioPlaylist({
  "sounds": ".sound"
});