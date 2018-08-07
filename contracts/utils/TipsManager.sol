pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

/**
 * @title TipsManager
 * @dev The TipsManager is a simple contract that allows to manage tips to a particular address
 * or eventually a set of addresses organized equally distributed in a future implementation
 */
contract TipsManager is Ownable{
  address public tipsJar;

  constructor() public {
    tipsJar = msg.sender;
  }

  /**
   * @dev Successfully change the tips address.
   * @param _newTipAddress The address of the new tips recipient.
   */
  function changeTipsAddress(address _newTipAddress)
  public
  onlyOwner
  returns(address) {
    require(_newTipAddress!=address(0));
    tipsJar = _newTipAddress;
    return tipsJar;
  }

  /**
   * @dev Successfully send a tip to the tipsAddress.
   * @param _etherAmount Amount of ether to send as tip.
   */
  function _sendTip(uint256 _etherAmount)
  internal
  returns (bool)
  {
    tipsJar.transfer(_etherAmount);
    return true;
  }
}
