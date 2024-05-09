require("dotenv").config();
const express = require("express")
const cors = require("cors");
const compression = require("compression");
const uuid = require("uuid").v4;
const conn = require("../config/database")
const appModules = require("./modules/index")
const bodyParser = require("body-parser")

const app = express()

const PORT = process.env.PORT || 3000


const options = {
  origin: "*",
  methods: "GET,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(options))
app.use(compression())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.headers["request_id"] = uuid();
  // console.log(req.headers);
  next();
});

// load all app modules
app.use(appModules);

// Check database connection
conn.connect((err) => {
    if (err) {
      console.error("Error connecting to database: ", err);
      return;
    }
    console.log("Database connected successfully");
  });


app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})