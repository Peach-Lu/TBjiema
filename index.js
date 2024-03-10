const fs = require("fs");
const http = require("http");
const data = '1|7FE78DCBD19F3AE33772B60FBBDA058483FF09B81AE29306|2024-03-10T21:04:54|hkg|852||COM26|44553295'
// console.log(fs);
// console.log(http);
const data = fs.readFileSync("./src/api/api.js", "utf-8");
console.log(data);
http.createServer("8888", "127.0.0.1", () => {
  console.log("start server");
});
