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
const quizClass = document.querySelector("#question");

// Global variables
let correctAnswer, timer, currentQuestion;
const randomAPI = "http://jservice.io/api/random";
const categoriesAPI = "http://jservice.io/api/categories?count=5";

//////////////// Functions //////////////////

// API Call
async function callAPI(apiURL) {
  try {
    const result = await fetch(apiURL);
    const data = await result.json();
    const answer = data[0].answer; // remove at deployment
    const question = data[0].question;

    console.log(question); // Remove at deployment
    console.log(answer); // Remove at deployment

    return data;
  } catch (error) {
    console.log(error);
  }
}

// Move to next question incase of correct answer / Base game
async function newQuestion() {
  questionText.innerHTML = "";
  renderLoader(quizClass);
  await callAPI(randomAPI).then((data) => {
    correctAnswer = data[0].answer;
    currentQuestion = data[0].question;
  });
  clearLoader();
  questionText.innerHTML = currentQuestion;
  selectAnswer.value = "";
  selectAnswer.style.backgroundColor = "#fff";
}

// Reset answer UI incase of wrong answer
const resetQuestion = () => {
  selectAnswer.value = "";
  selectAnswer.style.backgroundColor = "#fff";
};

// Open dropdown list
const openDropdown = () => {
  dropContent.classList.toggle("active");
};

//Render loader while waiting for quesiton
const renderLoader = (parent) => {
  const loader = `
  <div class="loader">
    <svg>
      <use href="icons.svg#icon-cw"></use>
    </svg>
  </div>
  `;
  parent.insertAdjacentHTML("afterbegin", loader);
};

// Clear loader after question is loaded
const clearLoader = () => {
  const loader = document.querySelector(".loader");
  if (loader) loader.parentElement.removeChild(loader);
};

const openCategory = async () => {
  await callAPI(categoriesAPI).then((data) => {
    console.log(data);
  });
};

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
        setTimeout(newQuestion, 2000); // If the answer is correct, move to next question after 3 seconds
      } else {
        selectAnswer.style.backgroundColor = "#FF6347";
        setTimeout(resetQuestion, 2000); // If the answer is incorrect, reset after 3 seconds
      }
    }, timer);
  }
});

// Time selection
dropDown.addEventListener("click", (e) => {
  openDropdown();
  if (e.target && e.target.nodeName === "LI") {
    console.log(parseInt(e.target.id) * 1000); // Remove at deployment
    timer = parseInt(e.target.id) * 1000;
  }
});

// Open category grid
btnCategories.addEventListener("click", openCategory);

// Start app - first question is randomly generated
newQuestion();
