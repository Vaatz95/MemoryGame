const startBtnElement = document.querySelector(".start__button");
const restartBtnElement = document.querySelector(".restart__button");
const imageContainer = document.querySelector(".image__container");
const gameTimerTextElement = document.querySelector(".game-timer");
const gameScoreElement = document.querySelector(".game-score");
const gameTargetElement = document.querySelector(".game-target");
const resultTextElement = document.querySelector(".result__text");

const IMAGE_LIST = [
  "./image/1.PNG", "./image/1.PNG",
  "./image/2.PNG", "./image/2.PNG",
  "./image/3.PNG", "./image/3.PNG",
  "./image/4.PNG", "./image/4.PNG",
  "./image/5.PNG", "./image/5.PNG",
  "./image/6.PNG", "./image/6.PNG",
  "./image/7.PNG", "./image/7.PNG",
  "./image/8.PNG", "./image/8.PNG",
];

const GAME_SOUND = {
  correctSound: new Audio('./sound/모코코뽑는소리.mp3'),
  winResult: new Audio('./sound/승리.mp3'),
  backgroundMusic: new Audio('./sound/background.mp3'),
};

const GAME_UI = [
  gameScoreElement,
  gameTargetElement,
  gameTimerTextElement,
  resultTextElement,
];

const controlSound = {
  play: function (audio) {
    audio.currentTime = 0;
    audio === GAME_SOUND.backgroundMusic ? audio.volume = 0.5 : audio.volume = 1
    isPlaying ? audio.play() : audio.pause()
  },
  result: function (audio) {
    audio.currentTime = 0;
    isPlaying ? audio.pause() : audio.play()
  }
};

const resetGame = {
  resetElement: function(el) {
    el.forEach((el) => el.textContent = "");
    imageContainer.innerHTML = `<img class="image__container--start-image" src="./image/startimage.png">`;
  }
};

let imageboxElement = [];
let randomNumber = [];
let timerId = null;
let firstPick = null;
let firstPickImageElement = null;
let secondPick = null;
let secondPickImageElement = null;
let isPlaying = false;
let isStart = false;

const countScore = (function () {
  let score = 0
  return function () {
    return isStart ? score : score += 1
  };
}());

const countQuestion = (function () {
  let leftTarget = 8
  return function () {
    return isStart ? leftTarget : leftTarget -= 1
  };
}());

function handleClickStartBtn() {
  isPlaying = true;
  isStart = true;
  const score = countScore()
  const leftTarget =countQuestion()
  startBtnElement.classList.add("start__button--hidden");
  countdownTimer();
  imageContainer.textContent = "";
  generateRandomNumber();
  shuffleImage()
  controlSound.play(GAME_SOUND.backgroundMusic)
  gameScoreElement.textContent = `찾은 모코코 : ${score} / 8`;
  gameTargetElement.textContent = `남은 모코코 : ${leftTarget} / 8`;
}

function shuffleImage() {
  for (let i = 0; i < IMAGE_LIST.length; i++) {
    const createImagebox = document.createElement("div");
    imageContainer.prepend(createImagebox);
    createImagebox.innerHTML = `<img src=${IMAGE_LIST[randomNumber.pop()]}></img>`;
    createImagebox.dataset.index = i;
    createImagebox.className = "image";
  }

  imageboxElement = document.querySelectorAll(".image");
  imageboxElement.forEach((image) =>
  image.addEventListener("click", handleClickImage));
}

function handleClickImage() {
  isStart = false;
  this.classList.add("flip");

  if (firstPick === null) {
    firstPick = this;
    firstPickImageElement = this.innerHTML;
    return
  }

  if (secondPick === null) {
    secondPick = this;
    secondPickImageElement = this.innerHTML;
  }

  compareImageCouple()
}

function compareImageCouple() {
  const isSameImage = (firstPickImageElement === secondPickImageElement)
  if(firstPick !== secondPick){
    if (isSameImage) {
      matchImage();
    } else {
      missMatchImage();
    }
  }
}

function generateRandomNumber() {
  let i= 0;
  while (i < IMAGE_LIST.length) {
    let Num = Math.floor(Math.random() * IMAGE_LIST.length);
    if (!hasSameNumber(Num)) {
      randomNumber.push(Num);
      i++;
    }
  }
  return randomNumber
}

function hasSameNumber(Num) {
  for (var i = 0 ; i < randomNumber.length; i++) {
    if (Num === randomNumber[i]) return true;
  }
}

function matchImage() {
  const score = countScore()
  const leftTarget =countQuestion()
  controlSound.play(GAME_SOUND.correctSound)
  firstPick.removeEventListener("click", handleClickImage);
  secondPick.removeEventListener("click", handleClickImage);
  resetPick();
  gameScoreElement.textContent = `찾은 모코코 : ${score} / 8`;
  gameTargetElement.textContent = `남은 모코코 : ${leftTarget} / 8`;

  if (score === 8) {
    showWinResult();
    restartBtnElement.classList.add("restart__button--show");
  }
}

function missMatchImage() {
  const isNotEmpty = firstPickImageElement !== null && secondPickImageElement !== null
  if (isNotEmpty) {
    imageContainer.classList.add("unclickable")
    setTimeout(() => {
      firstPick.classList.remove("flip");
      secondPick.classList.remove("flip");
      resetPick();
      imageContainer.classList.remove("unclickable")
    }, 300);
  }
}

function resetPick() {
  firstPick = null;
  firstPickImageElement = null;
  secondPick = null;
  secondPickImageElement = null;
}

function countdownTimer(secondsLeft = 60) {
  clearInterval(timerId);
  displayTimeLeft(secondsLeft);
  timerId = setInterval(() => {
    secondsLeft -= 1;
    if (secondsLeft === 0) {
      displayTimeLeft(secondsLeft);
      clearInterval(timerId);
      showLoseResult();
      return
    }
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(secondsLeft) {
  gameTimerTextElement.textContent = `00 : ${secondsLeft < 10 ? 0 : ""}${secondsLeft}`;
}

function showLoseResult() {
  isStart = true;
  isPlaying = false;
  let score = countScore()
  controlSound.play(GAME_SOUND.backgroundMusic);
  restartBtnElement.classList.add("restart__button--show");
  imageContainer.textContent = "";
  resultTextElement.textContent = `모코코를 다 찾지 못하셨습니다 😢. 찾으신 모코코는 ${score}개 입니다.`;
}

function showWinResult() {
  isPlaying = false
  clearInterval(timerId);
  controlSound.result(GAME_SOUND.winResult);
  controlSound.play(GAME_SOUND.backgroundMusic);
  imageContainer.textContent = "";
  resultTextElement.textContent = `모든 모코코를 다 찾으셨습니다!!`;
}

function handleClickRestartBtn() {
  clearInterval(timerId);
  resetGame.resetElement(GAME_UI);
  startBtnElement.classList.remove("start__button--hidden");
  restartBtnElement.classList.remove("restart__button--show");
}

startBtnElement.addEventListener("click", handleClickStartBtn);
restartBtnElement.addEventListener("click", handleClickRestartBtn);
