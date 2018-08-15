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
