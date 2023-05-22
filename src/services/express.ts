import express from "express";
import bodyParser from "body-parser";

export default (routes: any) => {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/", routes);
  return app;
};
