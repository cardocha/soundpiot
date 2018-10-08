(function() {
  let playButton = document.querySelector('.playControls__play');
  let playNext = document.querySelector('.playControls__next');
  let playPrev = document.querySelector('.playControls__prev');
  if (window.hasRun) {
    return;
  }

  playButton.onchange = function(){
      sendUpdatePlayerMessage(false);
  }

  function sendUpdatePlayerMessage(){
   browser.runtime.sendMessage({
      command: "change_player_state",
      isPlaying: playButton.classList.contains('playing'),
      musicInfo:{
        "author":document.querySelector('.playbackSoundBadge__lightLink').getAttribute("title"),
        "title":document.querySelector('.playbackSoundBadge__titleLink').getAttribute("title"),
        "image":document.querySelector(".playbackSoundBadge__avatar span").style.backgroundImage,
        "liked":document.querySelector('.playbackSoundBadge__actions .playbackSoundBadge__like').classList.contains('sc-button-selected')
      }
    });
  }
  window.hasRun = true;
  browser.runtime.onMessage.addListener((message) => {
    switch(message.command) {
        case "play" :
        case "pause":
            playButton.click();
            break;
        case "check_player":
            sendUpdatePlayerMessage();
            break;
        case "next":
            playNext.click();
            sendUpdatePlayerMessage();
            break;
        case "prev":
            playPrev.click();
            sendUpdatePlayerMessage();
            break;
        case "like":
            document.querySelector('.playbackSoundBadge__actions .playbackSoundBadge__like').click();
            sendUpdatePlayerMessage();
            break;
        default:
            sendUpdatePlayerMessage();
    }
  });

})();
