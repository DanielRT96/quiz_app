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
const checkboxes = document.querySelectorAll("#checkboxes");
const categoryLabel = document.querySelector(".category-label");

// Global variables
let correctAnswer, timer, currentQuestion, categoryID, categoryName, currentID;
const categoryIDs = [];
const randomAPI = "http://jservice.io/api/random";
const categoriesAPI = "http://jservice.io/api/categories?count=10";

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

// Move to next question incase of correct answer / Base game
const newQuestion = async () => {
  const checkboxes = this.checkboxes;
  for (i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      categoryFilter(currentID);
      return;
    }
  }
  randomQuestion();
};

const randomQuestion = async () => {
  resetQuestion();
  renderLoader(questionEl);

  const data = await callAPI(randomAPI);
  correctAnswer = data[0].answer;
  currentQuestion = data[0].question;
  categoryID = data[0].category.id;
  categoryName = data[0].category.title;

  console.log(currentQuestion);
  console.log(correctAnswer);
  console.log(categoryName);

  clearElement(".loader");
  currentCategory(answerEl, categoryName);
  questionText.innerHTML = currentQuestion;
};

// Reset answer UI incase of wrong answer
const resetQuestion = () => {
  answerEl.value = "";
  answerEl.style.backgroundColor = "#fff";
  clearElement(".category-label");
  questionText.innerHTML = "";
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

// Get categories from API
const getCategories = async () => {
  const result = await callAPI(categoriesAPI);
  for (let i = 0; i < result.length; i++) {
    categoryIDs.push(result[i]);
  }
};

// Render categoires on UI
const renderCategory = (category) => {
  const newOption = `
  <div class="option"><input type="radio" id="checkboxes" name="checkBox" class='radio' onlcick="selectOnlyThis(this)" value="${category.id}""></input><label for="checkBox">${category.title}</label></div>
  `;
  optionsContainer.insertAdjacentHTML("afterbegin", newOption);
};

// Categories control panel
const categoryControl = async () => {
  await getCategories();
  categoryIDs.forEach(renderCategory);
  // filterCategories();
};

// Select only one checkbox
const selectOnlyThis = (id) => {
  console.log(id.value);
  Array.prototype.forEach.call(checkboxes, (el) => {
    el.checked = false;
  });
  id.checked = true;
};

const displayValue = () => {
  const checkboxes = this.checkboxes;
  for (i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) return checkboxes[i].value; // to be removed
  }
};

// Uncheck all categories
const uncheckAll = () => {
  const checkboxes = this.checkboxes;
  for (i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false;
  }
  newQuestion();
};

// Select random category
const selectRandom = async () => {
  const checkboxes = this.checkboxes;
  const random = Math.floor(Math.random() * 10);

  for (i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false;
  }
  checkboxes[random].checked = true;
  currentID = checkboxes[random].value;
  categoryFilter(currentID);
};

const categoryFilter = async (id) => {
  resetQuestion();
  renderLoader(questionEl);

  const x = await callAPI(`http://jservice.io/api/category?id=${id}`);
  const random = Math.floor(Math.random() * x.clues.length);
  categoryID = x.id;
  categoryName = x.title;
  correctAnswer = x.clues[random].answer;
  currentQuestion = x.clues[random].question;

  console.log(currentQuestion);
  console.log(correctAnswer);
  console.log(categoryName);

  clearElement(".loader");
  currentCategory(answerEl, categoryName);
  questionText.innerHTML = currentQuestion;
};

const setUpGame = async () => {
  await categoryControl();
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
      const input = answerEl.value;
      if (input === correctAnswer) {
        answerEl.style.backgroundColor = "#32CD32";
        setTimeout(newQuestion, 1000); // If the answer is correct, move to next question after 3 seconds
      } else {
        answerEl.style.backgroundColor = "#FF6347";
        setTimeout(resetQuestion, 1000); // If the answer is incorrect, reset after 3 seconds
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

autoSelect.addEventListener("click", selectRandom);

uncheckBtn.addEventListener("click", uncheckAll);

optionsContainer.addEventListener("click", (e) => {
  if (e.target.className === "radio") {
    currentID = displayValue();
    categoryFilter(currentID);
  }
});

setUpGame();
