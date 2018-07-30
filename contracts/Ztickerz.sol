pragma solidity ^0.4.24;

import './utils/DecentralizedMarket.sol';
import './utils/SeedGenerator.sol';
import './utils/TipsManager.sol';


/**
 * @title Ztickerz
 * @dev The Ztickerz contract is a DecentralizedMarket Frontend contract which implements all the logic for
 * the album management, stickers generation and user reward upon album completion.
 * For sake of simplicity, the sticker generation is handled using the SeedGenerator contract which is currently vulnerable
 * to miner manipulation. This implementation is tollerated as long as the sticker pack value doesn't exceed the mining reward.
 * However, this functionality will be upgraded in the future using a commit-reveal approach for a complete trustless random seed generation.
 */
contract Ztickerz is DecentralizedMarket, SeedGenerator, TipsManager {

  uint8 albumCount;

  struct Album {
    uint8 albumId;
    uint8 nStickersPerPack;
    uint256 nStickers;
    uint256 packPrice;
    mapping(uint256=>uint256) stickersMap;
    uint256 ethBalance;
    mapping(uint256=>address) rewardedUser;
    mapping(address=>bool) hasBeenRewarded;
    uint256 nRewardedUsers;
  }

  mapping (uint8 => Album) albums;



  constructor(address _assetContractAddress, address _coinContractAddress){
    if (_assetContractAddress != address(0)) Frontend.changeAssetContract(_assetContractAddress);
    if (_coinContractAddress != address(0)) Frontend.changeCoinContract(_coinContractAddress);
  }


  /* function createAlbum(){}

  function unwrapStickerPack(){}
  function redeemReward(){}

  function _computeCoinGeneration(){}
  function _computeFinalReward(){}

  function isAlbumComplete(){}
  function getStickerDetails(){}
  function getStickersDetails(){}
  function stickersInCirculation(){}
  function getAlbumStats(){} */
}
