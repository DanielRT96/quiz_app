const API = fetch("http://jservice.io/api/random")
  .then((response) => response.json())
  .then((data) => {
    const answer = data[0].answer;
    const question = data[0].question;
    console.log(question);
    console.log(answer);
    document.getElementById("question").innerHTML = question;
  });
