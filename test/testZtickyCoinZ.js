var ZtickyCoinZ = artifacts.require("./ZtickyCoinZ.sol");
var ZtickyZtorage = artifacts.require("./ZtickyZtorage.sol");
var ZtickerZ = artifacts.require("ZtickerZ");

const _sid1 = 100;
const _sid2 = 200;
const _sid3 = 300;
const _sid4 = 400;

const _amount1 = 1000;
const _amount2 = 100;


// ZtickyCoinZ AVAILABLE FUNCTIONS
// function mint(address _to, uint256 _amount) onlyFrontend whenNotPaused public returns (bool);
// function burn(uint256 _value) public onlyFrontend whenNotPaused;
// function buyAndTransfer(uint256 _stickerId) public whenNotPaused returns(bool);
// function transfer(address _to, uint256 _value) public whenNotPaused returns (bool)
// function transferFrom(address _from, address _to, uint256 _value) public whenNotPaused returns (bool)
// function approve(address _spender,  uint256 _value) public whenNotPaused returns (bool)
// function increaseApproval(address _spender,  uint _addedValue) public whenNotPaused returns (bool success)
// function decreaseApproval(address _spender,  uint _subtractedValue) public whenNotPaused returns (bool success)
// function allowance(address _owner, address _spender) public view returns (uint256)
// function balanceOf(address _owner) public view returns (uint256)
// function totalSupply() public view returns (uint256)
// function pause() onlyOwner whenNotPaused public
// function unpause() onlyOwner whenPaused public
// function reclaimEther() external onlyOwner
// function changeFrontend(address _newFrontend) public onlyOwner

contract.skip('ZtickyCoinZ', function(accounts) {

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
        return s.mint(accounts[2], _amount1, {from: accounts[1]})
      })
      .then(function(r){
        return s.balanceOf(accounts[2]);
      })
      .then(function(r){
        assert.equal(r,_amount1,'it should have some coinz now.');
      });
    });
  });

  it("...should burn some token.", function() {
    return ZtickyCoinZ.deployed().then(function(instance) {
      s = instance;
      return s.changeFrontend(accounts[2], {from: accounts[0]})
      .then(function(){
        return s.burn(_amount2, {from: accounts[2]})
      })
      .then(function(r){
        return s.balanceOf(accounts[2]);
      })
      .then(function(r){
        assert.equal(r, _amount1-_amount2, 'it should have burnt some.');
      });
    });
  });

  it("...should allow to buy a sticker from market.", function() {
    var cc, ac, zz;
    return ZtickyCoinZ.deployed()
      .then(function(instance) {
        cc=instance;
        return ZtickyZtorage.deployed();
      })
      .then(function(instance) {
        ac=instance;
        return ZtickerZ.deployed();
      })
      .then(function(instance){
        zz = instance;
        return ac.changeFrontend(accounts[1], {from: accounts[0]});
      })
      .then(function(r){
        return cc.changeFrontend(zz.address, {from: accounts[0]});
      })
      .then(function(r){
        return ac.generateSticker(accounts[3], _sid4, {from: accounts[1]});
      })
      .then(function(r){
        return ac.changeFrontend(zz.address , {from: accounts[0]});
      })
      .then(function(){
        return ac.approveAndSell(_sid4, _amount2, {from: accounts[3]});
      })
      .then(function(r){
        return cc.buyAndTransfer(_sid4, {from: accounts[2]})
      })
      .then(function(r){
        return cc.balanceOf(accounts[3]);
      })
      .then(function(r){
        assert.equal(r, _amount2,'it should have got 100.');
        return ac.ownerOf(_sid4);
      })
      .then(function(r){
        assert.equal(r, accounts[2],'it should have changed owner.');
      });
  });
});
