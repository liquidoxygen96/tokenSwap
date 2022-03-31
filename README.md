#Basic NFT Swap using Next.js for web application development using hardhat, NextJs, Ethers and IPFS.

Basic Hardhat Shell commands:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

In order to use the underlying code, cloning the repository can be done using
$ git clone https://liquidocygen96/tokenSwap

Make sure to insatall the required dependencies by running
$ Yarn install

Initialize the local hardhat node in order to obtain the wallet addresses required to run tests
$ npx hardhat node

###Open the hardhat.config.js file in order to add 2 important variables. The first variable is the project id for your chosen rpc node provider, which in my case was Moralis Speedy nodes for initial testing on the Rinkeby chain. The second variable will be your developer wallet private key - keep safe by not having mainnet tokens and to save your private_key inside a .env secret file.###

**note, run the following in a seperate shell terminal, while keeping the hardhat node shell open**

Run the program in a developer environment:
$ npx hardhat run scripts/depoloy.js --network local host

or --network testnet depending on which chain you have configured the hardhat file networks.

View the front end product locally, run the following command:
$ npm run dev

Have fun with this, and for further help in researching the topic, check out Nader Dabits original post on Dev.to/dabit3 for great tutorials on your learning journey
