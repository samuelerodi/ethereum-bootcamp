pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

import '../ZtickyCoinZ.sol';
import '../ZtickyZtorage.sol';

/**
 * @title Frontend
 * @dev The Frontend contract is an Ownable contract and its the frontend counterpart to the two backend storage contracts:
 * an asset contract and a coin contract. This structure is useful to simplify the upgradability as it make it possible to separate logic from storage
 * while guaranteeing the correct write permissions to the storage.
 */
contract Frontend is Ownable{
  address public coinContractAddress = address(0);
  address public assetContractAddress = address(0);
  ZtickyCoinZ coinContract = ZtickyCoinZ(coinContractAddress);
  ZtickyZtorage assetContract = ZtickyZtorage(assetContractAddress);

  modifier isFrontendConfigured(){
    require(coinContractAddress!=address(0));
    require(assetContractAddress!=address(0));
    _;
  }

  modifier isCoinContract(){
    require(msg.sender == coinContractAddress);
    _;
  }

  modifier isAssetContract(){
    require(msg.sender == assetContractAddress);
    _;
  }

  /**
   * @dev Change the address of the Backend coin contract.
   * @param _coinContractAddress The address of the newly deployed coin contract.
   */
  function changeCoinContract(address _coinContractAddress)
  public
  onlyOwner
  returns(bool)
  {
    require(_coinContractAddress!=address(0));
    coinContractAddress = _coinContractAddress;
    coinContract =ZtickyCoinZ(coinContractAddress);
    return true;
  }

  /**
   * @dev Change the address of the Backend asset contract.
   * @param _assetContractAddress The address of the newly deployed asset contract.
   */
  function changeAssetContract(address _assetContractAddress)
  public
  onlyOwner
  returns(bool)
  {
    require(_assetContractAddress!=address(0));
    assetContractAddress = _assetContractAddress;
    assetContract = ZtickyZtorage(assetContractAddress);
    return true;
  }
}
