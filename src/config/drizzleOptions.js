import ZtickerZ from '../contracts/ZtickerZ.json';
import ZtickyCoinZ from '../contracts/ZtickyCoinZ.json';
import ZtickyZtorage from '../contracts/ZtickyZtorage.json';

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545'
    }
  },
  contracts: [
    ZtickerZ,
    ZtickyCoinZ,
    ZtickyZtorage
  ],
  events: {
    ZtickerZ: ['Zticker', 'AlbumComplete'],
    ZtickyCoinZ: ['Mint', 'Transfer'],
    ZtickerZtorage: ['Transfer', 'Approval'],
  },
  polls: {
    accounts: 2000
  }
}

export default drizzleOptions
