require("@nomiclabs/hardhat-waffle");
//require("dotenv").config();
// read
const fs = require("fs");
//const priv_dev = fs.readFileSync(".env").toString().trim();
const infura_rinkeby_id = fs.readFileSync(
  [process.env.INFURA_RINKEBY_ID].toString().trim() || ""
);

module.exports = {
  //defaultNetwork: "testnet",

  networks: {
    hardhat: {
      chainId: 1337,
    },

    //  Rinkeby-ethereum testnet
    testnet: {
      url: "https://rinkeby.infura.io/v3/${infura_rinkeby_id}",
      accounts: [process.env.PRIVATE_KEY],
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
