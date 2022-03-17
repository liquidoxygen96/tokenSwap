require("@nomiclabs/hardhat-waffle");

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    //  unused configuration
    //  testnet: {
    //    url: "https://api.s0.b.hmny.io",
    //    accounts: [process.env.privateKey]
    //  }
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
