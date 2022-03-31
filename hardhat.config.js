require("@nomiclabs/hardhat-waffle");

//enable variable read from .env file using the dotenv library
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });
const { PRIVATE_KEY, INFURA_ID } = process.env;

// read-file method 2:
//const fs = require("fs");
//const infura_rinkeby_id = fs.readFileSync(".env").toString();

module.exports = {
  networks: {
    //hardhat local node: run using npx hardhat run script/deploy.js --network local host
    hardhat: {
      chainId: 1337,
    },
    //  Rinkeby testnet + infura_rinkeby_id
    testnet: {
      //change url, add variable to .env when you set-up your own rpc node: moralis is great
      url: "https://speedy-nodes-nyc.moralis.io/91a1c9977ce8f9a4f182dfc1/eth/rinkeby",
      accounts: [`${PRIVATE_KEY}`],
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
