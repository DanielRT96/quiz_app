const callAPI = () => {
  fetch("http://jservice.io/api/random")
    .then((response) => response.json())
    .then((data) => {
      const answer = data[0].answer;
      const question = data[0].question;
      console.log(question);
      console.log(answer);
      console.log(data);
      document.getElementById("question").innerHTML = question;
    });
};

callAPI();

const answerBox = document.querySelector("#answer");

document.querySelector("#new-btn").addEventListener("click", () => {
  document.getElementById("answer").value = "";
  callAPI();
});

answerBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const input = document.getElementById("answer").value;

    input === callAPI.answer ? console.log("correct") : console.log("false");

    console.log(input);
  }
});
