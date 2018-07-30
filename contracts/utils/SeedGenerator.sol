pragma solidity ^0.4.24;

/**
 * @title SeedGenerator
 * @dev The SeedGenerator contract is a DETERMINISTICAL RANDOM NUMBER GENERATOR contract.
 * This contract is not intended to be used in high-value transactions as it is vulnerable and easily
 * exploitable by miners that could forge a block with the prefered outcome.
 * As long as the handled value of the calling transaction doesn't exceed the Ethereum block reward
 * (currently 3 ETH) this algorithm can be considered safe enough.
 * However, this will need CRITICAL ATTENTION and should be deprecated when Ethereum will move onto proof-of-stake.
 * In the current application this algorithm is a "safe enough" easy and cheap implementation that serves our purpose
 * of sticker generation. However, a better method for random generation should be considered for a production grade release.
 */
contract SeedGenerator {
  uint256 randNonce;

  /**
   * @dev This function uses a combination of elements in order to generate a deterministical,
   * everchanging and (nearly) unpredictable number.
   * The algorithm relays on:
   * - address of the user (msg.sender) to make the outcome unique to each user
   * - property of the sent transaction (msg.sig) to make the outcome unique to every tx of each user
   * - random internal seed (randNonce) to prevent any kind of deterministical collision
   * - hash of previous block (blockhash(block.number-1)) in order to make it impossible to predict the outcome of a tx scheduled in the future
   * - timestamp of current block (now) in order to make the tx unpredictable to a non miner user.
   * The block timestamp is currently the vulnerable element as it can be chosen by miners even if in a  small discrete timeframe.
   * For small value transactions this is safe because the cost to compute a favorable seed is counteracted by the risk to renounce to a valid block reward.
   */
  function _generateSeed() internal returns(uint256) {
    randNonce++;
    return uint256(keccak256(now, blockhash(block.number-1), msg.sender, msg.sig, randNonce));
  }

  /**
   * @dev To be implemented for commit-reveal or oracle-like future implementation.
   * @param _nonce The unique id of the sticker to be removed from orderbook.
   */
  function _randomNumberCallback(uint256 _nonce) internal returns(bool){return true;}
}
