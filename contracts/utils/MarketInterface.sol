pragma solidity ^0.4.24;

contract MarketInterface {
    function publishToMarket(uint256 _stickerId, address _seller, uint256 _price) public returns(bool);
    function sellItem(uint256 _stickerId, address _buyer) public returns(bool);
    function getItemOnSale(uint256 _stickerId) public view  returns(address, uint256);
    function cancelSellOrder(uint256 _stickerId) public returns(bool);
}
