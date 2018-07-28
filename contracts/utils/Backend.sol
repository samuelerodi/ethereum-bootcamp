pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

/**
 * @title Backend
 * @dev The Backend contract is an Ownable contract and has a frontend address that is the only one entitled to make changes
 * to the storage contract. This contract greatly simplify the logic upgradability as it make it possible to separate logic from storage
 * while guaranteeing the correct write permissions to the storage.
 */
contract Backend is Ownable{
/* contract Backend {   */
  address public frontend;


  event FrontendChanged(
    address indexed previousFrontend,
    address indexed newFrontend
  );

  /**
   * @dev The Backend constructor can sets the original `frontend` upon contract creation, in case frontend is already deployed.
   * Use 0x otherwise.
   */
  constructor(address _frontend) public {
    frontend = _frontend;
    if(_frontend==address(0)) frontend = owner;
  }

  /**
   * @dev Throws if called by any account other than the frontend contract.
   */
  modifier onlyFrontend() {
    require(msg.sender == frontend);
    _;
  }

    /**
   * @dev Allows the current owner to change the frontend of the contract to a new frontend in case of upgrade.
   * @param _newFrontend The address of the new frontend contract.
   */
  function changeFrontend(address _newFrontend) public onlyOwner {
    emit FrontendChanged(frontend, _newFrontend);
    frontend = _newFrontend;
  }
}
