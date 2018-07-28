var StickersStorage = artifacts.require("./StickersStorage.sol");

contract('StickersStorage', function(accounts) {

  it("...should change frontend.", function() {
    return StickersStorage.deployed().then(function(instance) {
      s = instance;
      return s.changeFrontend(accounts[1], {from: accounts[0]});
    }).then(function() {
      return s.frontend.call();
    }).then(function(fe) {
      assert.equal(fe, accounts[1], "The frontend was correctly changed.");
    });
  });

  it("...should add a sticker to the account.", function() {
    return StickersStorage.deployed().then(function(instance) {
      s = instance;
      return s.getStickersOf(accounts[1])
      .then(function(r){
        assert.equal(r.length, 0, 'it should be empty list');
        return s.generateSticker(accounts[1], 100, {from: accounts[1]})
      })
      .then(function(r){
        return s.getStickersOf(accounts[1]);
      })
      .then(function(r){
        assert.equal(r.length,1,'it should contain one sticker now.');
      });
    });
  });

  it("...should burn a sticker.", function() {
    return StickersStorage.deployed().then(function(instance) {
      s = instance;
      return s.generateSticker(accounts[2], 200, {from: accounts[1]})
      .then(function(r){
        return s.getStickersOf(accounts[2]);
      })
      .then(function(r){
        assert.equal(r.length, 1, 'it should contain one.');
        return s.burnSticker(accounts[2], 200, {from: accounts[1]})
      })
      .then(function(r){
        return s.getStickersOf(accounts[2]);
      })
      .then(function(r){
        assert.equal(r.length, 0,'it should have burnt the sticker.');
      });
    });
  });

  it("...should allow to withdraw from frontend.", function() {
    return StickersStorage.deployed().then(function(instance) {
      s = instance;
      return s.generateSticker(accounts[3], 300, {from: accounts[1]})
      .then(function(r){
        return s.approveAndSell(300, 1.2, {from: accounts[3]})
      })
      .then(function(r){
        return s.safeTransferFrom(accounts[3], accounts[4], 300, {from: accounts[1]});
      })
      .then(function(r){
        return s.getStickersOf(accounts[4]);
      })
      .then(function(r){
        assert.equal(r.length, 1,'it should have now one sticker.');
        assert.equal(r[0], 300,'it should be the correct sticker.');
      });
    });
  });

});
