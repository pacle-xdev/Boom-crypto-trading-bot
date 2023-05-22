import Web3 from "web3";
import config from "../Config";
import BigNumber from "bignumber.js";

function eToNumber(num) {
  let sign = "";
  (num += "").charAt(0) == "-" && ((num = num.substring(1)), (sign = "-"));
  let arr = num.split(/[e]/gi);
  if (arr.length < 2) return sign + num;
  let dot = (0.1).toLocaleString().substr(1, 1),
    n = arr[0],
    exp = +arr[1],
    w = (n = n.replace(/^0+/, "")).replace(dot, ""),
    pos = n.split(dot)[1] ? n.indexOf(dot) + exp : w.length + exp,
    L = pos - w.length,
    s = "" + BigInt(w);
  w =
    exp >= 0
      ? L >= 0
        ? s + "0".repeat(L)
        : r()
      : pos <= 0
      ? "0" + dot + "0".repeat(Math.abs(pos)) + s
      : r();
  L = w.split(dot);
  if ((L[0] == 0 && L[1] == 0) || (+w == 0 && +s == 0)) w = 0; //** added 9/10/2021
  return sign + w;
  function r() {
    return w.replace(new RegExp(`^(.{${pos}})(.)`), `$1${dot}$2`);
  }
}

export const toNativeToken = (amount: any) => {
  const web3 = new Web3();
  console.log(eToNumber(amount.toString()));
  return web3.utils.fromWei(
    web3.utils.toBN(eToNumber(amount.toString())),
    "ether"
  );
};
