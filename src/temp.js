$("#buy").click(BuyNow);
var transfer_event =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
var sync_event =
  "0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1";

var token_exceptions = [
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
  "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506", //sushiswap
  "0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7", //apeswap
  "0x10ED43C718714eb63d5aA57B78B54704E256024E", //pancake
];

var routerABI = [
  {
    inputs: [
      { internalType: "address", name: "_factory", type: "address" },
      { internalType: "address", name: "_WETH", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "WETH",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenA", type: "address" },
      { internalType: "address", name: "tokenB", type: "address" },
      { internalType: "uint256", name: "amountADesired", type: "uint256" },
      { internalType: "uint256", name: "amountBDesired", type: "uint256" },
      { internalType: "uint256", name: "amountAMin", type: "uint256" },
      { internalType: "uint256", name: "amountBMin", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
    ],
    name: "addLiquidity",
    outputs: [
      { internalType: "uint256", name: "amountA", type: "uint256" },
      { internalType: "uint256", name: "amountB", type: "uint256" },
      { internalType: "uint256", name: "liquidity", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "amountTokenDesired", type: "uint256" },
      { internalType: "uint256", name: "amountTokenMin", type: "uint256" },
      { internalType: "uint256", name: "amountETHMin", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
    ],
    name: "addLiquidityETH",
    outputs: [
      { internalType: "uint256", name: "amountToken", type: "uint256" },
      { internalType: "uint256", name: "amountETH", type: "uint256" },
      { internalType: "uint256", name: "liquidity", type: "uint256" },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "factory",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amountOut", type: "uint256" },
      { internalType: "uint256", name: "reserveIn", type: "uint256" },
      { internalType: "uint256", name: "reserveOut", type: "uint256" },
    ],
    name: "getAmountIn",
    outputs: [{ internalType: "uint256", name: "amountIn", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "uint256", name: "reserveIn", type: "uint256" },
      { internalType: "uint256", name: "reserveOut", type: "uint256" },
    ],
    name: "getAmountOut",
    outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amountOut", type: "uint256" },
      { internalType: "address[]", name: "path", type: "address[]" },
    ],
    name: "getAmountsIn",
    outputs: [
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "address[]", name: "path", type: "address[]" },
    ],
    name: "getAmountsOut",
    outputs: [
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amountA", type: "uint256" },
      { internalType: "uint256", name: "reserveA", type: "uint256" },
      { internalType: "uint256", name: "reserveB", type: "uint256" },
    ],
    name: "quote",
    outputs: [{ internalType: "uint256", name: "amountB", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenA", type: "address" },
      { internalType: "address", name: "tokenB", type: "address" },
      { internalType: "uint256", name: "liquidity", type: "uint256" },
      { internalType: "uint256", name: "amountAMin", type: "uint256" },
      { internalType: "uint256", name: "amountBMin", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
    ],
    name: "removeLiquidity",
    outputs: [
      { internalType: "uint256", name: "amountA", type: "uint256" },
      { internalType: "uint256", name: "amountB", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "liquidity", type: "uint256" },
      { internalType: "uint256", name: "amountTokenMin", type: "uint256" },
      { internalType: "uint256", name: "amountETHMin", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
    ],
    name: "removeLiquidityETH",
    outputs: [
      { internalType: "uint256", name: "amountToken", type: "uint256" },
      { internalType: "uint256", name: "amountETH", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "liquidity", type: "uint256" },
      { internalType: "uint256", name: "amountTokenMin", type: "uint256" },
      { internalType: "uint256", name: "amountETHMin", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
    ],
    name: "removeLiquidityETHSupportingFeeOnTransferTokens",
    outputs: [{ internalType: "uint256", name: "amountETH", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "liquidity", type: "uint256" },
      { internalType: "uint256", name: "amountTokenMin", type: "uint256" },
      { internalType: "uint256", name: "amountETHMin", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "bool", name: "approveMax", type: "bool" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" },
    ],
    name: "removeLiquidityETHWithPermit",
    outputs: [
      { internalType: "uint256", name: "amountToken", type: "uint256" },
      { internalType: "uint256", name: "amountETH", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "liquidity", type: "uint256" },
      { internalType: "uint256", name: "amountTokenMin", type: "uint256" },
      { internalType: "uint256", name: "amountETHMin", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "bool", name: "approveMax", type: "bool" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" },
    ],
    name: "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens",
    outputs: [{ internalType: "uint256", name: "amountETH", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenA", type: "address" },
      { internalType: "address", name: "tokenB", type: "address" },
      { internalType: "uint256", name: "liquidity", type: "uint256" },
      { internalType: "uint256", name: "amountAMin", type: "uint256" },
      { internalType: "uint256", name: "amountBMin", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "bool", name: "approveMax", type: "bool" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" },
    ],
    name: "removeLiquidityWithPermit",
    outputs: [
      { internalType: "uint256", name: "amountA", type: "uint256" },
      { internalType: "uint256", name: "amountB", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amountOut", type: "uint256" },
      { internalType: "address[]", name: "path", type: "address[]" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
    ],
    name: "swapETHForExactTokens",
    outputs: [
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amountOutMin", type: "uint256" },
      { internalType: "address[]", name: "path", type: "address[]" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
    ],
    name: "swapExactETHForTokens",
    outputs: [
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amountOutMin", type: "uint256" },
      { internalType: "address[]", name: "path", type: "address[]" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
    ],
    name: "swapExactETHForTokensSupportingFeeOnTransferTokens",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "uint256", name: "amountOutMin", type: "uint256" },
      { internalType: "address[]", name: "path", type: "address[]" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
    ],
    name: "swapExactTokensForETH",
    outputs: [
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "uint256", name: "amountOutMin", type: "uint256" },
      { internalType: "address[]", name: "path", type: "address[]" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
    ],
    name: "swapExactTokensForETHSupportingFeeOnTransferTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "uint256", name: "amountOutMin", type: "uint256" },
      { internalType: "address[]", name: "path", type: "address[]" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
    ],
    name: "swapExactTokensForTokens",
    outputs: [
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "uint256", name: "amountOutMin", type: "uint256" },
      { internalType: "address[]", name: "path", type: "address[]" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
    ],
    name: "swapExactTokensForTokensSupportingFeeOnTransferTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amountOut", type: "uint256" },
      { internalType: "uint256", name: "amountInMax", type: "uint256" },
      { internalType: "address[]", name: "path", type: "address[]" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
    ],
    name: "swapTokensForExactETH",
    outputs: [
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amountOut", type: "uint256" },
      { internalType: "uint256", name: "amountInMax", type: "uint256" },
      { internalType: "address[]", name: "path", type: "address[]" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
    ],
    name: "swapTokensForExactTokens",
    outputs: [
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
];

var pair = [];

var transfers = [];
var path = [];
var bnbVal = 0;
var limiter = 0;

var output1 = 0;
var tokenDecimal = [];
tokenDecimal[0] = 18; //WBNB
tokenDecimal[1] = 18;

function BuyNow() {
  pair = [];
  transfers = [];
  path = [];
  bnbVal = 0;
  limiter = 0;

  $("#router1").text("");
  $("#router2").text("");
  $("#amount").val("");
  $("#output1").val("");
  $("#output2").val("");
  $("#finalOut").text("");
  var transaction = $("#tx").val(); //'0x769522e956209c1710db2f9fa129f06be559e98a93a482f4b0be81890636dcd9';

  web3.eth.getTransactionReceipt(transaction, function (err, tx) {
    var j = 0;
    $.each(tx.logs, function (i) {
      if (tx.logs[i].topics[0] == transfer_event) {
        var amount = parseInt(tx.logs[i].data, 16);
        transfers[j] = [
          web3.eth.abi.decodeParameter("address", tx.logs[i].topics[1]),
          web3.eth.abi.decodeParameter("address", tx.logs[i].topics[2]),
          amount,
        ]; //sender
        j++;
      }

      if (tx.logs[i].topics[0] == sync_event) {
        if (limiter == 0) {
          var LPAddress = tx.logs[i].address;
          var LPContract = new web3.eth.Contract(LPContractABI, LPAddress);
          LPContract.methods
            .token0()
            .call()
            .then((tkn) => {
              if (jQuery.inArray(tkn, token_exceptions) == -1) {
                limiter++;
                path[1] = tkn;
              }
            });

          LPContract.methods
            .token1()
            .call()
            .then((tkn) => {
              path[0] = tkn;
            });
        }
      }
    });
  });

  setTimeout(function () {
    findTokenDec();
    console.log(transfers, path);

    for (var i = 0; i < router.length; i++) {
      checkForSwaps(i);
    }

    setTimeout(function () {
      for (var i = 0; i < router.length - 1; i++) {
        for (var j = i + 1; j < router.length; j++) {
          if (pair[i] == "" || pair[j] == "") {
            continue;
          }
          routerContract[i] = new web3.eth.Contract(routerABI, router[i]);
          routerContract[j] = new web3.eth.Contract(routerABI, router[j]);

          Buy(
            routerContract[i],
            routerContract[j],
            path[0],
            path[1],
            transfers[0][2].toString(),
            router[i],
            router[j]
          );

          //$('#router1').text(findRouter(router[i]));
          //$('#router2').text(findRouter(router[j]));
          //$('#amount').val();
        }
      }
    }, 3000);
  }, 3000);
}

var routerContract = [];
async function checkForSwaps(ii) {
  routerContract[ii] = new web3.eth.Contract(routerABI, router[ii]);

  routerContract[ii].methods
    .factory()
    .call()
    .then((factory) => {
      var factoryContract = new web3.eth.Contract(factoryABI, factory);

      factoryContract.methods
        .getPair(path[1], path[0])
        .call()
        .then((p) => {
          if (p != "0x0000000000000000000000000000000000000000") {
            pair[ii] = p;
          } else {
            pair[ii] = "";
          }
        });
    });
}

function findTokenDec() {
  var TokenContract = new web3.eth.Contract(tokenABI, path[1]);
  TokenContract.methods.decimals().call(function (error, d) {
    tokenDecimal[1] = d;
  });
}

async function Buy(dexRouter, dexRouter2, tokenA, tokenB, input, swap1, swap2) {
  await dexRouter.methods
    .getAmountsOut(input, [tokenA, tokenB])
    .call()
    .then((prc) => {
      //$('#output1').val(prc[1] / Math.pow(10, tokenDecimal[1]));
      console.log(prc[1] / Math.pow(10, tokenDecimal[1]));
      output1 = prc[1];
      Sell(
        dexRouter2,
        path[1],
        path[0],
        prc[1],
        swap1,
        swap2,
        prc[1] / Math.pow(10, tokenDecimal[1])
      );
    });
}

async function Sell(dexRouter, tokenA, tokenB, input, swap1, swap2, op1) {
  //console.log(dexRouter);
  await dexRouter.methods
    .getAmountsOut(input, [tokenA, tokenB])
    .call()
    .then((prc) => {
      output1 = prc[1];
      //$('#output2').val(prc[1] / Math.pow(10, tokenDecimal[0]));
      console.log(prc[1] / Math.pow(10, tokenDecimal[0]));

      //$('#finalOut').text((output1 / Math.pow(10, tokenDecimal[0])) - (transfers[0][2] / Math.pow(10, tokenDecimal[0])));

      appendcode(
        transfers[0][2].toString() / Math.pow(10, tokenDecimal[0]),
        findRouter(swap1),
        findRouter(swap2),
        op1,
        prc[1] / Math.pow(10, tokenDecimal[0]),
        output1 / Math.pow(10, tokenDecimal[0]) -
          transfers[0][2] / Math.pow(10, tokenDecimal[0])
      );
    });
}

function findRouter(r) {
  var routerName = "N/A";
  if (r == "0x10ED43C718714eb63d5aA57B78B54704E256024E") {
    routerName = "Pancake";
  } else if (r == "0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7") {
    routerName = "ApeSwap";
  } else if (r == "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506") {
    routerName = "SushiSwap";
  } else if (r == "0x0C8094a69e8e44404371676f07B2C32923B5699c") {
    routerName = "Sphynx";
  }

  return routerName;
}

function gup(name, url) {
  if (!url) url = location.href;
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(url);
  return results == null ? null : results[1];
}

function appendcode(amnt, swap1, swap2, output1, output2, retrn) {
  $("#mainDiv").append(`<div class="main-inner col-md-4">
            <label class="lab">
                <span class="spa">Amount Invested</span>
                <input class="inp" type="text" name="amount-invested" id="" placeholder="Enter Amount Invested" value="${amnt}">

            </label>
            <label class="lab">
                <span class="spa">${swap1} Output</span>
                <input class="inp" type="text" name="pancake-swap-output" id="" placeholder="Enter Amount" value="${output1}">
            </label>
            <label class="lab">
                <span class="spa">${swap2} Output</span>
                <input class="inp" type="text" name="ape-swap-output" id="" placeholder="Enter Amount" value="${output2}">
            </label>
                <div class="lower" >
                    <span class="spaa">Final Return :</span><br>
                    <span class="spaa">${retrn} BNB</span><br>
                    <span class="spaa"></span>
                </div>

        </div>`);
}
