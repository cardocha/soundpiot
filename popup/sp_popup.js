const PLAY_ICON_URL = "icons/play.svg";
const PAUSE_ICON_URL = "icons/pause.svg";
const LIKE_ICON_URL = "icons/like.svg";
const LIKED_ICON_URL = "icons/liked.svg"
const PAUSE_COMMAND = "pause";
const PLAY_COMMAND = "play";
const LIKE_COMMAND = "like"
const PREV_MUSIC_COMMAND = "prev";
const NEXT_MUSIC_COMMAND = "next";
const CHECK_PLAYER_COMMAND = "check_player";
const SOUNDCLOUD_PAGE_REGEX = "*://*.soundcloud.com/*";
const CHECK_TABS = true;

let playButton;
let nextButton;
let prevButton;
let playButtonImage;
let likeButton;
let likeButtonImage;
let musicImage;
let musicAuthor;
let musicTitle;
let playerContent;
let errorPopupContent;
let isPlaying;
let soundCloudChecker;
let hideTabButton;

setInitialState();
checkForSoundCloudTab();
setSoundCloudCheckerState(CHECK_TABS);
getSoundCloudTab().then(sendPlayerCheckCommand, onError);

function getPlayerButtonIcon(isPlayingFlag){
    return isPlayingFlag ? PAUSE_ICON_URL:PLAY_ICON_URL ;
}

function flipPlayingFlag(){
    isPlaying = !isPlaying
}

function checkForSoundCloudTab(){
    getSoundCloudTab().then(checkTab, onError);
}

function checkTab(tabs){
    const tabFound = tabs.length !== 0;
    if(tabFound)
       setInitialState();

    playerContent.style.display = tabFound ? "block" : "none";
    errorPopupContent.style.display = tabFound ? "none": "block";

    getSoundCloudTab().then(sendPlayerCheckCommand, onError);
}

function setSoundCloudCheckerState(flag){
    setInterval(checkForSoundCloudTab, 500);
}

function performPlayClick(performSoundCloudPlayClick){
  playButtonImage.setAttribute("src", getPlayerButtonIcon(isPlaying));
  if(performSoundCloudPlayClick)
     getSoundCloudTab().then(sendPlayCommand, onError);
  flipPlayingFlag();
}

function performNextMusicClick(){
   getSoundCloudTab().then(sendNextMusicCommand, onError);
}

function performPrevMusicClick(){
   getSoundCloudTab().then(sendPreviousMusicCommand, onError);
}

function performPlayClick(performSoundCloudPlayClick){
  playButtonImage.setAttribute("src", getPlayerButtonIcon(isPlaying));
  if(performSoundCloudPlayClick)
     getSoundCloudTab().then(sendPlayCommand, onError);
  flipPlayingFlag();
}

function performLikeClick(){
   getSoundCloudTab().then(sendLikeMusicCommand, onError);
}

function setCurrentMusicInfo(musicInfo){
    musicTitle.innerHTML = sanitizeString(musicInfo.title);
    musicAuthor.innerHTML = sanitizeString(musicInfo.author);
    musicImage.style.backgroundImage = musicInfo.image;
    likeButtonImage.setAttribute("src", musicInfo.liked ? LIKED_ICON_URL : LIKE_ICON_URL);
    musicImage.style.width = "50px";
    musicImage.style.height = "50px";
}

function sendPlayCommand(tabs) {
  if(tabs.length > 0 ){
    const playerCommand = isPlaying ? PLAY_COMMAND : PAUSE_COMMAND ;
    browser.tabs.sendMessage(tabs[0].id, {
       command: playerCommand
     });
  }
}

function sendNextMusicCommand(tabs) {
  if(tabs.length > 0 ){
    browser.tabs.sendMessage(tabs[0].id, {
       command: NEXT_MUSIC_COMMAND
     });
  }
}

function sendPreviousMusicCommand(tabs) {
  if(tabs.length > 0 ){
    browser.tabs.sendMessage(tabs[0].id, {
       command: PREV_MUSIC_COMMAND
     });
  }
}

function sendLikeMusicCommand(tabs) {
  if(tabs.length > 0 ){
    browser.tabs.sendMessage(tabs[0].id, {
       command: LIKE_COMMAND
     });
  }
}

function sendPlayerCheckCommand(tabs) {
  if(tabs.length > 0 ){
    browser.tabs.sendMessage(tabs[0].id, {
       command: CHECK_PLAYER_COMMAND
     });
  }
}

function getSoundCloudTab(){
  return browser.tabs.query({url: SOUNDCLOUD_PAGE_REGEX});
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function setInitialState(){
  playButton = document.querySelector(".btn-play");
  nextButton = document.querySelector(".btn-next");
  prevButton = document.querySelector(".btn-prev");
  likeButton = document.querySelector(".btn-like");
  likeButtonImage = document.querySelector(".img-like");
  playButtonImage = document.querySelector(".img-play");
  musicImage = document.querySelector(".music-image");
  musicAuthor = document.querySelector(".music-author");
  musicTitle = document.querySelector(".music-title");
  playerContent = document.querySelector('.music-info-container');
  errorPopupContent = document.querySelector('.error-popup');
  hideTabButton = document.querySelector('.btn-hide-sc-tab')
  soundCloudChecker = undefined;
  setplayerListeners();
}
function setplayerListeners(){
  playButton.onclick = function(){
      performPlayClick(true);
  }
  nextButton.onclick = function(){
      performNextMusicClick();
  }
  prevButton.onclick = function(){
      performPrevMusicClick();
  }
  likeButton.onclick = function(){
      performLikeClick();
  }
}
function sanitizeString(str){
    str = str.replace(/([^a-z0-9áéíóúñü_-\s\.,]|[\t\n\f\r\v\0])/gim,"");
    return str.trim();
}

function handleMessage(request, sender, sendResponse) {
    isPlaying = request.isPlaying;
    setCurrentMusicInfo(request.musicInfo);
    performPlayClick(false);
}

browser.runtime.onMessage.addListener(handleMessage);
