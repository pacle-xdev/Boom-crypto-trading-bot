import BigNumber from "bignumber.js";
import Web3 from "web3";
import config from "../Config";
const { LPContractABI } = require("../abi/LPContractABI");
const routerAbi = require("../abi/RouterABI");
const factoryAbi = require("../abi/FactoryABI");
const { MdexRouterABI } = require("../abi/MdexRouterABI");
const { PancakeswapAbi } = require("../abi/PancakeswapAbi");
const { ERC20ABI } = require("../abi/ERC20ABI");

const BNBTokenAddress =
  "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c".toLowerCase();

const eventTypes = {
  transfer_event:
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  sync_event:
    "0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1",
  swap_event:
    "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
};

const token_exceptions = [
  "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  "0x55d398326f99059fF775485246999027B3197955",
  "0x5801D0e1C7D977D78E4890880B8E579eb4943276",
]; //[wbnb, busd, usdt, usdo]

const router = [
  "0x10ED43C718714eb63d5aA57B78B54704E256024E", //pancake
  "0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7", //apeswap
  "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506", //sushiswap
  "0x0C8094a69e8e44404371676f07B2C32923B5699c", //Sphynx router
];

//Note * : should be lowercase
const exchangeRouters = {
  "0xca143ce32fe78f1f7019d7d551a6402fc5350c73":
    "0x10ED43C718714eb63d5aA57B78B54704E256024E", //pancake
  "0x0841bd0b734e4f5853f0dd8d7ea041c241fb0da6":
    "0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7", //apeswap
  "0xc35dadb65012ec5796536bd9864ed8773abc74c4":
    "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506", //sushiswap
  "0x8ba1a4c24de655136ded68410e222cca80d43444":
    "0x0C8094a69e8e44404371676f07B2C32923B5699c", //Sphynx router
  "0xd6715a8be3944ec72738f0bfdc739d48c3c29349":
    "0xD654953D746f0b114d1F85332Dc43446ac79413d", // Nomiswap
  "0x858e3312ed3a876947ea49d572a7c42de08af7ee":
    "0x3a6d8cA21D1CF76F653A67577FA0D27453350dD8", //Biswap
  "0x3cd1c46068daea5ebb0d3f55f6915b10648062b8":
    "0x7DAe51BD3E3376B8c7c4900E9107f12Be3AF1bA8", //Mdex
  "0xbcfccbde45ce874adcb698cc183debcf17952812":
    "0x05ff2b0db69458a0750badebc4f9e13add608c7f", //pancake
  "0x86407bea2078ea5f5eb5a52b2caa963bc1f889da":
    "0x325E343f1dE602396E256B67eFd1F61C3A6B38Bd", //Babyswap
};

let web3: any;
export const creatWeb3 = (provider: any) => {
  web3 = new Web3(provider);
  return web3;
};

export const calculateProfit = async (
  tx: any
): Promise<{ status: any; payload: any }> => {
  console.log("-------------Get the path and transfers----------------");
  try {
    const { oldSwapSteps } = await getPath(tx);

    console.log(
      "=======================Old swap steps=============================="
    );
    console.log(oldSwapSteps);
    const outAmounts = await vExecuteLogs(oldSwapSteps);

    if (outAmounts.status === 0) {
      return {
        status: "error",
        payload:
          "We found the unregistered factory address or unverified contract. Please check this address " +
          outAmounts.payload +
          ". Registered swap: PancakeSwap, ApeSwap, SushiSwap, NomiSwap, Biswap, Mdex, Sphynx, Babyswap. To fix this, I need to learn about this new factory.",
      };
    }

    console.log("============================");

    console.log(outAmounts);

    return { status: "success", payload: outAmounts.payload };
  } catch (err) {
    return { status: "error", payload: err };
  }
};
/*************
 * type:
 * true -> inputAmount's symbol and price
 * false -> outAmount's symbol and price
 */
export const getTokenSymbolPrice = async (type: any, inputStep: any) => {
  let symbol: any, price: any;
  if (type) {
    const tokenContract = new web3.eth.Contract(ERC20ABI, inputStep.from);
    symbol = await tokenContract.methods.symbol().call();
    price = await getBEPTokenprice(inputStep.from);
  } else {
    const tokenContract = new web3.eth.Contract(ERC20ABI, inputStep.to);
    symbol = await tokenContract.methods.symbol().call();
    price = await getBEPTokenprice(inputStep.to);
  }

  return { symbol, price };
};

const vExecuteLogs = async (oldSwapSteps: any) => {
  let currentSwapSteps = [];
  for (let oldSwap of oldSwapSteps) {
    try {
      const pairContract = new web3.eth.Contract(
        LPContractABI,
        oldSwap.pairContractAddress
      );

      const reserve = await pairContract.methods.getReserves().call();
      const res = await pairContract.methods.factory().call();
      const factoryAddress = res.toLowerCase();
      const routerAddress = exchangeRouters[factoryAddress];
      console.log("Factory", factoryAddress, "RouterAddress", routerAddress);
      if (!routerAddress) {
        return { status: 0, payload: factoryAddress };
      }
      let outStep: any;

      switch (factoryAddress.toLowerCase()) {
        case "0xd6715a8be3944ec72738f0bfdc739d48c3c29349":
          outStep = await getAmountByType(
            1,
            routerAbi.Nomiswap,
            routerAddress,
            oldSwap,
            currentSwapSteps.at(-1),
            reserve
          );
          break;
        case "0x858e3312ed3a876947ea49d572a7c42de08af7ee":
          outStep = await getAmountByType(
            1,
            routerAbi.Nomiswap,
            routerAddress,
            oldSwap,
            currentSwapSteps.at(-1),
            reserve
          );
          break;
        case "0x3cd1c46068daea5ebb0d3f55f6915b10648062b8":
          outStep = await getAmountByType(
            2,
            MdexRouterABI,
            routerAddress,
            oldSwap,
            currentSwapSteps.at(-1),
            reserve
          );
          MdexRouterABI;
          break;
        default:
          outStep = await getAmountByType(
            0,
            routerAbi.RouterABI,
            routerAddress,
            oldSwap,
            currentSwapSteps.at(-1),
            reserve
          );
          break;
      }

      currentSwapSteps.push(outStep);
    } catch (err) {
      return {
        status: 0,
        payload: err,
      };
    }
  }

  return {
    status: 1,
    payload: { oldSwapSteps, currentSwapSteps },
  };
};

