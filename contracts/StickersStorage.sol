pragma solidity ^0.4.24;

import './utils/Backend.sol';
import './utils/ArrayUtils.sol';
import 'openzeppelin-solidity/contracts/ownership/HasNoEther.sol';

/**
 * @title StickersStorage
 * @dev The StickersStorage contract is a backend storage contract which collects all the user albums and implements
 * a minimum set of instruction in order to add and remove stickers from a user's album.
 * All the logic is implemented in its frontend contract for upgradability reasons, so that the storage contract remains
 * as flexible as possible for further future updates.
 */
contract StickersStorage is Backend(0), HasNoEther {

  using ArrayUtils for uint[];

  mapping (address => mapping (uint => uint[])) public albums;
  mapping (uint => uint) public globalStickersCounter;

  constructor() public {
  }

  /**
  * @dev Get full album by user
  */
  /* function getUserAlbum(address _user) public view returns (mapping (uint => string[])) {
    return albums[_user];
  } */
  /**
  * @dev Get full album by user
  */
  function getUserStickers(address _user, uint _from, uint _to) public view returns (uint[]) {
    uint counter = 0;
    for (uint l = _from; l < _to; l++) {
      counter += albums[_user][l].length;
    }
    uint[] memory stickers = new uint[](counter);
    for (uint i = _from; i < _to; i++) {
      for (uint s = 0; s < albums[_user][i].length; s++) {
        stickers[s]=albums[_user][i][s];
      }
    }
    return stickers;
  }
  /**
  * @dev Get full album by user
  */
  function getUserStickersByStn(address _user, uint _stn) public view returns (uint[]) {
    return albums[_user][_stn];
  }
  /**
  * @dev Get full album by user
  * Returns the count of stickers with same stn of current user
  */
  function addSticker(address _user, uint _stn, uint _sId) public
  onlyFrontend
  returns (uint) {
    return albums[_user][_stn].push(_sId);
  }
  /**
  * @dev Get full album by user
  */
  function removeSticker(address _user, uint _stn, uint _sId) public
  onlyFrontend
  returns (uint) {
    var (found, idx) = albums[_user][_stn].indexOf(_sId, true);
    assert(found);
    assert((albums[_user][_stn].length -1) == albums[_user][_stn].remove(idx));
    return albums[_user][_stn].length;
  }

}
