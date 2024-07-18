const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "task-management",
  port: "3306",
});

connection.connect((err) => {
  if (err)
     console.log (err);
  console.log("db is connected");
});

module.exports = connection;

