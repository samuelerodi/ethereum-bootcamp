pragma solidity ^0.4.24;

import './utils/Backend.sol';
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
contract StickyCoin is BurnableToken, PausableToken, HasNoEther, Backend(address(0)) {

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
    public
    returns (bool)
  {
    //It could be used tx.origin instead of _to for a fully trustless system
    totalSupply_ = totalSupply_.add(_amount);
    balances[_to] = balances[_to].add(_amount);
    emit Mint(_to, _amount);
    emit Transfer(address(0), _to, _amount);
    return true;
  }


  /**
   * @dev Burns a specific amount of tokens.
   * @param _owner The owner of the tokens to be burned.
   * @param _value The amount of token to be burned.
   */
  function burn(address _owner, uint256 _value) public
  onlyFrontend
  returns(bool)
  {
    //It could be used tx.origin instead of _owner for a fully trustless system
    BurnableToken._burn(_owner, _value);
    return true;
  }

  /**
   * @dev This function allows to send directly tokens to market contract in order to trade for specific sticker.
   * @param _stickerId The unique id of the sticker to be bought.
   */
  function buyAndTransfer(uint256 _stickerId) public
  returns(bool)
  {
    /* Item item = frontend.getItem(stickerId); */
    /* require(item.price<=balances[msg.sender]); */
    /* PausableToken.transfer(item.seller, item.price); */
    /* frontend.sellItem(stickerId); */
    return true;
  }

}
