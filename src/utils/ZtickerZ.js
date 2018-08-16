import {fromZCZ, toZCZ} from './ZtickyCoinZ';

export function album(r){
  return {
      albumId:r[0].toNumber(),
      nStickers:r[1].toNumber(),
      nStickersPerPack:r[2].toNumber(),
      packPrice:r[3].toNumber(),
      ethReceived:r[4].toNumber(),
      mintedCoins:r[5].toNumber(),
      burntCoins:r[6].toNumber(),
      nStickersInCirculation:r[7].toNumber(),
      nRewardedUsers:r[8].toNumber()
  }
}
export function getStickersOf(r){
  return r.map(e=> e.toString());
}

export function getStickersDetails(r){
  return {
    _albumId: r[0].map(e=> e.toNumber()),
    _stn: r[1].map(e=> e.toString()),
     _sId: r[2].map(e=> e.toString()),
     _owner: r[3],
     _onSale: r[4],
    _onSalePrice: r[5].map(e=> e.toNumber())
  }
}

export function getOrderBook(r){
  return {
    stickers:r[0].map(e=>e.toString()),
    prices:r[1].map(e=> toZCZ(e)),
    sellers: r[2]
  }
}

export function getAlbumStats(r){
  return {
    _nStickers:r[0].toNumber(),
    _nStickersPerPack: r[1].toNumber(),
    _packPrice: r[2].toNumber(),
    _ethReceived: r[3].toNumber(),
    _mintedCoins: r[4].toNumber(),
    _burntCoins: r[5].toNumber(),
    _nStickersInCirculation: r[6].toNumber(),
    _stnDistribution: r[7].map(e=>e.toNumber()),
    _nextStnGenReward: r[8].map(e=>e.toNumber()),
    _rewardedUsers: r[9]
    // _rewardedEth: r[10].map(e=>e.toNumber()),
    // _rewardedCoinBurnt: r[11].map(e=>e.toNumber())
  }
}

export function computeAlbumReward(r){
  return {
    _eth:toZCZ(r[0]),
    _tips:toZCZ(r[1])
  }
}
