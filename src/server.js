//require
require('dotenv').config({path: __dirname + '/../.env'});
require("express-async-errors");
require('./db/db-service')

//variables
const express = require('express'); 
const app = express();// app express
const apiRoutes = require('./routes/index'); // API Routes
const port = process.env.PORT || 8888; // port hardcode
const { checkOverload } = require("./helpers/check-connect");
const cors = require("cors");// Cần cors để chấp nhận domain khi gọi API từ Frontend (Luu y nha Duy)
const ratingLimit = require("express-rate-limit");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const BASE_URL = process.env.BASE_URL;
app.set("trust proxy", 1);
app.use(
  ratingLimit({
    windowMs: 15 * 60 * 100,
    max: 100, 
    message: 'Too many requests from this IP, please try again later', 
  })
);
app.use(cors({
  origin: BASE_URL,
}));
helmet({
  crossOriginResourcePolicy: false,
})
app.use(xssClean());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept" //Authorization
//   );
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "PUT POST PATCH DELETE GET");
//     return res.status(200).json({});
//   }
//   next();
// });
app.use('/', apiRoutes);


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
