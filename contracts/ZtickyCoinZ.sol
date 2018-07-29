pragma solidity ^0.4.24;

import './utils/Backend.sol';
import './utils/MarketInterface.sol';
import 'openzeppelin-solidity/contracts/ownership/HasNoEther.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/PausableToken.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/BurnableToken.sol';

/**
 * @title StickyCoin
 * @dev The StickyCoin contract is a backend ERC20 token contract which collects the StickyCoin associated
 * to the ZtickerZ contract. It is mostly a standard ERC20 token plus basic functions in order to
 * mint and burn coins callable from the frontend contract and a function to directly buy stickers
 * from the frontend market contract. The separation has been conceived for upgradability reasons
 * while keeping the contracts as flexible as possible.
 */
contract ZtickyCoinZ is BurnableToken, PausableToken, HasNoEther, Backend(address(0)) {
  string public name = "ZtickyCoinZ";
  string public symbol = "ZCZ";
  uint8 public decimals = 18;

  event Mint(address indexed to, uint256 amount);
  /**
   * @dev Function to mint tokens
   * @param _to The address that will receive the minted tokens.
   * @param _amount The amount of tokens to mint.
   * @return A boolean that indicates if the operation was successful.
   */
  function mint(
    address _to,
    uint256 _amount
  )
    onlyFrontend
    whenNotPaused
    public
    returns (bool)
  {
    totalSupply_ = totalSupply_.add(_amount);
    balances[_to] = balances[_to].add(_amount);
    emit Mint(_to, _amount);
    emit Transfer(address(0), _to, _amount);
    return true;
  }


  /**
   * @dev Burns a specific amount of tokens.
   * @param _value The amount of token to be burned.
   */
  function burn(uint256 _value) public
  onlyFrontend
  whenNotPaused
  {
    //tx.origin because only the legitimate owner should be allowed to burn its own coin
    BurnableToken._burn(tx.origin, _value);
  }

  /**
   * @dev This function allows to send directly tokens to market contract in order to trade for specific sticker.
   * @param _stickerId The unique id of the sticker to be bought.
   */
  function buyAndTransfer(uint256 _stickerId)
  public
  whenNotPaused
  returns(bool)
  {
    (, uint256 price) = MarketInterface(frontend).getItemOnSale(_stickerId);
    require(price <= balances[msg.sender]);
    PausableToken.approve(frontend, price);
    MarketInterface(frontend).sellItem(_stickerId, msg.sender);
    return true;
  }

}
