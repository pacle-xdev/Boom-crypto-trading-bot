import http from "http";
import express from "./services/express";
import routes from "./Routes";
import config from "./Config";

const app = express(routes);
const server = http.createServer(app);

server.listen(config.PORT, () => {
  return console.log("Server is running on port %d", config.PORT);
});
