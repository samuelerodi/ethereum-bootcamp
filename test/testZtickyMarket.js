var ZtickyZtorage = artifacts.require("./ZtickyZtorage.sol");
var ZtickyCoinZ = artifacts.require("./ZtickyCoinZ.sol");
var ZtickerZ = artifacts.require("ZtickerZ");

var ac,cc,zz;
const N_STICKERS = 100;
const N_STICKERS_X_PACK = 5;
const PACK_PRICE = 0.1;
var _stickerId;
contract('ZtickyMarket', function(accounts) {
  before("...should set the instances.", function(){
    return ZtickyZtorage.deployed()
      .then((r)=> {ac=r; return ZtickyCoinZ.deployed();})
      .then((r)=>{cc=r; return ZtickerZ.deployed();})
      .then((r)=> zz = r)
      .then((r)=> ac.changeFrontend(zz.address, {from: web3.eth.accounts[0]}))
      .then((r)=> cc.changeFrontend(zz.address, {from: web3.eth.accounts[0]}));
  })

  it("...should create  an Album.", function() {
    return zz.createAlbum(N_STICKERS, N_STICKERS_X_PACK, web3.toWei(PACK_PRICE, 'ether'), {from: web3.eth.accounts[0]})
    .then(r=>zz.albumCount())
    .then(r=>assert.equal(r,1,'it should contain zero at the moment.'));
  });
  it("...should unwrap stickers twice.", function() {
    return zz.unwrapStickerPack(0, {from: web3.eth.accounts[2], value: web3.toWei(PACK_PRICE, 'ether')})
    .then(r=>zz.unwrapStickerPack(0, {from: web3.eth.accounts[3], value: web3.toWei(PACK_PRICE, 'ether')}))
    .then(r=>cc.balanceOf(web3.eth.accounts[2]))
    .then(r=>assert.equal(r>0,true,'it should have minted some token.'))
    .then(r=>cc.balanceOf(web3.eth.accounts[3]))
    .then(r=>assert.equal(r>0,true,'it should have minted some token.'))
    .then(r=>ac.getStickersOf(web3.eth.accounts[2]))
    .then(r=>assert.equal(r.length,N_STICKERS_X_PACK,'it should have generated some stickers.'))
    .then(r=>ac.getStickersOf(web3.eth.accounts[3]))
    .then(r=>assert.equal(r.length,N_STICKERS_X_PACK,'it should have generated some stickers.'));
  });
  it("...should approve a sell order.", function() {
    return ac.getStickersOf(web3.eth.accounts[2])
    .then(r=>_stickerId=r[0])
    .then(r=>ac.approveAndSell(_stickerId, web3.toWei(0.1,'ether'), {from: web3.eth.accounts[2]}))
    .then(r=>ac.getApproved(_stickerId))
    .then(r=>assert.equal(r,zz.address,'it should have approved the sticker funds to ZtickerZ contract.'));
  });
  it("...should be in the order book.", function() {
    return zz.getOrderBook()
    .then(r=>{
      _i = r[0].map(e=>e.toNumber()).indexOf(_stickerId.toNumber());
      assert.equal(_i>=0, true, 'it should be in the order book.');
      _p = r[1][_i];
      _s = r[2][_i];
      assert.equal(_p, web3.toWei(0.1,'ether'), 'is at the correct price.');
      assert.equal(_s, web3.eth.accounts[2], 'is the correct seller.');
    });
  });
  it("...should cancel the order.", function() {
    return zz.cancelSellOrder(_stickerId, {from: web3.eth.accounts[2]})
    .then(r=> ac.getApproved(_stickerId))
    .then(r=> {
      var a = new web3.BigNumber(r);
      var b = new web3.BigNumber(0);
      assert.equal(a.toNumber(),  b.toNumber(), 'it should not be approved anymore.')
    })
    .then(r=> zz.getOrderBook())
    .then(r=>{
      _i = r[0].indexOf(_stickerId);
      assert.equal(_i, -1, 'it should have cleared the order book.');
    });
  });
  it("...should buy the sticker.", function() {
    var iBalance,fBalance;
    return ac.approveAndSell(_stickerId, web3.toWei(0.1,'ether'), {from: web3.eth.accounts[2]})
    .then(r=>cc.balanceOf(web3.eth.accounts[3]))
    .then(r=>{
      iBalance = r.toNumber();
      assert.equal(iBalance>web3.toWei(0.1,'ether'),true,'it should have enough funds.');
    })
    .then(r=>cc.buyAndTransfer(_stickerId, {from: web3.eth.accounts[3]}))
    .then(r=>cc.balanceOf(web3.eth.accounts[3]))
    .then(r=>{
      fBalance = r.toNumber();
      assert.equal(fBalance,iBalance-web3.toWei(0.1,'ether'),'it should have correctly transferred funds.');
    })
    .then(r=>ac.ownerOf(_stickerId))
    .then(r=>assert.equal(r,web3.eth.accounts[3],'it should have transferred the sticker.'));
  });
});
