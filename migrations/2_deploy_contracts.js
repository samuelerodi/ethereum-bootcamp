var SimpleStorage = artifacts.require("SimpleStorage");
var TutorialToken = artifacts.require("TutorialToken");
var ComplexStorage = artifacts.require("ComplexStorage");
//useless

var ZtickyZtorage = artifacts.require("ZtickyZtorage");
var ZtickyCoinZ = artifacts.require("ZtickyCoinZ");
var ZtickerZ = artifacts.require("ZtickerZ");

module.exports = function(deployer) {
  var coinContract, assetContract, ztickerzContract;
  deployer.deploy(ZtickyZtorage)
  .then(function(instance) {
    assetContract = instance;
    return deployer.deploy(ZtickyCoinZ);
  })
  .then(function(instance) {
    coinContract=instance;
    return deployer.deploy(ZtickerZ, ZtickyZtorage.address, ZtickyCoinZ.address);
  });
};
