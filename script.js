const wordDisplay = document.querySelector(".word-display");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const guessesText = document.querySelector(".guesses-text b");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");
const timerDisplay = document.querySelector(".timer");

const codingQuiz = [
  { word: "Astronomer", hint: "A person who studies celestial bodies and the universe." },
  { word: "Chemist", hint: "A professional who works in the field of chemical engineering." },
  { word: "Programmer", hint: "A specialist who develops software applications or systems." },
  { word: "Engineer", hint: "A person who works with electronics and electrical systems." },
  { word: "Geologist", hint: "A professional who studies the Earth's structure, history, and processes." },
  { word: "Architect", hint: "A professional who designs and constructs buildings and other structures." },
  { word: "Biologist", hint: "A scientist focused on the study of organisms and their environments." },
  { word: "Psychiatrist", hint: "A healthcare professional specializing in diagnosing and treating mental disorders." },
  { word: "Cardiologist", hint: "A medical specialist focused on treating heart diseases." },
  { word: "Mechanic", hint: "A person who fixes and builds machines." },
];

let currentWord, correctLetters, wrongGuessCount, timerInterval;
const maxGuesses = 6;
const gameTimeLimit = 30;

const resetGame = () => {
  correctLetters = new Set();
  wrongGuessCount = 0;
  hangmanImage.src = "/image.png";
  guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
  keyboardDiv.querySelectorAll("button").forEach((btn) => (btn.disabled = false));
  wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
  clearInterval(timerInterval);
  startTimer();
  gameModal.classList.remove("show");
};

const getRandomWord = () => {
  const { word, hint } = codingQuiz[Math.floor(Math.random() * codingQuiz.length)];
  currentWord = word.toLowerCase();
  document.querySelector(".hint-text b").innerText = hint;
  resetGame();
};

const startTimer = () => {
  let timeLeft = gameTimeLimit;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = `Time left: ${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? "0" : ""}${timeLeft % 60}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameOver(false);
    }
  }, 1000);
};

const gameOver = (isVictory) => {
  setTimeout(() => {
    clearInterval(timerInterval);
    const modalText = isVictory ? `Yeah! You found the word:` : `You lost! The correct word was:`;
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
    gameModal.classList.add("show");
  }, 300);
};

const initGame = (button, clickedLetter) => {
  if (currentWord.includes(clickedLetter)) {
    [...currentWord].forEach((letter, index) => {
      if (letter === clickedLetter) {
        wordDisplay.querySelectorAll("li")[index].innerText = letter;
        wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
        correctLetters.add(letter);  // Use Set to avoid duplicates
      }
    });
  } else {
    wrongGuessCount++;
    hangmanImage.src = `https://media.geeksforgeeks.org/wp-content/uploads/20240215173028/${wrongGuessCount}.png`;
  }

  button.disabled = true;
  guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

  if (wrongGuessCount === maxGuesses) return gameOver(false);
  if ([...currentWord].every(letter => correctLetters.has(letter))) return gameOver(true);  // Check if all letters are guessed
};

for (let i = 97; i <= 122; i++) {
  const button = document.createElement("button");
  button.innerText = String.fromCharCode(i);
  keyboardDiv.appendChild(button);
  button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i)));
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);
