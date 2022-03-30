require("@nomiclabs/hardhat-waffle");

//enable variable read from .env file using the dotenv library
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });
const { PRIVATE_KEY, INFURA_ID } = process.env;

//console.log(INFURA_ID);

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
      url: "https://rinkeby.infura.io/v3/`${INFURA_ID}`",
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
