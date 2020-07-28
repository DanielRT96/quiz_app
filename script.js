const btnNext = document.querySelector("#new-btn");
const addAnswer = document.querySelector("#answer");
const questionText = document.getElementById("question");
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

callAPI().then((data) => {
  correctAnswer = data[0].answer;
});

btnNext.addEventListener("click", () => {
  document.getElementById("answer").value = "";
  callAPI().then((data) => {
    correctAnswer = data[0].answer;
  });
});

addAnswer.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const input = document.getElementById("answer").value;
    if (input === correctAnswer) {
      document.getElementById("answer").value = "";
      callAPI();
      console.log("correct");
    } else {
      console.log("incorrect");
    }
    console.log(input);
  }
});
