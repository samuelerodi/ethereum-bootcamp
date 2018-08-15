import ZtickerZ from '../contracts/ZtickerZ.json';
import web3 from '../config/web3';



const contract = require('truffle-contract')
const ZtickerZContract = contract(ZtickerZ);
ZtickerZContract.setProvider(web3.currentProvider);

export default ZtickerZContract;
