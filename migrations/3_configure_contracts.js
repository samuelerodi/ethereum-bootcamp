var ZtickyZtorage = artifacts.require("ZtickyZtorage");
var ZtickyCoinZ = artifacts.require("ZtickyCoinZ");
var ZtickerZ = artifacts.require("ZtickerZ");

module.exports = function(deployer) {
  var cc, ac, zz;
  return ZtickyZtorage.deployed()
    .then(r => {ac=r; return ZtickyCoinZ.deployed();})
    .then(r => {cc=r; return ZtickerZ.deployed();})
    .then(r => zz = r)
    .then(r => {
      web3.eth.getAccounts((e,r)=>{
        if(e)return console.error(e);
        let account=r[0];
        ac.changeFrontend(zz.address, {from: account});
        cc.changeFrontend(zz.address, {from: account});
        zz.createAlbum(40, 4, web3.toWei(0.01, 'ether'), {from: account});
      })

    });
};
