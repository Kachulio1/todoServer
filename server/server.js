const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
require("dotenv").config();
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
      res.status(404).send({ error: "Invalid ID" });
      return;
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      res.status(404).send();
      return;
    }

    res.send({ todo });
  } catch (error) {
    res.status(400).send({ type: error.type, error: error });
  }
});

app.delete("/todos/:id", async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(404).send({ error: "Invalid ID" });
    return;
  }

  Todo.findByIdAndRemove(id).then(todo => {
    if (!todo) {
      return res.status(404).send();
    }
    res.status(200).send({ todo });
  });
});

app.patch("/todos/:id", (req, res) => {
  const id = req.params.id;
  const { completed, text } = req.body;
  const body = {
    completed,
    text
  };

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({ error: "Invalid ID" });
  }

  if (completed && typeof body.completed != "boolean") {
    return res.status(404).send({
      error:
        "completed field must contain `true` or `false` nothing else comprende"
    });
  }

  if (body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  if (!body.text) {
    delete body.text;
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch(e => {
      res.status(400).send();
    });
});

app.listen(PORT, () => {
  console.log("Started on port: ", PORT);
});

module.exports = app;
