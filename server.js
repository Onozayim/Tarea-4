var express = require("express");
var app = express();
var db = require("./database.js");
var cors = require("cors");

var bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var HTTP_PORT = 8000;

app.listen(HTTP_PORT, () => {
  console.log("Server runing on port: " + HTTP_PORT);
});

app.get("/api", (req, res, next) => {
  res.json({ message: "Ok" });
});

app.get("/api/task", (req, res, next) => {
  var sql = "select * from task";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ status: "Error", message: err });
      return;
    }

    res.json({
      status: "ok",
      data: rows,
    });
  });
});

app.post("/api/task/create", (req, res, next) => {
  console.log(req.body);

  if (!req.body.task) {
    res
      .status(400)
      .json({ status: "Error", message: "La tarea no puede estar vacía" });
    return;
  }

  const sql = `INSERT INTO task (task) VALUES (?)`;

  const data = {
    task: req.body.task,
    done: false,
    id: null,
  };

  const params = [data.task];

  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ status: "Error", message: err });
      return;
    }

    data.id = this.lastID;
    res.json({
      message: "ok",
      data: data,
    });
  });
});

app.delete("/api/task/delete/:task_id", (req, res, next) => {
  if (!req.params.task_id) {
    res.status(400).json({ status: "Error", message: "Id no encontrado" });
  }
  const sql = `DELETE FROM task where id = ?`;
  params = [req.params.task_id];

  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ status: "Error", message: err });
      return;
    }

    res.json({
      message: "ok",
      data: req.params.task_id,
    });
  });
});

app.patch("/api/task/complete/:task_id", (req, res, next) => {
  if (!req.params.task_id) {
    res.status(400).json({ status: "Error", message: "Id no encontrado" });
  }

  const sql = `UPDATE task set done = 1 WHERE id = ?`;
  params = [req.params.task_id];

  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ status: "Error", message: err });
      return;
    }

    res.json({
      message: "ok",
      data: req.params.task_id,
    });
  });
});

app.use(function (req, res) {
  res.status(404);
  res.json({ message: "error" });
  return;
});
