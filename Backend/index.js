console.clear();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();


const app = express();
const dbURI = process.env.dbURI;
const PORT = process.env.PORT;


// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Routes
const userRoutes = require('./Routes/User.Routes')


//Routes Middlewares

app.use('/api/v1', userRoutes)






/* MONGODB OPTIONS*/
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
  };


  mongoose.connect(dbURI, options).then((res) => {
    console.log("Connected to", res.connections[0].name);
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  });