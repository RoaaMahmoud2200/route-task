// ==================== INITIALIZE EXPRESS APP ====================
const express = require("express");
const app = express();

// ====================  GLOBAL MIDDLEWARE ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // TO ACCESS URL FORM ENCODED
const cors = require("cors");
app.use(cors()); 


 const user = require("./routes/user");
const categories = require("./routes/categories");
const task = require("./routes/task");
const filter = require("./routes/filter");
const sort = require("./routes/sort");

 // ====================  RUN THE APP  ====================
app.listen(8080, "localhost", () => {
    console.log("the server is running ");
  });
// ====================  API ROUTES [ ENDPOINTS ]  ====================
app.use("/user", user);
app.use("/categories", categories);
app.use("/task", task);
app.use("/filter",filter);
app.use("/sort",sort);
