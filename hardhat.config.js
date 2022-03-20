require("@nomiclabs/hardhat-waffle");

// read
const fs = require("fs");
const hmny_priv = fs.readFileSync(".env").toString();

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    //  unused configuration
    testnet: {
      url: "https://api.s0.b.hmny.io",
      accounts: [hmny_priv],
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
