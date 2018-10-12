const expect = require("expect");
const request = require("supertest");

const app = require("./../server");
const Todo = require("../../models/todo");

const todos = [
  {
    text: "Call Mimo"
  },
  {
    text: "Eat Lunch"
  },
  {
    text: "Find my ..."
  }
];

describe("POST /todos", () => {
  beforeEach(done => {
    Todo.remove({}).then(() => done());
  });

  it("should create a todo", done => {
    let text = "test create todo";
    request(app)
      .post("/todos")
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(err => done(err));
      });
  });

  it("should not create todo with invalid body data", done => {
    request(app)
      .post("/todos")
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(0);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe("GET /todos", () => {
  beforeEach(done => {
    Todo.remove({}).then(() => Todo.insertMany(todos).then(() => done()));
  });

  it("should get all todos", done => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(3);
      })
      .end(done);
  });
});
