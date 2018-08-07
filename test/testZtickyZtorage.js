var ZtickyZtorage = artifacts.require("./ZtickyZtorage.sol");
var ZtickyCoinZ = artifacts.require("./ZtickyCoinZ.sol");
var ZtickerZ = artifacts.require("ZtickerZ");

contract('ZtickyZtorage', function(accounts) {

  it("...should change frontend.", function() {
    var cc, ac, zz;
    return ZtickyZtorage.deployed()
      .then(function(instance) {
        ac=instance;
        return ZtickerZ.deployed();
      })
      .then(function(instance){
        zz = instance;
        return ac.changeFrontend(accounts[1], {from: accounts[0]});
      })
      .then(function() {
      return ac.frontend.call();
    }).then(function(fe) {
      assert.equal(fe, accounts[1], "The frontend was correctly changed.");
    })
    .then(function(r){
      return ac.changeFrontend(zz.address , {from: accounts[0]});
    });
  });

  it("...should add a sticker to the account.", function() {
    var cc, ac, zz;
    return ZtickyZtorage.deployed()
      .then(function(instance) {
        ac=instance;
        return ZtickerZ.deployed();
      })
      .then(function(instance){
        zz = instance;
        return ac.changeFrontend(accounts[1], {from: accounts[0]});
      })
      .then((r)=>{
        return ac.getStickersOf(accounts[1]);
      })
      .then(function(r){
        assert.equal(r.length, 0, 'it should be empty list');
        return ac.generateSticker(accounts[1], 100, {from: accounts[1]})
      })
      .then(function(r){
        return ac.getStickersOf(accounts[1]);
      })
      .then(function(r){
        assert.equal(r.length,1,'it should contain one sticker now.');
      })
     .then(function(r){
      return ac.changeFrontend(zz.address , {from: accounts[0]});
    });
  });
});
