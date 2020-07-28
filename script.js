const btnNext = document.querySelector("#new-btn");
const addAnswer = document.querySelector(".answer");
const questionText = document.getElementById("question");
const selectAnswer = document.getElementById("answer");
let correctAnswer;

async function callAPI() {
  try {
    const result = await fetch("http://jservice.io/api/random");
    const data = await result.json();
    const answer = data[0].answer;
    const question = data[0].question;

    console.log(question);
    console.log(answer);

    questionText.innerHTML = question;

    return data;
  } catch (error) {
    console.log(error);
  }
}

function newQuestion() {
  callAPI().then((data) => {
    correctAnswer = data[0].answer;
  });
  selectAnswer.value = "";
  selectAnswer.style.backgroundColor = "#fff";
}

btnNext.addEventListener("click", () => {
  selectAnswer.value = "";
  newQuestion();
});

addAnswer.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const input = selectAnswer.value;
    if (input === correctAnswer) {
      selectAnswer.style.backgroundColor = "#32CD32";
      setTimeout(newQuestion, 5000);
    } else {
      selectAnswer.style.backgroundColor = "#FF6347";
    }
  }
});

newQuestion();