const getAmountByType = async (
  type: any,
  abi: any,
  routerAddress: any,
  oldSwap: any,
  currentSwap: any,
  reserve: any
) => {
  let outStep: any;
  let outAmount: any;
  const routerContract = new web3.eth.Contract(abi, routerAddress);

  if (!currentSwap) {
    outStep = { ...oldSwap, inAmount: oldSwap.inAmount };
  } else {
    outStep = { ...oldSwap, inAmount: currentSwap.outAmount };
  }

  switch (type) {
    case 0:
      console.log("here=====================0", outStep.inAmount);

      if (!oldSwap.reverse) {
        outAmount = await routerContract.methods
          .getAmountOut(new BigNumber(outStep.inAmount), reserve[0], reserve[1])
          .call();
      } else {
        outAmount = await routerContract.methods
          .getAmountOut(new BigNumber(outStep.inAmount), reserve[1], reserve[0])
          .call();
      }
      break;
    case 1:
      console.log("here=====================1");

      if (!oldSwap.reverse) {
        outAmount = await routerContract.methods
          .getAmountOut(
            new BigNumber(outStep.inAmount),
            reserve[0],
            reserve[1],
            1
          )
          .call();
      } else {
        outAmount = await routerContract.methods
          .getAmountOut(
            new BigNumber(outStep.inAmount),
            reserve[1],
            reserve[0],
            1
          )
          .call();
      }
      break;
    case 2:
      console.log("here=====================2");

      if (!oldSwap.reverse) {
        outAmount = await routerContract.methods
          .getAmountOut(
            new BigNumber(outStep.inAmount),
            reserve[0],
            reserve[1],
            outStep.from,
            outStep.to
          )
          .call();
      } else {
        outAmount = await routerContract.methods
          .getAmountOut(
            new BigNumber(outStep.inAmount),
            reserve[1],
            reserve[0],
            outStep.from,
            outStep.to
          )
          .call();
      }
      break;
    default:
      break;
  }
  console.log(typeof outAmount);

  const newCurrentSwap = { ...outStep, outAmount: outAmount };
  console.log(newCurrentSwap);
  return newCurrentSwap;
};

export const getBEPTokenprice = async (address: any) => {
  const BUSDTokenAddress = "0xe9e7cea3dedca5984780bafc599bd69add087d56";
  let pancakeSwapContract =
    "0x10ED43C718714eb63d5aA57B78B54704E256024E".toLowerCase();

  const bnbToSell = web3.utils.toWei("1", "ether");
  let amountOut: any;

  try {
    let router = await new web3.eth.Contract(
      PancakeswapAbi,
      pancakeSwapContract
    );
    amountOut = await router.methods
      .getAmountsOut(bnbToSell, [address, BUSDTokenAddress])
      .call();
    amountOut = web3.utils.fromWei(amountOut[1]);
  } catch (err) {
    console.log(err);
  }

  return amountOut;
};

export const getTransaction = async (tx: any) => {
  console.log("transaction ID", tx);
  const trx = await web3.eth.getTransactionReceipt(tx);

  return trx;
};

const getPath = (tx: any): any =>
  new Promise(async (resolve, reject) => {
    let oldSwapSteps = [];
    try {
      const result = await web3.eth.getTransactionReceipt(tx);

      for await (let log of result.logs) {
        if (log.topics[0] === eventTypes.swap_event) {
          const LPAddress = log.address;
          const LPContract = new web3.eth.Contract(LPContractABI, LPAddress);
          const tkn0 = await LPContract.methods.token0().call();
          const tkn1 = await LPContract.methods.token1().call();

          const indata0 = parseInt(log.data.substring(0, 66), 16);
          const indata1 = parseInt(log.data.substring(66, 130), 16);
          const outdata0 = parseInt(log.data.substring(130, 194), 16);
          const outdata1 = parseInt(log.data.substring(194, 258), 16);

          if (indata0 === 0) {
            oldSwapSteps.push({
              pairContractAddress: LPAddress,
              reverse: true,
              from: tkn1,
              to: tkn0,
              inAmount: indata1,
              outAmount: outdata0,
            });
          } else {
            oldSwapSteps.push({
              pairContractAddress: LPAddress,
              reverse: false,
              from: tkn0,
              to: tkn1,
              inAmount: indata0,
              outAmount: outdata1,
            });
          }
        }
      }

      resolve({ oldSwapSteps });
    } catch (err) {
      reject(err);
    }
  });

export default web3;
