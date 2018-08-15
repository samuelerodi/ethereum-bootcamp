
import ZtickyZtorage from '../contracts/ZtickyZtorage.json';
import web3 from '../config/web3';



const contract = require('truffle-contract')
const ZtickerZContract = contract(ZtickyZtorage);
ZtickerZContract.setProvider(web3.currentProvider);

export default ZtickerZContract;
