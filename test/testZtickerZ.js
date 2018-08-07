var ZtickyZtorage = artifacts.require("./ZtickyZtorage.sol");
var ZtickyCoinZ = artifacts.require("./ZtickyCoinZ.sol");
var ZtickerZ = artifacts.require("ZtickerZ");

var ac,cc,zz;
const N_STICKERS = 100;
const N_STICKERS_X_PACK = 5;
const PACK_PRICE = 0.005;
contract('ZtickerZ', function(accounts) {
  beforeEach("...should set the instances.", function(){
    return ZtickyZtorage.deployed()
      .then((r)=> {ac=r; return ZtickyCoinZ.deployed();})
      .then((r)=>{cc=r; return ZtickerZ.deployed();})
      .then((r)=> zz = r);
  })

  it("...should check if available.", function() {
    return zz.albumCount()
    .then(r=>assert.equal(r,0,'it should contain zero at the moment.'));
  });

  it("...should create  an Album.", function() {
    return zz.createAlbum(N_STICKERS, N_STICKERS_X_PACK, web3.toWei(PACK_PRICE, 'ether'), {from: web3.eth.accounts[0]})
    .then(r=>zz.albumCount())
    .then(r=>assert.equal(r,1,'it should contain zero at the moment.'));
  });
  it("...should compute initial coin reward.", function() {
    return zz.computeCoinReward(0, 0, {from: web3.eth.accounts[5]})
    .then(r=>assert.equal(r,web3.toWei(1,'ether')*1000*(PACK_PRICE/N_STICKERS_X_PACK),'it should equal 1000.'));
  });
  it("...should unwrap a Sticker.", function() {
    return zz.unwrapStickerPack(0, {from: web3.eth.accounts[5], value: web3.toWei(PACK_PRICE, 'ether')})
    .then(r=>cc.balanceOf(web3.eth.accounts[5]))
    .then(r=>assert.equal(r>0,true,'it should have minted some token.'))
    .then(r=>ac.getStickersOf(web3.eth.accounts[5]))
    .then(r=>assert.equal(r.length,N_STICKERS_X_PACK,'it should have generated some stickers.'));
  });
});
