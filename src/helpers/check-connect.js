const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const OVERLOAD_SECOND = 10000;

// Count number connection on Database
const countConnect = () => {
  return mongoose.connections.length;
};

// Check overload
const checkOverload = () => {
  setInterval(() => {
    const numConnection = countConnect();
    const numCores = os.cpus().length;
    const memoryUsing = process.memoryUsage().rss;
    //Assuming each CPU CORE only allow 10 connect
    const maxConnection = numCores * 10;
    // Check memory using
    console.log(`Active connection: ${numConnection}`);
    console.log(`Memory using::: ${memoryUsing / 1024 / 1024} MB`);
    if (numConnection > maxConnection - 10) {
      console.log("Overload connection");
    }
  }, OVERLOAD_SECOND);
};

module.exports = { checkOverload };