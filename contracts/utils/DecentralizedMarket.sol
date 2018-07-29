pragma solidity ^0.4.24;

import './Frontend.sol';

import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';

/**
 * @title DecentralizedMarket
 * @dev The DecentralizedMarket contract is a frontend contract which collects the order book
 * from player willing to trade their stickers for ZCZ and settle a transaction.
 * It is a pausable contract in case of emergency market stop and it also allows the admin/owner
 * to cancel the item on sale in case of contract upgrades.
 */
contract DecentralizedMarket is Frontend, Pausable{

  struct ItemOnSale {
		address seller;
		uint256 price;
    uint256 index;
	}

  /* STORAGE */

  // Mapping from _stickerId to item details
  mapping(uint256 => ItemOnSale) public orderBook;

  // Array storing all _stickerId on sale
  uint256[] public allItemsIndex;


  /* MODIFIERS */
  modifier isOnSale(uint256 _stickerId){
    require(orderBook[_stickerId].seller != address(0));
    _;
  }
  modifier isNotOnSale(uint256 _stickerId){
    require(orderBook[_stickerId].seller == address(0));
    _;
  }

  modifier isOwnerOf(uint256 _stickerId, address _owner){
    require(_owner == assetContract.ownerOf(_stickerId));
    _;
  }

  /* !!IMPORTANT!! @TODO This function has a vulnerability and should be used to replace
   by a function which ban a user which post to market and revoke allownce after that*/
  modifier hasAllowanceOf(uint256 _stickerId){
    require(this == assetContract.getApproved(_stickerId));
    _;
  }

  /* UTILS */
  /**
   * @dev It clears an order from the order book.
   * @param _stickerId The unique id of the sticker to be removed from orderbook.
   */
  function _clearOrder(uint256 _stickerId)
  internal
  isOnSale(_stickerId)
  returns(bool)
  {
    uint256 _idx = orderBook[_stickerId].index;
    delete orderBook[_stickerId];
    //Remove and shift from array
    for (uint i = _idx; i < allItemsIndex.length - 1; i++) {
      allItemsIndex[i] = allItemsIndex[i + 1];
      orderBook[allItemsIndex[i]].index = i;
    }
    delete allItemsIndex[allItemsIndex.length - 1];
    allItemsIndex.length--;
    return true;
  }

  /**
   * @dev It adds an element to the order book.
   * @param _stickerId The unique id of the sticker to be sold.
   * @param _seller The seller address.
   * @param _price The price to be sold at.
   */
  function _addOrder(uint256 _stickerId, address _seller, uint256 _price)
  internal
  isNotOnSale(_stickerId)
  returns(bool)
  {
    orderBook[_stickerId] = ItemOnSale(_seller, _price, allItemsIndex.length);
    allItemsIndex.push(_stickerId);
    return true;
  }

  /**
   * @dev It removes an element from the order book and clears the approval to the stickers contract.
   * @param _stickerId The unique id of the sticker to be sold.
   * @param _seller The seller address.
   */
  function _cancelSellOrder(uint256 _stickerId, address _seller)
  internal
  isOwnerOf(_stickerId, _seller)
  hasAllowanceOf(_stickerId)
  returns (bool)
  {
    _clearOrder(_stickerId);
    assetContract.safeTransferFrom(_seller, _seller, _stickerId);
    return true;
  }

  /* MARKET FUNCTIONS */
  /**
   * @dev It retrieve item in order book to be sold.
   * @param _stickerId The unique id of the sticker to be sold.
   */
  function getItemOnSale(uint256 _stickerId)
  public
  view
  isOnSale(_stickerId)
  returns(address, uint256){
    return (orderBook[_stickerId].seller, orderBook[_stickerId].price);
  }

  /**
   * @dev It retrieve all items in the order book.
   */
  function getOrderBook()
  public
  view
  returns(uint256[] _stickers, uint256[] _prices)
  {
    _stickers = new uint256[](allItemsIndex.length);
    _prices = new uint256[](allItemsIndex.length);
    for (uint i = 0; i < allItemsIndex.length; i++) {
      _stickers[i] = allItemsIndex[i];
      _prices[i] = orderBook[allItemsIndex[i]].price;
    }
  }

  /**
   * @dev It sell one sticker to new owner and move funds in the coin contract to settle transaction.
   * @param _stickerId The unique id of the sticker to be sold.
   * @param _buyer The address of the interested buyer.
   */
  function sellItem(uint256 _stickerId, address _buyer)
  public
  isFrontendConfigured
  whenNotPaused
  isCoinContract
  isOnSale(_stickerId)
  returns(bool){
    address _seller = orderBook[_stickerId].seller;
    uint256 _price = orderBook[_stickerId].price;
    _clearOrder(_stickerId);
    assetContract.safeTransferFrom(_seller, _buyer, _stickerId);
    coinContract.transferFrom(_buyer, _seller, _price);
    return true;
  }

  /**
   * @dev It publish a new sticker to be sold in the order book.
   * @param _stickerId The unique id of the sticker to be sold.
   * @param _seller The seller address.
   * @param _price The price to be sold at.
   */
  function publishToMarket(uint256 _stickerId, address _seller, uint256 _price)
  public
  isFrontendConfigured
  whenNotPaused
  isAssetContract
  isNotOnSale(_stickerId)
  returns(bool) {
    _addOrder(_stickerId, _seller, _price);
    return true;
  }

  /**
   * @dev It cancel a sell order from order book. Request coming from owner of the sticker.
   * @param _stickerId The unique id of the sticker to be sold.
   */
  function cancelSellOrder(uint256 _stickerId)
  public
  whenNotPaused
  returns(bool)
  {
    _cancelSellOrder(_stickerId, msg.sender);
    return true;
  }

  /**
   * @dev It cancel a sell order from order book. Request coming from the admin. Used for contract upgrade.
   * @param _stickerId The unique id of the sticker to be sold.
   * @param _seller The seller address.
   */
  function adminCancelSellOrder(uint256 _stickerId, address _seller)
  public
  onlyOwner
  returns(bool)
  {
    _cancelSellOrder(_stickerId, _seller);
    return true;
  }

  /**
   * @dev It clear a sell order from order book. Request coming from the admin. In case funds are not approved on ERC721 contract.
   * @param _stickerId The unique id of the sticker to be sold.
   */
  function adminClearSellOrder(uint256 _stickerId)
  public
  onlyOwner
  returns(bool)
  {
    _clearOrder(_stickerId);
    return true;
  }

}
