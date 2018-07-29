var SimpleStorage = artifacts.require("SimpleStorage");
var TutorialToken = artifacts.require("TutorialToken");
var ComplexStorage = artifacts.require("ComplexStorage");
//useless

var ZtickyZtorage = artifacts.require("ZtickyZtorage");
var ZtickyCoinZ = artifacts.require("ZtickyCoinZ");
var Ztickerz = artifacts.require("Ztickerz");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(TutorialToken);
  deployer.deploy(ComplexStorage);
  //useless

  deployer.deploy(ZtickyZtorage);
  deployer.deploy(ZtickyCoinZ);
  deployer.deploy(Ztickerz);
};
