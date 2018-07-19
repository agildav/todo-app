const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const express = require("express");
const path = require("path");
//  Init
const app = express();
const PORT = process.env.PORT || 3000;

//  Setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//  Views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//  MongoDB connection
const mongoURL = process.env.mlab_uri;
const dbName = "todoapp";

MongoClient.connect(
  mongoURL,
  { useNewUrlParser: true },
  (err, database) => {
    if (err) throw err;

    console.log("MongoDB connected.");
    const db = database.db(dbName);
    Todos = db.collection("todos");

    //  Run server
    app.listen(PORT, () => {
      console.log(`running on PORT ${PORT}`);
    });
  }
);

//  Routes
app.get("/", (req, res) => {
  Todos.find({}).toArray((err, todos) => {
    if (err) throw err;
    res.render("index", { todos });
  });
});

app.post("/todo/add", (req, res) => {
  const todo = {
    text: req.body.text,
    body: req.body.body
  };

  Todos.insert(todo, (err, result) => {
    if (err) throw err;
    console.log("Todo added");

    res.redirect("/");
  });
});

app.get("/todo/edit/:id", (req, res) => {
  const todo = {
    _id: ObjectID(req.params.id)
  };

  Todos.find(todo).next((err, todo) => {
    if (err) throw err;
    res.render("edit", { todo });
  });
});

app.post("/todo/edit/:id", (req, res) => {
  const query = {
    _id: ObjectID(req.params.id)
  };
  const todo = {
    text: req.body.text,
    body: req.body.body
  };

  Todos.updateOne(query, { $set: todo }, (err, result) => {
    if (err) throw err;
    console.log("Todo edited");

    res.redirect("/");
  });
});

app.delete("/todo/delete/:id", (req, res) => {
  const todo = {
    _id: ObjectID(req.params.id)
  };

  Todos.deleteOne(todo, (err, result) => {
    if (err) throw err;
    console.log("Todo deleted");
    res.sendStatus(200);
  });
});
