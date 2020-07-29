// DOMstrings
const btnNext = document.querySelector("#new-btn");
const addAnswer = document.querySelector(".answer");
const questionText = document.getElementById("question");
const selectAnswer = document.getElementById("answer");
const btnCategories = document.querySelector("#category-btn");
const quizElement = document.getElementById("quiz");
const buttonsElement = document.getElementById("buttons");
const gridElement = document.getElementById("grid");
const btnTimer = document.getElementById("timer-btn");
const dropContent = document.getElementById("drop-content");
const dropDown = document.getElementById("dropdown");

// Global variables
let correctAnswer, timer;

//////////////// Functions //////////////////

// API Call
async function callAPI() {
  try {
    const result = await fetch("http://jservice.io/api/random");
    const data = await result.json();
    const answer = data[0].answer;
    const question = data[0].question;

    console.log(question); // Remove at deployment
    console.log(answer); // Remove at deployment

    questionText.innerHTML = question;

    return data;
  } catch (error) {
    console.log(error);
  }
}

// Move to next question incase of correct answer / Base game
async function newQuestion() {
  await callAPI().then((data) => {
    correctAnswer = data[0].answer;
  });
  selectAnswer.value = "";
  selectAnswer.style.backgroundColor = "#fff";
}

// Reset answer UI incase of wrong answer
function resetQuestion() {
  selectAnswer.value = "";
  selectAnswer.style.backgroundColor = "#fff";
}

// Open dropdown list
function openDropdown() {
  dropContent.classList.toggle("active");
}

// Hide dropdown list
function hideDropdown() {
  dropContent.classList.remove("active");
}

///////////////// Event handlers /////////////////////

btnNext.addEventListener("click", () => {
  selectAnswer.value = "";
  newQuestion();
});

addAnswer.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    selectAnswer.style.backgroundColor = "#DCDCDC";
    setTimeout(() => {
      const input = selectAnswer.value;
      if (input === correctAnswer) {
        selectAnswer.style.backgroundColor = "#32CD32";
        setTimeout(newQuestion, 3000);
      } else {
        selectAnswer.style.backgroundColor = "#FF6347";
        setTimeout(resetQuestion, 3000);
      }
    }, timer);
  } // Time setter for user
});

// Time selection
dropDown.addEventListener("click", (e) => {
  openDropdown();
  if (e.target && e.target.nodeName === "LI") {
    console.log(parseInt(e.target.id) * 1000);
    timer = parseInt(e.target.id) * 1000;
  }
});

// btnCategories.addEventListener("click", () => {
//   quizElement.parentNode.removeChild(quiz);
//   buttonsElement.parentNode.removeChild(buttonsElement);
//   document.querySelector(".grid").classList.toggle("category");
//   const html = '<div id="quiz"><h1>Quiz App</h1></div>';
//   console.log(gridElement);
//   document
//     .querySelector(".grid category")
//     .insertAdjacentElement("afterbegin", html);
// });

// Start app - first question is randomly generated
newQuestion();
