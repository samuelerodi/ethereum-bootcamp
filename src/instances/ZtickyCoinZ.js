import ZtickyCoinZ from '../contracts/ZtickyCoinZ.json';
import web3 from '../config/web3';



const contract = require('truffle-contract')
const ZtickerZContract = contract(ZtickyCoinZ);
ZtickerZContract.setProvider(web3.currentProvider);

export default ZtickerZContract;
