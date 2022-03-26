require("@nomiclabs/hardhat-waffle");

// read
//const fs = require("fs");
//const priv = fs.readFileSync(".env").toString();

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    //  Rinkeby-ethereum testnet
    testnet: {
      url: "https://rinkeby.infura.io/v3/${process.env.infura_ipfs_id}",
      accounts: [priv_dev],
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
