var SimpleStorage = artifacts.require("SimpleStorage");
var TutorialToken = artifacts.require("TutorialToken");
var ComplexStorage = artifacts.require("ComplexStorage");
//useless

var MarketStorage = artifacts.require("MarketStorage");
var StickersStorage = artifacts.require("StickersStorage");
var StickyCoin = artifacts.require("StickyCoin");
var Ztickerz = artifacts.require("Ztickerz");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(TutorialToken);
  deployer.deploy(ComplexStorage);
  //useless

  deployer.deploy(MarketStorage);
  deployer.deploy(StickersStorage);
  deployer.deploy(StickyCoin);
  deployer.deploy(Ztickerz);
};
