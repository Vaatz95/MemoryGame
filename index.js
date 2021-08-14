const startBtnElement = document.querySelector(".start__button");
const restartBtnElement = document.querySelector(".restart__button");
const imageContainer = document.querySelector(".image__container");
const gameTimerTextElement = document.querySelector(".game-timer");
const gameScoreElement = document.querySelector(".game-score");
const gameTargetElement = document.querySelector(".game-target");
const resultTextElement = document.querySelector(".result__text")

let score = 0;
let leftTarget = 8;
let imageboxElement = [];
let randomNumber = [];
let timer = null;
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

function createImagebox() {
  startBtnElement.classList.add("start__button--hidden")
  countdownTimer()
  imageContainer.textContent = "";
  generateRandomNumber();
  gameScoreElement.textContent = `찾은 모코코 : ${score} / 8`
  gameTargetElement.textContent = `남은 모코코 : ${leftTarget} / 8`

  for (let i = 0; i < imageList.length; i++) {
    const createImagebox = document.createElement("div");
    imageContainer.prepend(createImagebox);
    createImagebox.innerHTML = `<img src=${imageList[randomNumber.pop()]}></img>`;
    createImagebox.dataset.index = i;
    createImagebox.className = "image";
  }

  imageboxElement = document.querySelectorAll(".image");
  imageboxElement.forEach((image) =>
  image.addEventListener("click", handleClickImage)
  )
}

function handleClickImage() {
  this.classList.add("flip")

  if (firstPick === null) {
    firstPick = this
    firstPickImageElement = this.innerHTML
    return
  }

  if (secondPick === null) {
    secondPick = this
    secondPickImageElement = this.innerHTML
  }

  const isSameImage = (firstPickImageElement === secondPickImageElement && firstPick !== secondPick)
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
  firstPick.removeEventListener("click", handleClickImage)
  secondPick.removeEventListener("click", handleClickImage)
  resetPick()
  gameScoreElement.textContent = `찾은 모코코 : ${score} / 8`
  gameTargetElement.textContent = `남은 모코코 : ${leftTarget} / 8`

  if (score === 8) {
    showWinResult();
    restartBtnElement.classList.add("restart__button--show");
  }
}

function missMatchImage() {
  const isNotEmpty = firstPickImageElement !== null && secondPickImageElement !== null
  if (isNotEmpty) {
    imageboxElement.forEach((image) =>
    image.removeEventListener("click", handleClickImage))

    setTimeout(() => {
      firstPick.classList.remove("flip")
      secondPick.classList.remove("flip")
      resetPick()
      imageboxElement.forEach((image) =>
      image.addEventListener("click", handleClickImage))
    }, 300)
  }
}

function resetPick() {
  firstPick = null;
  firstPickImageElement = null;
  secondPick = null;
  secondPickImageElement = null;
}

function countdownTimer(secondsLeft = 60) {
  clearInterval(timer);
  displayTimeLeft(secondsLeft)
  timer = setInterval(() => {
    secondsLeft -= 1;
    if (secondsLeft === 0) {
      displayTimeLeft(secondsLeft)
      clearInterval(timer);
      showLoseResult()
      return
    }
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(secondsLeft) {
  gameTimerTextElement.textContent = `00 : ${secondsLeft < 10 ? 0 : ""}${secondsLeft}`
}

function showLoseResult() {
  restartBtnElement.classList.add("restart__button--show")
  imageContainer.textContent = "";
  resultTextElement.textContent = `모코코를 다 찾지 못하셨습니다 😢. 찾으신 모코코는 ${score}개 입니다.`;
}

function showWinResult() {
  clearInterval(timer);
  imageContainer.textContent = "";
  resultTextElement.textContent = `모든 모코코를 다 찾으셨습니다!!`;
}

function handleClickRestartBtn() {
  score = 0;
  leftTarget = 8;
  clearInterval(timer);
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

startBtnElement.addEventListener("click", createImagebox);
restartBtnElement.addEventListener("click", handleClickRestartBtn)


// 다르면 classlist 에서 show 함수 삭제하고 이전 백그라운드 이미지로 돌아가기
// while 문을 활용해서 숫자를 만들어내고 그 숫자를 집어넣은 배열을 만들어주고 그 배열안에 숫자를 빼서 넣어주는 방식으로 해결한다.
// genNum 함수에서 최소 0 , 최대 15로 하고 16번 시행하게 하고 중복일 경우 다시 돌리는 방식으로 0 ~ 15 까지 무작위 순서로 숫자를 만들어 [ ]에 집어넣는다.
// ex) imageList(genNum.pop)
// reset 버튼을 누르면 새로고침으로 재시작 하는 것이 아닌 다른 방식으로 재시작 하는 걸로 구현해야함 (아마 기존에 있던 부분을 DOM으로 삭제하고 다시 DOM 요소들을 재생성 해주는 방식을 구현 해주면 될거 같음)
// score = 8 이면 승리 했다는걸 알리면서 restart 버튼이 나오고 기존에 있던 부분이 사라지고 승리를 축하해야함


