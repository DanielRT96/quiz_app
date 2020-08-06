// DOMstrings
const btnNext = document.querySelector("#new-btn");
const answerEl = document.querySelector("#answer");
const questionText = document.querySelector("#question");
const dropContent = document.getElementById("drop-content");
const dropDown = document.getElementById("dropdown");
const questionEl = document.querySelector("#question");
const optionsContainer = document.querySelector(".options-container");
const autoSelect = document.querySelector("#auto-select");
const uncheckBtn = document.querySelector("#uncheck");
const radioBoxes = document.querySelectorAll("#radioBoxes");
const categoryLabel = document.querySelector(".category-label");

// Global variables
let correctAnswer, timer, currentQuestion, categoryID, categoryName, currentID;
const categoryData = [];
const randomAPI =
  "https://cors-anywhere.herokuapp.com/https://jservice.io/api/random";
const categoriesAPI =
  "https://cors-anywhere.herokuapp.com/https://jservice.io/api/categories?count=10";

//////////////// Functions //////////////////

// API Call
async function callAPI(apiURL) {
  try {
    const result = await fetch(apiURL);
    const data = await result.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

// Generate a new question
const newQuestion = () => {
  const radioBoxes = this.radioBoxes;
  for (i = 0; i < radioBoxes.length; i++) {
    if (radioBoxes[i].checked) {
      categoryQuestion(currentID);
      return;
    }
  }
  randomQuestion();
};

// Get a random question
const randomQuestion = async () => {
  resetUI();
  renderLoader(questionEl);

  const data = await callAPI(randomAPI);
  correctAnswer = data[0].answer.replace(/ /g, "").toLowerCase();
  currentQuestion = data[0].question;
  categoryID = data[0].category.id;
  categoryName = data[0].category.title;

  console.log(correctAnswer); // To see the correct answer - development only -

  clearElement(".loader");
  currentCategory(answerEl, categoryName);
  questionText.innerHTML = currentQuestion;
};

// Reset answer element's UI
const resetAnswerEl = () => {
  answerEl.value = "";
  answerEl.style.backgroundColor = "#fff";
};

// Reset UI
const resetUI = () => {
  clearElement(".category-label");
  questionText.innerHTML = "";
  resetAnswerEl();
};

//Render loader while waiting for question
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

// Current category label
const currentCategory = (parent, catName) => {
  const label = `
  <div class="category-label">Current category: <b>${catName}</b></div>
  `;
  parent.insertAdjacentHTML("afterend", label);
};

// Clear element
const clearElement = (id) => {
  const element = document.querySelector(id);
  if (element) element.parentElement.removeChild(element);
};

// Render categoires on UI
const renderCategory = (category) => {
  const newOption = `
  <div class="option"><input type="radio" id="radioBoxes" name="checkBox" class="radio" onlcick="selectOnlyThis(this)" value="${category.id}""></input><label for="checkBox"><b>${category.title}</b></label></div>
  `;
  optionsContainer.insertAdjacentHTML("afterbegin", newOption);
};

// Get categories data from API
const getCategories = async () => {
  const result = await callAPI(categoriesAPI);
  for (i = 0; i < result.length; i++) {
    categoryData.push(result[i]);
  }
  categoryData.forEach(renderCategory);
};

// Only one radio element can be selected
const selectOnlyThis = (id) => {
  Array.prototype.forEach.call(radioBoxes, (el) => {
    el.checked = false;
  });
  id.checked = true;
};

// Get ID of a category
const getCategoryID = () => {
  const radioBoxes = this.radioBoxes;
  for (i = 0; i < radioBoxes.length; i++) {
    if (radioBoxes[i].checked) return radioBoxes[i].value;
  }
};

// Uncheck all category options
const uncheckAll = () => {
  const radioBoxes = this.radioBoxes;
  for (i = 0; i < radioBoxes.length; i++) {
    radioBoxes[i].checked = false;
  }
  newQuestion();
};

// Select a random category
const selectRandom = () => {
  const radioBoxes = this.radioBoxes;
  const random = Math.floor(Math.random() * 10);

  for (i = 0; i < radioBoxes.length; i++) {
    radioBoxes[i].checked = false;
  }
  radioBoxes[random].checked = true;
  currentID = radioBoxes[random].value;
  categoryQuestion(currentID);
};

//
const categoryQuestion = async (id) => {
  resetUI();
  renderLoader(questionEl);

  const x = await callAPI(`http://jservice.io/api/category?id=${id}`);
  const random = Math.floor(Math.random() * x.clues.length);
  categoryID = x.id;
  categoryName = x.title;
  correctAnswer = x.clues[random].answer.replace(/ /g, "").toLowerCase();
  currentQuestion = x.clues[random].question;

  console.log(correctAnswer); // To see the correct answer - development only -

  clearElement(".loader");
  currentCategory(answerEl, categoryName);
  questionText.innerHTML = currentQuestion;
};

const setUpGame = async () => {
  await getCategories();
  await newQuestion();
};

///////////////// Event handlers /////////////////////

// New Question
btnNext.addEventListener("click", newQuestion);

// Insert input
answerEl.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    answerEl.style.backgroundColor = "#DCDCDC";
    setTimeout(() => {
      const input = answerEl.value.replace(/ /g, "").toLowerCase();
      if (input === correctAnswer) {
        answerEl.style.backgroundColor = "#32CD32";
        setTimeout(newQuestion, 1000); // If the answer is correct, move to next question after 3 seconds
      } else {
        answerEl.style.backgroundColor = "#FF6347";
        setTimeout(resetAnswerEl, 1000); // If the answer is incorrect, reset after 3 seconds
      }
    }, timer);
  }
});

// Time selection
dropDown.addEventListener("click", (e) => {
  dropContent.classList.toggle("active");
  if (e.target && e.target.nodeName === "LI") {
    timer = parseInt(e.target.id) * 1000;
  }
});

autoSelect.addEventListener("click", selectRandom);

uncheckBtn.addEventListener("click", uncheckAll);

optionsContainer.addEventListener("click", (e) => {
  if (e.target.className === "radio") {
    currentID = getCategoryID();
    categoryQuestion(currentID);
  }
});

// Game initializer
setUpGame();
