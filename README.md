# ZtickerZ
> This is an Ethereum Decentralized Game built as a final project of the ConsenSys's Ethereum Developer Program.

ZtickerZ is a basic Ethereum game that allows to collect stickers onto an Ethereum Smart Contract.
This game leverages the power of an ERC20 token to incentivize gaming and it uses an ERC721 Non-Fungible Token as asset collection.
All you have to do is buy some stickers packs, trade the stickers and get the final reward upon album completion. Enjoy!

## Addresses
Interact with this contract on Ethereum!

URL:  http://ztickerz.samuelerodi.info

IPFS: https://ipfs.io/ipfs/QmXKa7czE4VaXRWzBHYwyLW1Lhdd2Y8fZesq7W1zddcrZF/
  or: http://ztickerzonipfs.samuelerodi.info

Rinkeby:
  Migrations:     <a href="https://rinkeby.etherscan.io/address/0x0c2af2fe2228d5bd7f92f30305ca52983e48017b"> 0x0c2af2fe2228d5bd7f92f30305ca52983e48017b</a>
  ZtickyZtorage:  <a href="https://rinkeby.etherscan.io/address/0x36e4c18184e85cf52ca18067c6321683d593d090"> 0x36e4c18184e85cf52ca18067c6321683d593d090</a>
  ZtickyCoinZ:    <a href="https://rinkeby.etherscan.io/address/0xabed85c03fe5fb13e05959f333864071c5175050"> 0xabed85c03fe5fb13e05959f333864071c5175050</a>
  ZtickerZ:       <a href="https://rinkeby.etherscan.io/address/0xba8d6172da1a00cf052194cb22fa465a0fcdd942"> 0xba8d6172da1a00cf052194cb22fa465a0fcdd942</a>


## GOAL
This project aims to BUIDL a decentralized game that emulates a stickers album collection on the Ethereum network while maintaining a strong playing incentive across users through several rewards based in ETH unlocked upon collection completion.  
In parallel, users get also rewards in ZCZ, an ERC20 token that is generated by the platform and that is used to estimate reward amounts while determining the user reputation on the platform.

## Ruleset
The game is quite simple in reality:

- Buy a Sticker Pack.
- You will receive some stickers with a precise sticker number.
- You will also receive a few freshly minted ZCZ based on the rarity of the stickers found.
- Exchange your duplicate stickers on the platform using ZCZ.
- Iterate until you complete the album.
- Once you are done, redeem your reward and get on the leaderboard.
- Specify an amount of ZCZ you would like to burn in change of your ETH reward. The quantity of ZCZ you burn increases exponentially the amount of ETH you receive.


Feel free to contribute or get in touch at samuele.rodi@gmail.com
A lot of game features still in roadmap...


## Basic Setup
This repo comes with everything you need to start with smart contracts development and a react app, and it has been mainly developed in a Vagrant environment.
Running using Vagrant is recommended.

### Required step

1. Rename the file secret-template.js into secret.js and populate it using your Infura credentials and Mnemonic phrases for truffle console.

## Run using Vagrant
1. Make sure to have virtualbox and vagrant installed

2. Run
    ```javascript
    vagrant up
    ```
    It will automatically deploy a virtual environment running all the provisioning scripts under vagrant-xxx.ssh and setup a local Ethereum node with ganache-cli and migrate all the needed contracts.
    Make sure to have a good and neutral internet connections since Vagrant use it to download the required elements or you might need to reinstall the needed tools and dependencies as described in the provisioning scripts

3. SSH to vm with
    ```javascript
    vagrant ssh
    ```
4. You can start the frontend in development mode with
    ```javascript
    npm start
    ```
5. Navigate using your browser to localhost:3000 making sure to have Metamask or an alternative wallet installed and you are ready to play

### Need a build version?
1. Compile contracts with
    ```javascript
    truffle compile
    ```
2. Migrate them anywhere you need with
    ```javascript
    truffle migrate
    ```
3. Create the app build with
    ```javascript
    npm run build
    ```

### Optional hack for development usability
1. Using webpack in a Vagrant environment is a pain in the neck as it does not auto reload the webpages in case of modification during development.
To make webpack live reload working properly within vagrant:
Edit:
vi node_modules/react-scripts/config/webpackDevServer.config.js

Add the option:
```javascript
watchOptions: {
  poll: true
}
```

2. By default the React App build folder will use /build as default build directory, eventually overwriting the compiled contracts.
To change the build folder:
Edit:
vi node_modules/react-scripts/config/paths.js

Modify any reference to the build directory by adding your favourite path location:
```javascript
  appBuild: resolveApp('build'),  
```
This appears three times.


## Classical installation

1. Make sure to have Node version 8.11 and Python 2.7 installed

2. Install Truffle and Ganache CLI globally. If you prefer, the graphical version of Ganache works as well!
    ```javascript
    npm install -g truffle
    npm install -g ganache-cli
    npm install -g create-react-app
    ```

3. Run the development blockchain, recommended passing in a blocktime. Otherwise, its difficult to track things like loading indicators because Ganache will mine instantly.
    ```javascript
    // 3 second blocktime.
    ganache-cli -b 3
    ```

4. Compile and migrate the smart contracts. Note inside the truffle console we don't preface commands with `truffle`.
    ```javascript
    truffle compile
    truffle migrate
    ```

5. Run the webpack server for front-end hot reloading (outside the development console). Smart contract changes must be manually recompiled and migrated.
    ```javascript
    // Serves the front-end on http://localhost:3000
    npm start
    ```

6. Run tests against your smart contracts. Note the command varies slightly if you're in or outside of the development console.
    ```javascript
    truffle test
    ```


7. To build the application for production, use the build command. A production build will be in the build folder.
    ```javascript
    npm run build
    ```


## Further details for ConsenSys development Program:
  User Stories :
  Avoiding Common Attacks :
  Design Pattern Decisions :
