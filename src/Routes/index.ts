import { Router } from "express";
import Controllers from "../Controllers";

const router = Router();

router.get(
  "/get-profit/:network/:transactionID",
  Controllers.Trading.getProfit
);

router.get("/", Controllers.Trading.index);

export default router;
