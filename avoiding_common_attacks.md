# Avoiding Common Attacks

The contracts built within this repo make extensive use of OpenZeppelin-Solidity library in order to minimize risk associated to common coding mistakes.

## Features

Some of the security features include:
1. Use of Open Zepplin's SafeMath for critical non-incremental operations in order to prevent integer overflow and underflow.
2. Use of Open Zepplin's ERC20 token standard with small additions on top to prevent common coding mistakes and Storage Manipulation by separating the valuable storage from the contract logic.
3. Use of Open Zepplin's ERC721 token standard with small additions on top to prevent coding mistakes and Storage Manipulation by separating the valuable storage from the contract logic.
4. Prevented Reentrancy and Race Conditions by performing all the relevant internal work and state variable update before interacting with the coin/asset contract or any external transfer of ether value.
5. Extrensive Use of Open Zepplin's Pausable contract to external functions to allow for an Emergency Stop in case a hack or vulnerability arises.

## Open points

### Timestamp dependence
The contract logic has a timestamp dependence used as a seed for random number generation.
The current implementation uses also others parameters as a seed, precisely:
- address of the user (msg.sender) to make the outcome unique to each user
- property of the sent transaction (msg.sig) to make the outcome unique to every tx of each user
- random internal seed (randNonce) to prevent any kind of deterministical collision
- hash of previous block (blockhash(block.number-1)) in order to make it impossible to predict the outcome of a tx scheduled in a far future
- timestamp of current block (now) in order to make the tx completely unpredictable to a non miner user.

The block timestamp is the vulnerable element as it can be computed by the miner within a one-block timeframe such that it produces the desired outcome.
Despite its vulnerability the current algorithm can be still considered safe for transactions carrying small value, that means, as long as newly generated stickers do not exceed the value of the Ethereum block reward. Indeed the cost to compute a favorable seed for a miner is counteracted by the high probability of having to renounce to a valid block reward in order to perform manipulation.
In this case, the risk associated to miner manipulation is mitigated by keeping the cost of a sticker pack small, thus having stickers that in average should not exceed the block reward value.

A commit-reveal approach would be prefered for this application but it definetely requires further reasoning in order not to degrade the user experience or to increase transactions costs. 
