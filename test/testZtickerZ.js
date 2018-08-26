var ZtickyZtorage = artifacts.require("./ZtickyZtorage.sol");
var ZtickyCoinZ = artifacts.require("./ZtickyCoinZ.sol");
var ZtickerZ = artifacts.require("ZtickerZ");

var ac,cc,zz, album;
const N_STICKERS = 100;
const N_STICKERS_X_PACK = 5;
const PACK_PRICE = 0.1;
contract('ZtickerZ', function(accounts) {
  before("...should set the instances.", function(){
    return ZtickyZtorage.deployed()
      .then((r)=> {ac=r; return ZtickyCoinZ.deployed();})
      .then((r)=>{cc=r; return ZtickerZ.deployed();})
      .then((r)=> zz = r)
      .then((r)=> ac.changeFrontend(zz.address, {from: accounts[0]}))
      .then((r)=> cc.changeFrontend(zz.address, {from: accounts[0]}));
  })

  it("...should check if available.", function() {
    return zz.albumCount()
    .then(r=>{
      album=r.toNumber();
      assert.equal(r>-1,true,'it should answer correctly.')
    });
  });

  it("...should create  an Album.", function() {
    return zz.createAlbum(N_STICKERS, N_STICKERS_X_PACK, web3.toWei(PACK_PRICE, 'ether'), {from: web3.eth.accounts[0]})
    .then(r=>zz.albumCount())
    .then(r=>assert.equal(r.toNumber(),album+1,'it should contain one more at the moment.'));
  });
  it("...should modify the tips Jar.", function() {
    return zz.changeTipsAddress(web3.eth.accounts[9], {from: web3.eth.accounts[0]})
    .then(r=>zz.tipsJar())
    .then(r=>assert.equal(r,web3.eth.accounts[9],'it should have changed the tips Jar.'));
  });
  it("...should compute initial coin reward.", function() {
    return zz.computeCoinReward(album, 0, {from: web3.eth.accounts[5]})
    .then(r=>assert.equal(r.toNumber(),web3.toWei(1,'ether')*1000*(PACK_PRICE/N_STICKERS_X_PACK),'it should equal 1000.'));
  });
  it("...should unwrap a Sticker.", function() {
    return zz.unwrapStickerPack(album, {from: web3.eth.accounts[5], value: web3.toWei(PACK_PRICE, 'ether')})
    .then(r=>cc.balanceOf(web3.eth.accounts[5]))
    .then(r=>assert.equal(r>0,true,'it should have minted some token.'))
    .then(r=>ac.getStickersOf(web3.eth.accounts[5]))
    .then(r=>assert.equal(r.length,N_STICKERS_X_PACK,'it should have generated some stickers.'));
  });
  it("...should verify total eth received equal balance.", function() {
    return zz.totalEthReceived()
    .then(r=>assert.equal(r.toNumber(),web3.eth.getBalance(zz.address).toNumber(),'it should equal the current balance.'));
  });
  it("...should complete an Album.", function() {
    return zz.createAlbum(1, 10, web3.toWei(PACK_PRICE, 'ether'), {from: web3.eth.accounts[0]})
    .then(r=>zz.unwrapStickerPack(album+1, {from: web3.eth.accounts[6], value: web3.toWei(PACK_PRICE, 'ether')}))
    .then(r=>zz.isAlbumComplete(web3.eth.accounts[6], album+1))
    .then(r=>assert.equal(r,true,'it should have completed the album.'));
  });
  it("...should compute redeemable ETH Reward.", function() {
    return cc.balanceOf(web3.eth.accounts[6])
    .then(r=>zz.computeAlbumReward(album+1, r.toNumber()))
    .then(r=>{
      var reward = r[0].toNumber();
      var tip = r[1].toNumber();
      var balance = web3.eth.getBalance(zz.address).toNumber();
      assert.equal(reward,balance*0.95,'it should equal the 95% of contract balance since as there is a single player.');
      assert.equal(tip,balance*0.05,'it should equal the 5% of contract balance since as there is a single player.');
    });
  });
  it("...should redeem correctly the reward.", function() {
    var jarBalance = web3.eth.getBalance(web3.eth.accounts[9]).toNumber();
    var initialBalance = web3.eth.getBalance(web3.eth.accounts[6]).toNumber();
    var contractBalance = web3.eth.getBalance(zz.address).toNumber();
    var reward,tip, coinBalance;
    return cc.balanceOf(web3.eth.accounts[6])
    .then(r=>coinBalance = r.toNumber())
    .then(r=>zz.computeAlbumReward(album+1, coinBalance))
    .then(r=>{
      reward = r[0].toNumber();
      tip = r[1].toNumber();
    })
    .then(r=>zz.redeemReward(album+1, coinBalance, {from: web3.eth.accounts[6]}))
    .then(r=>cc.balanceOf(web3.eth.accounts[6]))
    .then(r=>{
      var newJarBalance = web3.eth.getBalance(web3.eth.accounts[9]).toNumber();
      var newBalance = web3.eth.getBalance(web3.eth.accounts[6]).toNumber();
      var newContractBalance = web3.eth.getBalance(zz.address).toNumber();
      assert.equal(r.toNumber(),0,'it should have burnt all coins.');
      assert.equal(newBalance>initialBalance, true,'it should have redeemed ether.');
      assert.equal(newContractBalance, 0,'it should have spent all ether.');
      assert.equal(newJarBalance, jarBalance+tip,'it should have dropped some tips.');
    });
  });
});
