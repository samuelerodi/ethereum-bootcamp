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
    uint256 nStickersInCirculation;
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
  modifier albumExist(uint16 _albumId){
    require(albums[_albumId].nStickers!=0);
    _;
  }

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
    assert(albums[_albumId].nStickers!=0);
    /* @TODO function for programmatical scarcity */
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
    albums[albumCount] = Album(albumCount, _nSxPack, _nS, _packPrice, 0, 0, 0, 0);
    return albumCount++;
  }

 /* @TODO add events in dexMarket */


  function unwrapStickerPack(uint16 _albumId)
  public
  payable
  whenNotPaused
  albumExist(_albumId)
  returns(uint256[] out)
  {
    require(albums[_albumId].packPrice==msg.value);
    uint256 _coinReward = 0;
    for(uint i = 0; i < albums[_albumId].nStickersPerPack ; i++){
      uint256 _stickerId = _generateSticker(_albumId);
      (uint16 _aId, uint16 _stn, uint256 _sId) = _getStickerInfo(_stickerId);
      assert(_aId == _albumId);
      _coinReward.add(computeCoinReward(_albumId, _stn));
      albums[_albumId].stickersMap[_stn].add(1);
      albums[_albumId].nStickersInCirculation.add(1);
      out[i]=_stickerId;
      assetContract.generateSticker(msg.sender, _stickerId);
    }
    albums[_albumId].mintedCoins.add(_coinReward);
    albums[_albumId].ethBalance.add(msg.value);
    coinContract.mint(msg.sender,_coinReward);
  }


  function computeCoinReward(uint16 _albumId, uint16 _stn)
  public
  view
  returns(uint256 out)
  {
    uint256 _supply = albums[_albumId].nStickersInCirculation;              //total Supply
    uint256 _scarcity = albums[_albumId].stickersMap[_stn]                  //get real distribution
                        .add(1)                                             //avoid 0
                        .mul(albums[_albumId].nStickers)                    //normalize by stickers in album
                        .div(_supply + 1);                                  //Calculate scarsity coefficient
    out = 1000;                                                        //Statistically stable conversion ratio 1ETH = 1000ZCZ
    out = out.mul(albums[_albumId].packPrice);                         //Standardize accross albums by its pack price
    out = out.div(albums[_albumId].nStickersPerPack);                  //Divide equally among stickers in pack
    out = out.div(_scarcity);                                          //Divide by scarcity. The more is rare, the more coins will get minted
  }


  /* HELPERS */
  function isAlbumComplete(address _owner, uint16 _albumId)
  public
  view
  albumExist(_albumId)
  returns(bool)
  {
    require(albums[_albumId].nStickers!=0);
    uint256[] memory _stickers = assetContract.getStickersOf(_owner);
    uint256[] memory _orderedList = new uint256[](albums[_albumId].nStickers);
    uint16 counter=0;
    for (uint256 i = 0; i < _stickers.length ; i++) {
      uint16 _stn = _getStn(_albumId, _stickers[i]);
      if(counter==albums[_albumId].nStickers) break;
      if(_orderedList[_stn]!=0) continue;
      _orderedList[_stn] = _stickers[i];
      counter++;
    }
    if(counter==albums[_albumId].nStickers) return true;
    return false;
  }
  function getStickerDetails(uint256 _stickerId)
  public
  view
  returns(uint16 _albumId, uint16 _stn, uint256 _sId, address _owner, bool _onSale, uint256 _onSalePrice)
  {
    (_albumId, _stn, _sId) = _getStickerInfo(_stickerId);
    _owner = assetContract.ownerOf(_stickerId);
    _onSale = orderBook[_stickerId].seller!=address(0) ? true : false;
    _onSalePrice = orderBook[_stickerId].price;
  }

  function getStickersDetails(uint256[] _stickerIds)
  public
  view
  returns (uint16[] _albumId, uint16[] _stn, uint256[] _sId, address[] _owner, bool[] _onSale, uint256[] _onSalePrice)
  {
    for (uint i = 0; i < _stickerIds.length ; i++) {
      (uint16 _a, uint16 _b, uint256 _c, address _d, bool _e, uint256 _f) = getStickerDetails(_stickerIds[i]);
      _albumId[i] = _a;
      _stn[i] = _b;
      _sId[i] = _c;
      _owner[i] = _d;
      _onSale[i] = _e;
      _onSalePrice[i] = _f;
    }
  }


  function getAlbumStats(uint16 _albumId)
  public
  view
  albumExist(_albumId)
  returns ( uint16 _nStickers,
            uint256 _nStickersPerPack,
            uint256 _packPrice,
            uint256 _ethBalance,
            uint256 _mintedCoins,
            uint256 _nStickersInCirculation,
            uint256[] _stnDistribution,
            uint256[] _nextStnGenReward,
            address[] _rewardedUsers)
  {
    _nStickers = albums[_albumId].nStickers;
    _nStickersPerPack = albums[_albumId].nStickersPerPack;
    _packPrice = albums[_albumId].packPrice;
    _ethBalance = albums[_albumId].ethBalance;
    _mintedCoins = albums[_albumId].mintedCoins;
    _nStickersInCirculation = albums[_albumId].nStickersInCirculation;

    _stnDistribution = new uint256[](albums[_albumId].nStickers);
    _nextStnGenReward = new uint256[](albums[_albumId].nStickers);
    _rewardedUsers = new address[](albums[_albumId].nRewardedUsers);
    for (uint256 i = 0; i < albums[_albumId].nRewardedUsers ; i++) {
       _rewardedUsers[i] = albums[_albumId].rewardedUsers[i];
    }
    for (uint16 l = 0; l < albums[_albumId].nStickers ; l++) {
       _stnDistribution[l] = albums[_albumId].stickersMap[l];
       _nextStnGenReward[l] = computeCoinReward(_albumId, l);
    }
  }

  /* @TODO */
  /* function _computeFinalReward(){} */
  /* function redeemReward(){} */

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
