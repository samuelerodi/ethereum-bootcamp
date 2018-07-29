var ZtickyCoinZ = artifacts.require("./ZtickyCoinZ.sol");

contract('ZtickyCoinZ', function(accounts) {

  it("...should change frontend.", function() {
    return ZtickyCoinZ.deployed().then(function(instance) {
      s = instance;
      return s.changeFrontend(accounts[1], {from: accounts[0]});
    }).then(function() {
      return s.frontend.call();
    }).then(function(fe) {
      assert.equal(fe, accounts[1], "The frontend was correctly changed.");
    });
  });

  it("...should mint some token.", function() {
    return ZtickyCoinZ.deployed().then(function(instance) {
      s = instance;
      return s.balanceOf(accounts[2])
      .then(function(r){
        assert.equal(r, 0, 'it should be 0');
        return s.mint(accounts[2], 100, {from: accounts[1]})
      })
      .then(function(r){
        return s.balanceOf(accounts[2]);
      })
      .then(function(r){
        assert.equal(r,100,'it should have 100 now.');
      });
    });
  });

  it("...should burn some token.", function() {
    return ZtickyCoinZ.deployed().then(function(instance) {
      s = instance;
      return s.mint(accounts[1], 400, {from: accounts[1]})
      .then(function(r){
        return s.balanceOf(accounts[1]);
      })
      .then(function(r){
        assert.equal(r, 400, 'it should have minted some.');
        return s.burn(100, {from: accounts[1]})
      })
      .then(function(r){
        return s.balanceOf(accounts[1]);
      })
      .then(function(r){
        assert.equal(r, 300,'it should be 300 now.');
      });
    });
  });

  it("...should allow to buy a sticker from market.", function() {
    return ZtickyCoinZ.deployed().then(function(instance) {
      s = instance;
      return s.mint(accounts[3], 200, {from: accounts[1]})
      .then(function(r){
        return s.buyAndTransfer(100, {from: accounts[3]})
      })
      .then(function(r){
        return s.transfer(accounts[4], 100, {from: accounts[3]});
      })
      .then(function(r){
        return s.balanceOf(accounts[4]);
      })
      .then(function(r){
        assert.equal(r, 100,'it should be 100.');
        return s.balanceOf(accounts[3]);
      })
      .then(function(r){
        assert.equal(r, 100,'it should be 100.');
      });
    });
  });

});
