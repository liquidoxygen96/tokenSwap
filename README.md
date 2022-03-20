Basic NFT Swap using Next.js for web application development, Harmony testnet capabilities, hardhat for local network compilation and script based testing as well as ethers for web-to-wallet connections.

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
$ Yarn init

Initialize the local hardhat node in order to obtain the wallet addresses required to run tests
$ npx hardhat node


**note, run the following in a seperate shell terminal, while keeping the hardhat node shell open** 
Run the program in a developer environment:
$ npx hardhat run scripts/depoloy.js --network local host 

depending on your hardhat.config file, and which blockchain you wish to deploy to, the previous code may be run on your configured mainnet 
$ npx hardhat run scripts/deploy.js --network mainnet 

to view the front end product locally, run the following commang:
$ npm run dev 

