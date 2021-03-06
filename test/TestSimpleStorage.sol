pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SimpleStorage.sol";
import "../contracts/ComplexStorage.sol";

contract TestSimpleStorage {

  function testItStoresAValue() {
    SimpleStorage simpleStorage = SimpleStorage(DeployedAddresses.SimpleStorage());

    simpleStorage.set(89);

    uint expected = 89;

    Assert.equal(simpleStorage.storedData(), expected, "It should store the value 89.");
  }

  function testComplexStorage() {
    ComplexStorage complexStorage = ComplexStorage(DeployedAddresses.ComplexStorage());

    complexStorage.setMemorableString('Yo fuckers!!');

    Assert.equal(complexStorage.memorableString(), 'Yo fuckers!!', "It should store the value yo fuckers.");
  }

}
