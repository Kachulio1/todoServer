const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
require('dotenv').config()
let mongoose = require("../db/mongoose");
let Todo = require("../models/todo");
let User = require("../models/user");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 5050;

app.post("/todos", (req, res) => {
  const newTodo = Todo({ text: req.body.text });
  newTodo
    .save()
    .then(
      item => res.send(item),
      error => res.status(400).send({ error: error.message })
    );
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.send({ todos });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectID.isValid(id)) {
      res.status(400).send({ type: "InvalidError", error: "Invalid ID" });
      return;
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      res.send(404).send();
      return;
    }

    res.send({ todo });
  } catch (error) {
    res.status(400).send({ type: error.type, error: error });
  }
});

app.delete('/todos/:id', async (req, res) =>{
   const id = req.params.id
   Todo.findByIdAndDelete(id).then(todo => {
     res.status(200).send({message:'deleted'})
   })
})

app.listen(PORT, () => {
  console.log("Started on port: ", PORT);
});

module.exports = app;
