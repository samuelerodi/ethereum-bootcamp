# ZtickerZ
> This is an Ethereum Decentralized Game built as a final project of the ConsenSys's Ethereum Developer Program.

Ethereum Sticky Stickers is a basic Ethereum game that allows to simulate a stickers collection on a decentralized basis onto an Ethereum Smart Contract.

## GOAL
This project aims to BUIDL a decentralized game that emulates a stickers album collection on the Ethereum network with the goal of maintaining a strong playing incentive across user by giving interesting ETH rewards upon collection completion.  


### Ruleset
The game is pretty simple so far:

- Buy a Sticker Pack
- Exchange your duplicate stickers
- Complete the album


Feel free to contribute.
Additional game features are in roadmap...


## TODO

### Frontend overview
  Frontend will have three tabs:
    - Profile Tab with Stickers by user, Token Balance, Reward Button, Unwrap Button
    - Market Tab with my item on sale, Items on sale filtered either by stn or user
    - Stats Tab with market Mintable tokens

### Stickers storage
- Stickers Storage Model (for upgradability):
    Store albums of users
    Each user has an album with all stickers
    Create permission system to allow only frontend contract to modify data
    Create emergency system

- Implement getters and setters:
    Get album Stickers
    Get stickers set from the user albums by specifying its stn
    Set stickers to a specific user album specifying a stn
    Remove stickers from a user album

### Stickers unwrap
- Create logic contract:
    Payable function that generate a set of stickers by a user
    Random number generation to create sId and derive stn from sId
    Function that evaluates rarity of a given sId. Use SafeMath.
    Mint tokens based on rarity

- Frontend:
    Create tab to visualize all the stickers in the album divided by stn
    Create button 'Purchase' to buy a stickers pack
    Create unwrap box to visualize the newly generated stickers
    Create box that shows the rarity of all stickers + earnable amount

### Stickers trading
- Create Market Storage Contract:
    Items to be sold, with sId, stn, price, user
    Function to add a item to the market
    Function to remove item from the market
    Getter to retrieve stickers
    Getter to retrieve stickers in market by stn
    Getter to retrieve stickers in market by user
    Create permission system to allow only frontend contract to modify data
    Create emergency system

- Add to Logic Contract:
    Function to create Market
    Function to settle the trade
    Function to revoke the trade
    Address resolver to get the market contract

- Frontend:
    Create specific market tab
    Visualize the list of item on sale
    Visualize your item on sale
    Filter by stn

### Token minting
- Create ERC20 Token Standard:
    Mintable
    Pausable (by owner)
    Burnable (by owner)
    Add transfer function by logic contract

- Add to Logic Contract:
    create minting function during stickers generation
    create burning function during reward receive
    Use token to trade stickers during trades

- Frontend
    Create Balance box in Profile Tab

### Reward withdrawal
- Add to Logic Contract:
    create function that burns token upon album completion verification apply a commission to owner and refund user.
    create selfdestruct for upgradability

- Frontend:
    Add logic button to redeem ETH reward

### -> Toward testnet
- Get a domain
- Migrate contract on rinkeby
- Deploy on IPFS for frontend files storage
- Start Termination Proxy (HAProxy) to run with HTTPS

### Project completion
- Write tests
- Write README.md
- Write user_stories.md
- Write design_pattern_decision.md
- Write avoiding_common_attacks.md

## Glossary
- stn = sticker number
- sId = sticker unique id


## DEV GUIDELINES

1.	Use Truffle and successfully run:
		- compile
		- migrate
		- test
2.	Use clear commented code
3.	Write at least 5 tests / contract
4.	Deploy on a frontend dev server
5.	Implement library/EthPM
6.	Implement emergency stop
7.  Implement and explain the usage of other design pattern adopted

## DOC GUIDELINES

1. Create a README.md file with clearly explained
	- What is the project about?
	- Setup and run procedure for local dev server deployment
  - Write user stories to let clearly understand the goal and usability of the application
2.	Write a design_pattern_decision.md where you explain the smart contract design decision taken, emergency procedure, upgradability feature, libraries integration, formal verification
3.	Write an avoiding_common_attacks.md where you explain what are the critical security points of your application and how you solve them in order to mitigate and prevent vulnerabilities
4.	Explain any other specific design pattern adopted



## HACK
1. To make webpack live reload working properly within vagrant:
Edit:
vi node_modules/react-scripts/config/webpackDevServer.config.js

Add:
watchOptions: {
  poll: true
}

2. To change build folder:
Edit:
vi node_modules/react-scripts/config/paths.js
Modify:
  appBuild: resolveApp('build'),  
This appears three times.

## Setup
This repo comes with everything you need to start using smart contracts from a react app with Drizzle. It includes `drizzle`, `drizzle-react` and `drizzle-react-components` to give you a complete overview of Drizzle's capabilities.

1. Rename the file secret-template.js into secret.js and populate it using your Infura credentials and Mnemonic phrases.

## Run using Vagrant
1. Make sure to have virtualbox and vagrant installed

2. Run
    ```javascript
    vagrant up
    ```
3. SSH to vm with
    ```javascript
    vagrant ssh
    ```
4. Deploy with
    ```javascript
    truffle migrate
    ```
5. Launch the frontend
    ```javascript
    npm run start
    ```


## Classical installation
1. Install Truffle and Ganache CLI globally. If you prefer, the graphical version of Ganache works as well!
    ```javascript
    npm install -g truffle
    npm install -g ganache-cli
    ```

2. Download the box. This also takes care of installing the necessary dependencies.
    ```javascript
    truffle unbox drizzle
    ```

3. Run the development blockchain, we recommend passing in a blocktime. Otherwise, its difficult to track things like loading indicators because Ganache will mine instantly.
    ```javascript
    // 3 second blocktime.
    ganache-cli -b 3
    ```

4. Compile and migrate the smart contracts. Note inside the development console we don't preface commands with `truffle`.
    ```javascript
    compile
    migrate
    ```

5. Run the webpack server for front-end hot reloading (outside the development console). Smart contract changes must be manually recompiled and migrated.
    ```javascript
    // Serves the front-end on http://localhost:3000
    npm run start
    ```

6. Truffle can run tests written in Solidity or JavaScript against your smart contracts. Note the command varies slightly if you're in or outside of the development console.
    ```javascript
    // If inside the development console.
    test

    // If outside the development console..
    truffle test
    ```

7. Jest is included for testing React components. Compile your contracts before running Jest, or you may receive some file not found errors.
    ```javascript
    // Run Jest outside of the development console for front-end component tests.
    npm run test
    ```

8. To build the application for production, use the build command. A production build will be in the build_webpack folder.
    ```javascript
    npm run build
    ```

## FAQ

* __Where do I find more information about Drizzle?__

    Check out our [documentation](http://truffleframework.com/docs/drizzle/getting-started) or any of the three repositories ([`drizzle`](https://github.com/trufflesuite/drizzle), [`drizzle-react`](https://github.com/trufflesuite/drizzle-react), [`drizzle-react-components`](https://github.com/trufflesuite/drizzle-react-components)).

* __Why is there both a truffle.js file and a truffle-config.js file?__

    `truffle-config.js` is a copy of `truffle.js` for compatibility with Windows development environments. Feel free to delete it if it's irrelevant to your platform.

* __Where is my production build?__

    The production build will be in the `build_webpack` folder. This is because Truffle outputs contract compilations to the `build` folder.

* __Where can I find more documentation?__

    This box is a marriage of [Truffle](http://truffleframework.com/) and a React setup created with [create-react-app](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md). Either one would be a great place to start!
