pragma solidity ^0.4.24;

import './utils/DecentralizedMarket.sol';
import './utils/SeedGenerator.sol';
import './utils/TipsManager.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

/**
 * @title Ztickerz
 * @dev The Ztickerz contract is a DecentralizedMarket Frontend contract which implements all the logic for
 * the album management, stickers generation and user reward upon album completion.
 * For sake of simplicity, the sticker generation is handled using the SeedGenerator contract which is currently vulnerable
 * to miner manipulation. This implementation is tollerated as long as the sticker pack value doesn't exceed the mining reward.
 * However, this functionality will be upgraded in the future using a commit-reveal approach for a complete trustless random seed generation.
 */
contract Ztickerz is DecentralizedMarket, SeedGenerator, TipsManager {

  using SafeMath for uint256;
  uint16 albumCount;

  struct Album {
    uint16 albumId;
    uint16 nStickers;
    uint256 nStickersPerPack;
    uint256 packPrice;
    uint256 ethBalance;
    uint256 mintedCoins;
    uint256 nRewardedUsers;
    mapping(uint256=>uint256) stickersMap;
    mapping(uint256=>address) rewardedUsers;
    mapping(address=>uint256) rewardsCount;
    mapping(address=>uint256) burntCoin;
  }

  mapping (uint16 => Album) albums;



  constructor(address _assetContractAddress, address _coinContractAddress) public {
    if (_assetContractAddress != address(0)) Frontend.changeAssetContract(_assetContractAddress);
    if (_coinContractAddress != address(0)) Frontend.changeCoinContract(_coinContractAddress);
  }

  /* MODIFIERS */

  /* INTERNALS */
  function _generateSticker(uint16 _albumId)
  internal
  returns(uint256)
  {
    uint256 _rnd = _generateSeed();
    bytes32 _stickerId = bytes32(bytes2(_albumId)) | bytes32(bytes30(_rnd))>>16;
    return uint256(_stickerId);
  }

  function _getStickerInfo(uint256 _stickerId)
  internal
  view
  returns(uint16 _albumId, uint16 _stn, uint256 _sId)
  {
    _albumId = uint16(bytes32(_stickerId) >> 240);
    _sId = uint256((bytes32(_stickerId) << 16) >> 16);
    _stn = _getStn(_albumId, _sId);
  }

  function _getStn(uint16 _albumId, uint256 _sId)
  internal
  view
  returns(uint16 _stn)
  {
    /* function for programmatical scarcity */
    assert(albums[_albumId].nStickers!=0);
    _stn = uint16(_sId % albums[_albumId].nStickers);
  }

  function createAlbum(uint16 _nS, uint16 _nSxPack, uint256 _packPrice)
  public
  onlyOwner
  returns(uint16)
  {
    /* Check in case of integer overflow */
    require(uint16(albumCount + 1)>0);
    require((_nS!=0) && (_nSxPack!=0));
    albums[albumCount] = Album(albumCount, _nSxPack, _nS, _packPrice, 0, 0, 0);
    return albumCount++;
  }

  /* function unwrapStickerPack(){} */
  /* function redeemReward(){} */

  /* function _computeCoinGeneration(){} */
  /* function _computeFinalReward(){} */

  /* function isAlbumComplete(){} */
  /* function getStickerDetails(){} */
  /* function getStickersDetails(){} */
  /* function stickersInCirculation(){} */
  /* function getAlbumStats(){} */





 /**
  * @notice Fallback function - Called if other functions don't match call or
  * sent ether without data
  * Typically, called when invalid data is sent
  * Added so ether sent to this contract is reverted if the contract fails
  * otherwise, the sender's money is transferred to contract
  */
  function() public {
        revert();
    }
}
