const startBtnElement = document.querySelector(".start__button");
const restartBtnElement = document.querySelector(".restart__button");
const imageContainer = document.querySelector(".image__container");
const gameTimerTextElement = document.querySelector(".game-timer");
const gameScoreElement = document.querySelector(".game-score");
const gameTargetElement = document.querySelector(".game-target");
const resultTextElement = document.querySelector(".result__text");
const correctSoundElement = document.querySelector(".match-right");
const winSoundElement = document.querySelector(".win-sound");

let score = 0;
let leftTarget = 8;
let imageboxElement = [];
let randomNumber = [];
let timerId = null;
let firstPick = null;
let firstPickImageElement = null;
let secondPick = null;
let secondPickImageElement = null;

const imageList = [
  "./image/1.PNG", "./image/1.PNG",
  "./image/2.PNG", "./image/2.PNG",
  "./image/3.PNG", "./image/3.PNG",
  "./image/4.PNG", "./image/4.PNG",
  "./image/5.PNG", "./image/5.PNG",
  "./image/6.PNG", "./image/6.PNG",
  "./image/7.PNG", "./image/7.PNG",
  "./image/8.PNG", "./image/8.PNG",
];

function handleClickStart() {
  startBtnElement.classList.add("start__button--hidden");
  countdownTimer();
  imageContainer.textContent = "";
  generateRandomNumber();
  shuffleImage()
  gameScoreElement.textContent = `찾은 모코코 : ${score} / 8`;
  gameTargetElement.textContent = `남은 모코코 : ${leftTarget} / 8`;
}

function shuffleImage() {
  for (let i = 0; i < imageList.length; i++) {
    const createImagebox = document.createElement("div");
    imageContainer.prepend(createImagebox);
    createImagebox.innerHTML = `<img src=${imageList[randomNumber.pop()]}></img>`;
    createImagebox.dataset.index = i;
    createImagebox.className = "image";
  }

  imageboxElement = document.querySelectorAll(".image");
  imageboxElement.forEach((image) =>
  image.addEventListener("click", handleClickImage));
}

function handleClickImage() {
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

  const isSameImage = (firstPickImageElement === secondPickImageElement && firstPick !== secondPick);
  if (isSameImage) {
    matchImage();
  } else {
    missMatchImage();
  }
}

function generateRandomNumber() {
  let i= 0;
  while (i < imageList.length) {
    let Num = Math.floor(Math.random() * imageList.length);
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
  score += 1;
  leftTarget -= 1;
  correctSoundElement.currentTime = 0
  correctSoundElement.play()
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
    setTimeout(() => {
      firstPick.classList.remove("flip");
      secondPick.classList.remove("flip");
      resetPick();
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
  restartBtnElement.classList.add("restart__button--show");
  imageContainer.textContent = "";
  resultTextElement.textContent = `모코코를 다 찾지 못하셨습니다 😢. 찾으신 모코코는 ${score}개 입니다.`;
}

function showWinResult() {
  clearInterval(timerId);
  correctSoundElement.currentTime = 0;
  winSoundElement.currentTime = 0;
  winSoundElement.play()
  imageContainer.textContent = "";
  resultTextElement.textContent = `모든 모코코를 다 찾으셨습니다!!`;
}

function handleClickRestartBtn() {
  score = 0;
  leftTarget = 8;
  clearInterval(timerId);
  resetGameElements()
  startBtnElement.classList.remove("start__button--hidden");
  restartBtnElement.classList.remove("restart__button--show");
}

function resetGameElements() {
  gameScoreElement.textContent = "";
  gameTargetElement.textContent = "";
  gameTimerTextElement.textContent = "";
  resultTextElement.textContent = "";
  imageContainer.innerHTML = `<img class="image__container--start-image" src="./image/startimage.png">`;
}

startBtnElement.addEventListener("click", handleClickStart);
restartBtnElement.addEventListener("click", handleClickRestartBtn);
