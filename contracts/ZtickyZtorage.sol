pragma solidity ^0.4.24;

import './utils/Backend.sol';
import './utils/MarketInterface.sol';
import 'openzeppelin-solidity/contracts/ownership/HasNoEther.sol';
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';

/**
 * @title StickersStorage
 * @dev The StickersStorage contract is a backend ERC721 storage contract which collects all the user stickers
 * implementing a generate and burn function which is triggerable only by frontend.
 * The logic is implemented in its frontend contract which has been separated from the backend sticker ERC721 contracts
 * for upgradability reasons. In this way the storage contract remains
 * as flexible as possible for further future updates.
 */
contract ZtickyZtorage is  HasNoEther, Backend(address(0)), ERC721Token("ZtickyZtorage", "ZSZ")  {

  /**
  * @dev Gets all sIds of the specified address
  * @param _owner address for the sticker's owner
  * @return uint256[] representing all sticker ids owned by the passed address
  */
  function getStickersOf(address _owner)
  external
  view
  returns (uint256[]) {
    require(_owner != address(0), 'Address should exist');
    return ownedTokens[_owner];
  }

  /**
  * @dev Generate new sticker by calling _mint function
  * @param _owner address for the sticker's owner
  * @param _stickerId sticker unique id
  * @return uint256 representing length of owned stickers by the passed address
  */
  function generateSticker(address _owner, uint256 _stickerId)
  public
  onlyFrontend
  returns (uint256) {
    //It could be used tx.origin instead of _owner for a fully trustless system
    ERC721Token._mint(_owner, _stickerId);
    return ownedTokens[_owner].length;
  }


  /**
  * @dev Burn sticker by calling _burn function. Not currently used but added for flexibility.
  * @param _stickerId sticker unique id
  * @return uint256 representing length of owned stickers by the passed address
  */
  function burnSticker(uint256 _stickerId)
  public
  onlyFrontend
  returns (uint256) {
    //tx.origin because only the legitimate owner should be allowed to burn its own stickers
    ERC721Token._burn(tx.origin, _stickerId);
    return ownedTokens[tx.origin].length;
  }

  /**
  * @dev Extend approve function and publish onto market to be sold
  * @param _stickerId sticker's unique id
  * @param _price price to be published to market
  * @return uint256 represent the price
  */
  function approveAndSell(uint256 _stickerId, uint256 _price)
  public
  returns (uint256) {
    ERC721BasicToken.approve(frontend, _stickerId);
    MarketInterface(frontend).publishToMarket(_stickerId, msg.sender, _price);
    return _price;
  }

  /**
   * @dev Overriding internal function to clear also the market in case of approval rejection.
   * @param _owner owner of the token
   * @param _stickerId uint256 ID of the token to be transferred
   */
  function clearApproval(address _owner, uint256 _stickerId) internal {
    ERC721BasicToken.clearApproval(_owner, _stickerId);
    if(frontend!=address(0)) MarketInterface(frontend).contractClearSellOrder(_stickerId);
  }
}
