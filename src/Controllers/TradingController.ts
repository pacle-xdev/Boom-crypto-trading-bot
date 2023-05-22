import {
  creatWeb3,
  calculateProfit,
  getTransaction,
  getBEPTokenprice,
  getTokenSymbolPrice,
} from "../services/web3";
import { toNativeToken } from "../services/utils";
import BigNumber from "bignumber.js";

const nativeTokens = {
  ethereum: "ETH",
  goerli: "GoerliETH",
  binance: "BNB",
};

const RPC_URL = {
  goerli:
    "RPC_URL=https://goerli.infura.io/v3/84842078b09946638c03157f83405213",
  binance: "https://bsc-dataseed1.binance.org:443",
};

const BNBTokenAddress =
  "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c".toLowerCase();

export default class TradingClass {
  static async index(req: any, res: any) {
    return res.json("This is the app that calculate the profit of transaction");
  }

  static async getProfit(req: any, res: any) {
    const network = req.params.network;
    const web3 = creatWeb3(RPC_URL[network]);
    console.log(RPC_URL[network]);
    const txId = req.params.transactionID;
    console.log(txId);

    const gasPrice = await web3.eth.getGasPrice();
    const result = await getTransaction(txId);

    const gasFee = toNativeToken(result.effectiveGasPrice * result.gasUsed); //Gas Fee
    const busdPrice = await getBEPTokenprice(BNBTokenAddress); // BNB Price
    const gasWithEth = toNativeToken(gasPrice); //Gas Price
    const gasUsedWithEth = toNativeToken(result.gasUsed); //Gas Used

    const { status, payload } = await calculateProfit(txId);
    if (status === "error") {
      return res.json(payload);
    }
    //Cal all the values
    let inputAmount: any,
      originalOutAmount: any,
      outAmount: any,
      inputTokenInfo: any,
      outTokenInfo: any;
    let type = 0;

    /**************************
     * condition: true (when calculated input amount equals to out amount) false: (different)
     */
    if (
      payload.oldSwapSteps[0].inAmount === payload.oldSwapSteps.at(-1).outAmount
    ) {
      let index = -1;
      for (let i = 0; i < payload.oldSwapSteps.length - 1; i++) {
        if (
          payload.oldSwapSteps[i].outAmount !==
          payload.oldSwapSteps[i + 1].inAmount
        ) {
          index = i;
          break;
        }
      }

      type = 1;
      inputAmount = payload.oldSwapSteps[index].outAmount;
      originalOutAmount = payload.oldSwapSteps.at(index + 1).inAmount;
      outAmount = payload.currentSwapSteps.at(index + 1).inAmount;

      inputTokenInfo = await getTokenSymbolPrice(
        false,
        payload.oldSwapSteps[index]
      );

      outTokenInfo = await getTokenSymbolPrice(
        true,
        payload.oldSwapSteps.at(index + 1)
      );
      if (index === -1) {
        return res.json({ payload: "Operation error!" });
      }
    } else {
      inputAmount = payload.oldSwapSteps[0].inAmount;
      originalOutAmount = payload.oldSwapSteps.at(-1).outAmount;
      outAmount = payload.currentSwapSteps.at(-1).outAmount;
      inputTokenInfo = await getTokenSymbolPrice(true, payload.oldSwapSteps[0]);

      outTokenInfo = await getTokenSymbolPrice(
        false,
        payload.oldSwapSteps.at(-1)
      );
    }

    console.log(
      "Old Swap",
      payload.oldSwapSteps,
      "Current Swap",
      payload.currentSwapSteps
    );

    console.log("--------------", inputTokenInfo, outTokenInfo);

    const inputAmountByToken = toNativeToken(inputAmount);

    const originalOutAmountByToken = toNativeToken(originalOutAmount);

    const outAMountByToken = toNativeToken(outAmount);

    const originalProfit = new BigNumber(inputAmount)
      .minus(new BigNumber(originalOutAmount))
      .negated();

    const originalProfitByToken = toNativeToken(originalProfit);

    const currentProfit = new BigNumber(inputAmount)
      .minus(new BigNumber(outAmount))
      .negated();

    const originalProfitByBUSD = new BigNumber(originalProfitByToken).times(
      new BigNumber(outTokenInfo.price)
    );

    const currentProfitByToken = toNativeToken(currentProfit);
    const currentProfitByBUSD = new BigNumber(currentProfitByToken).times(
      new BigNumber(outTokenInfo.price)
    );

    const profitByTokenOriginalTransaction =
      type === 0
        ? new BigNumber(originalProfitByToken)
        : new BigNumber(originalProfitByToken).negated();
    const profitByTokenNewTransaction =
      type === 0
        ? new BigNumber(currentProfitByToken)
        : new BigNumber(currentProfitByToken).negated();
    const profitByBUSDOriginalTransaction =
      type === 0 ? originalProfitByBUSD : originalProfitByBUSD.negated();
    const profitByBUSDNewTransaction =
      type === 0 ? currentProfitByBUSD : currentProfitByBUSD.negated();

    return res.json({
      gasPrice: gasWithEth + nativeTokens[network],
      gasUsed: gasUsedWithEth + nativeTokens[network],
      gasFee: gasFee + nativeTokens[network],
      inputAmountByToken: inputAmountByToken + " " + inputTokenInfo.symbol,
      outAmountByTokenOriginalTransaction:
        originalOutAmountByToken + outTokenInfo.symbol,
      outAmountByTokenNewTransaction: outAMountByToken + outTokenInfo.symbol,
      profitByTokenOriginalTransaction,
      profitByTokenNewTransaction,
      profitByBUSDOriginalTransaction,
      profitByBUSDNewTransaction,
      BNBPrice: busdPrice,
    });
  }
}
