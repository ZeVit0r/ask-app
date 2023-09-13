const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Questions = require("./database/Questions");
const Answer = require("./database/Answer");

connection
  .authenticate()
  .then(() => console.log("authenticated"))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  Questions.findAll({ raw: true, order: [["id", "DESC"]] }).then(
    (questions) => {
      res.render("index", {
        questions: questions,
      });
    }
  );
});

app.get("/ask", (req, res) => {
  res.render("ask");
});

app.post("/saveask", (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  Questions.create({
    title: title,
    description: description,
  }).then(() => {
    res.redirect("/");
  });
});

app.get("/question/:id", (req, res) => {
  const id = req.params.id;
  Questions.findOne({
    where: { id: id },
  }).then((question) => {
    if (question != undefined) {
      Answer.findAll({
        where: { questionId: id },
        order: [["id", "DESC"]],
      }).then((answers) => {
        res.render("question", {
          question: question,
          answers: answers,
        });
      });
    } else {
      res.redirect("/");
    }
  });
});

app.post("/answer", (req, res) => {
  const body = req.body.body;
  const questionId = req.body.question;

  Answer.create({
    body: body,
    questionId: questionId,
  }).then(() => {
    res.redirect("/question/" + questionId);
  });
});

app.listen(8080, () => {
  console.log("Rodando....");
});
