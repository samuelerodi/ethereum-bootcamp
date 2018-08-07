pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ZtickerZ.sol";
import "../contracts/ZtickyZtorage.sol";
import "../contracts/ZtickyCoinZ.sol";

contract TestZtickerZ {
  /* ZtickerZ zz;
  ZtickyZtorage ac;
  ZtickyCoinZ cc; */

  /* function beforeAll() public {
    zz = ZtickerZ(DeployedAddresses.ZtickerZ());
    ac = ZtickyZtorage(DeployedAddresses.ZtickyZtorage());
    cc = ZtickyCoinZ(DeployedAddresses.ZtickyCoinZ());
  } */

  /* function beforeEach() public {} */
  /* function beforeEachAgain() public {} */
  /* function afterEach() public {} */
  /* function afterAll() public {} */


  /* function testItIsAvailable() public {
    Assert.equal(uint256(zz.albumCount()), 0, "It should store 0 albums at the beginning.");
  }

  function testItCreateAnAlbum() public {
    zz.createAlbum(100, 5, 0.005 ether);
    Assert.equal(uint256(zz.albumCount()), 1, "It should store 1 album now.");
  }

  function testItUnwrapAPack() public {
    zz.unwrapStickerPack.value(0.005 ether)(uint16(0));
    Assert.equal(ac.getStickersOf(this).length, 5, "It should have 5 new stickers.");
    Assert.equal(bool(cc.balanceOf(this)>0), true, "It should have minted some coins.");
  } */


  /* function testItStoresAValue() public {
    SimpleStorage simpleStorage = SimpleStorage(DeployedAddresses.SimpleStorage());

    simpleStorage.set(89);

    uint expected = 89;

    Assert.equal(simpleStorage.storedData(), expected, "It should store the value 89.");
  }

  function testComplexStorage() public {
    ComplexStorage complexStorage = ComplexStorage(DeployedAddresses.ComplexStorage());

    complexStorage.setMemorableString('Yo fuckers!!');

    Assert.equal(complexStorage.memorableString(), 'Yo fuckers!!', "It should store the value yo fuckers.");
  } */

}
