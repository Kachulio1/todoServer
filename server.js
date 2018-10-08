const express = require("express");
const bodyParser = require("body-parser");

let mongoose = require("./db/mongoose");
let Todo = require("./models/todo");
let User = require("./models/user");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 5050;

app.post("/todos", (req, res) => {
  const newTodo = Todo({ text: req.body.text });
  newTodo.save().then(item => res.send(item), error => res.status(400).send({error: error.message}));
});

app.listen(PORT, () => {
  console.log("Started on port: ", PORT);
});
