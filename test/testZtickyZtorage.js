var ZtickyZtorage = artifacts.require("./ZtickyZtorage.sol");
var ZtickyCoinZ = artifacts.require("./ZtickyCoinZ.sol");
var ZtickerZ = artifacts.require("ZtickerZ");

contract.skip('ZtickyZtorage', function(accounts) {

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

  // it("...should burn a sticker.", function() {
  //   var cc, ac, zz;
  //   return ZtickyZtorage.deployed()
  //     .then(function(instance) {
  //       ac=instance;
  //       return ZtickerZ.deployed();
  //     })
  //     .then(function(instance){
  //       zz = instance;
  //       return ac.changeFrontend(accounts[1], {from: accounts[0]});
  //     })
  //     .then((r) => ac.generateSticker(accounts[1], 421, {from: accounts[1]}))
  //     .then((r) => ac.getStickersOf(accounts[1]))
  //     .then(function(r){
  //       assert.equal(r.filter(i=>i==421).length, 1, 'it should contain one.');
  //       return ac.burnSticker(421, {from: accounts[1]});
  //     })
  //     .then((r) => ac.getStickersOf(accounts[1]))
  //     .then(function(r){
  //       assert.equal(r.filter(i=>i==421).length, 0,'it should have burnt the sticker.');
  //     })
  //     .then((r) => ac.changeFrontend(zz.address , {from: accounts[0]}));
  // });

  // it("...should approve frontend to withdraw stickers.", function() {
  //   var cc, ac, zz;
  //   return ZtickyCoinZ.deployed()
  //     .then(function(instance) {
  //       cc=instance;
  //       return ZtickyZtorage.deployed();
  //     })
  //     .then(function(instance) {
  //       ac=instance;
  //       return ZtickerZ.deployed();
  //     })
  //     .then((r)=> ac.changeFrontend(accounts[1], {from: accounts[0]}))
  //     .then((r)=> cc.changeFrontend(accounts[1], {from: accounts[0]}))
  //     .then((r)=> ac.generateSticker(accounts[3], 312, {from: accounts[1]}))
  //     .then((r)=> cc.mint(accounts[4], 1000, {from: accounts[1]}))
  //     .then((r)=> ac.approveAndSell(312, 50, {from: accounts[3]}))
  //     .then((r)=> ac.safeTransferFrom(accounts[3], accounts[4], 312, {from: accounts[1]}))
  //     .then((r)=> ac.changeFrontend(zz.address, {from: accounts[0]}))
  //     .then((r)=> cc.changeFrontend(zz.address, {from: accounts[0]}))
  //     .then((r)=> ac.getStickersOf(accounts[4]))
  //     .then(function(r){
  //       console.log('r:' + JSON.stringify(r) + '   --- r.filter: ' + r.filter(i=>i==421).length);
  //       assert.equal(r.filter(i=>i==312).length, 1,'it should have now one sticker.');
  //     });
  // });
});
